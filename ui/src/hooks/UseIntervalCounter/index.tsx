import { useCallback, useEffect, useState } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket"

// Load API address server from Env
const INTERVAL_API_ADDR = process.env.INTERVAL_API_ADDR || "ws://192.53.169.109:4040/counter"

export interface useIntervalCounterArgs {
  interval: number
  stream: boolean
}

interface Response {
  message?: string;
  errors?: string[];
}


export default function useIntervalCounter() {
  const [err, setErr] = useState(undefined as string[] | undefined)
  const [messages, setMessages] = useState([] as string[])
  const [socket, setSocket] = useState(null as W3CWebSocket | null)
  const [connected, setConnected] = useState(false)

  // CleanUp Old Socket Connections
  useEffect(() => {
    return (() => {
      socket?.close()
    })
  }, [socket])

  const startConnection = useCallback((interval: number) => {
    const client = new W3CWebSocket(`${INTERVAL_API_ADDR}?interval=${interval}`)
    client.onopen = () => {
      setConnected(true)
    }

    client.onmessage = (event) => {
      const msgResp: Response = JSON.parse(event.data.toString())

      if (msgResp.message !== undefined) {
        const newMsg = msgResp.message
        messages.push(newMsg)
        setMessages([...messages])
      }

      if (msgResp.errors) {
        setErr(msgResp.errors)
      }
    }

    client.onerror = function () {
      setConnected(false)
    }

    client.onclose = function (event) {
      setConnected(false)
      try {
        const msgResp: Response = JSON.parse(event.reason)
        if (msgResp.errors) {
          setErr(msgResp.errors)
        }

        // Get client termination message
        if (msgResp.message !== undefined) {
          const newMsg = msgResp.message
          messages.push(newMsg)
          setMessages([...messages])
        }
      } catch (e) {
        if (event.code !== 1000) {
          setErr(["Connection closed unexpectedly - Code: " + event.code])
        }
      }
    }

    setSocket(client)
  }, [messages])

  const sendNumber = useCallback((n: number) => {
    const payload = JSON.stringify({
      action: "ADD",
      number: Number(n)
    })

    socket?.send(payload)
  }, [socket])

  const haltTimer = useCallback(() => {
    socket?.send(JSON.stringify({
      action: "HALT",
    }))
  }, [socket])

  const resumeTimer = useCallback(() => {
    socket?.send(JSON.stringify({
      action: "RESUME",
    }))
  }, [socket])

  const terminateTimer = useCallback(() => {
    socket?.send(JSON.stringify({
      action: "TERMINATE",
    }))
  }, [socket])

  const clearErr = useCallback(() => {
    setErr(undefined)
  }, [])


  return {
    err,
    clearErr,
    connected,
    messages,
    startConnection,
    sendNumber,
    haltTimer,
    resumeTimer,
    terminateTimer
  }
}