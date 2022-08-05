package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/url"
	"os"
	"os/signal"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/mattn/go-runewidth"
	"github.com/nsf/termbox-go"
	"github.com/spf13/cobra"
)

var (
	addr                 string // Flag
	userInput            string
	connectionTerminated bool
)

type counterMsgTracker struct {
	messages []string
	errors   []string
}

type counterMsgResp struct {
	Message string   `json:"message,omitempty"`
	Errors  []string `json:"errors,omitempty"`
}

type counterMsgRequest struct {
	Action string `json:"action,omitempty"`
	Number int    `json:"number,omitempty"`
}

func main() {
	rootCmd.PersistentFlags().StringVarP(&addr, "addr", "A", "192.53.169.109:4040", "http service address")

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "There was an error while executing: '%s'", err)
		os.Exit(1)
	}
}

var rootCmd = &cobra.Command{
	Use:   "countercli INTERVAL",
	Args:  cobra.ExactArgs(1),
	Short: "countercli - a cli client for communicating with the interval print counter server",
	Long: `countercli is a cli client for communicating with the interval print counter server
	  
   The target server address can configured with the 'addr' flag.
   Only one argument is required, and it is the interval inbetween prints in seconds

   Example:
   	./countercli 3 --addr=localhost:4200`,
	Run: func(cmd *cobra.Command, args []string) {

		msgState := counterMsgTracker{
			messages: make([]string, 0),
			errors:   make([]string, 0),
		}

		// initalize termbox
		if err := termbox.Init(); err != nil {
			panic(fmt.Sprintf("failed to initialize termbox: %s", err))
		}
		defer termbox.Close()
		termbox.SetInputMode(termbox.InputEsc)

		drawClient := func() {
			_, height := termbox.Size()

			if connectionTerminated {
				tbprint(0, height-2, termbox.ColorWhite, termbox.ColorDefault, "PRESS ESC TO EXIT")
			} else {
				tbprint(0, height-2, termbox.ColorWhite, termbox.ColorDefault, "Input: "+userInput)
			}

			for i := 0; i < len(msgState.messages); i++ {
				tbprint(0, height-3-i, termbox.ColorRed, termbox.ColorDefault, msgState.messages[len(msgState.messages)-1-i])
			}

			tbprint(0, 0, termbox.ColorRed, termbox.ColorDefault, fmt.Sprintf("Connected to ws://%s with Interval = %ss - PRESS ESC TO EXIT", addr, args[0]))

			err := termbox.Flush()
			if err != nil {
				panic(fmt.Sprintf("failed to flush termbox: %s\n", err))
			}
		}

		// Initial first frame draw call
		drawClient()

		flag.Parse()
		log.SetFlags(0)

		interrupt := make(chan os.Signal, 1)
		signal.Notify(interrupt, os.Interrupt)

		u := url.URL{Scheme: "ws", Host: addr, Path: "/counter", RawQuery: "interval=" + args[0]}

		c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
		if err != nil {
			log.Fatal("Failed to dial websocket:", err)
		}
		defer c.Close()

		done := make(chan struct{})

		go func() {
			defer close(done)
			defer drawClient()
			for {
				_, message, err := c.ReadMessage()
				if err != nil {
					connectionTerminated = true
					msgState.messages = append(msgState.messages, "Connection terminated, thanks for playing")
					return
				}

				resp := new(counterMsgResp)
				err = json.Unmarshal(message, resp)
				if err != nil {
					fmt.Println(err)
					panic(err)
				}

				msgState.messages = append(msgState.messages, resp.Message)
				termbox.Clear(termbox.ColorDefault, termbox.ColorDefault)

				// Redraw terminal whenever we get a new message.
				drawClient()
			}
		}()

		go func() {
			for {
				select {
				case <-done:
					return
				case <-interrupt:
					log.Println("interrupt")

					// Cleanly close the connection by sending a close message and then
					// waiting (with timeout) for the server to close the connection.
					err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
					if err != nil {
						log.Println("write close:", err)
						return
					}
					select {
					case <-done:
					case <-time.After(time.Second):
					}
					return
				}
			}
		}()

		// RENDER LOOP
		for {
			switch ev := termbox.PollEvent(); ev.Type {
			case termbox.EventKey:
				switch ev.Key {
				case termbox.KeyEsc:
					os.Exit(0)
				case termbox.KeySpace:
					userInput += " "
				case termbox.KeyEnter:
					if connectionTerminated {
						break
					}

					if len(userInput) > 0 {
						var req counterMsgRequest
						if userInput == "halt" {
							req = counterMsgRequest{
								Action: "HALT",
							}
						} else if userInput == "resume" {
							req = counterMsgRequest{
								Action: "RESUME",
							}
						} else if userInput == "terminate" {
							req = counterMsgRequest{
								Action: "TERMINATE",
							}
						} else if v, err := strconv.Atoi(userInput); err == nil {
							req = counterMsgRequest{
								Action: "ADD",
								Number: v,
							}
						} else {
							userInput = "Unknown Command"
							termbox.Clear(termbox.ColorDefault, termbox.ColorDefault)
							break
						}

						reqRaw, err := json.Marshal(req)
						if err != nil {
							log.Println("write:", err)
							return
						}

						err = c.WriteMessage(websocket.TextMessage, reqRaw)
						if err != nil {
							log.Println("write:", err)
							return
						}

						userInput = ""

						termbox.Clear(termbox.ColorDefault, termbox.ColorDefault)
					}
				case termbox.KeyBackspace2:
					if len(userInput) > 0 {
						userInput = userInput[0 : len(userInput)-1]
					}
					termbox.Clear(termbox.ColorDefault, termbox.ColorDefault)
				case termbox.KeyBackspace:
					if len(userInput) > 0 {
						userInput = userInput[0 : len(userInput)-1]
					}
					termbox.Clear(termbox.ColorDefault, termbox.ColorDefault)
				default:
					if connectionTerminated {
						termbox.Clear(termbox.ColorDefault, termbox.ColorDefault)
						break
					}

					if userInput == "Unknown Command" {
						userInput = string(ev.Ch)
						termbox.Clear(termbox.ColorDefault, termbox.ColorDefault)
					} else if ev.Ch != 0 {
						userInput += string(ev.Ch)
					}
				}
			case termbox.EventError:
				panic(fmt.Sprintf("termbox event error: %s", ev.Err.Error()))
			}

			// Draw to terminal
			drawClient()
		}
	},
}

// Draw a print line to terminal
func tbprint(x, y int, fg, bg termbox.Attribute, msg string) {
	for _, c := range msg {
		termbox.SetCell(x, y, c, fg, bg)
		x += runewidth.RuneWidth(c)
	}
}
