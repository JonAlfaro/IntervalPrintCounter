# Interval Print Counter
A simple counter service that only prints on a client-defined interval, and two interfaces for interacting with this service. 

This repository contains three projects:`cli`, `ui`, and `api`. The `api` directory contains all the logic of the backend service, where `cli` and `ui` are interfaces for interaction with the `api`.

Below are more details on each individual project and how to run them.

### 1.0) api
Inside the `api` directory, there is an Express API server with a single WebSocket route. It handles all of the interval timing logic; accepting messages from clients to increment counters, while also pushing tracked counters at the desired interval.

API Documentation can be found [here](api\README.md)

### 1.1) Configuration
| Type                 | Key  | Default | Description                   |
|----------------------|------|---------|-------------------------------|
| Environment Variable | PORT | 4040    | PORT that api will listen on. |

### 1.2) Using Public API
There is a free instance of this api running at [ws://192.53.169.109:4040](ws://192.53.169.109:4040) that uses the latest built api [Docker image](https://hub.docker.com/r/jkizo/interval-ws-server). **Please Note:** This API is insecure, and not production ready, it is hosted for convenience during development. For this to be production ready it would require TSL as most browsers will not allow insecure web socket connection.

### 1.3) Running with NodeJS
Running the server with default config:
```sh
cd api
npm install
npm run start
```

Running the server with PORT configured:
```sh
cd api
npm install
PORT=8080 npm run start
```

### 1.4) Running with Docker
Running the server container with default config:
```sh
docker run -p 4040:4040 jkizo/interval-ws-server:latest
```

Running the server container with `PORT` configured:
```sh
docker run -p 8080:8080 -e PORT=8080 jkizo/interval-ws-server:latest
```

## 2.0) ui

Inside the ui directory is a React UI for interfacing with the Interval API. 

### 2.1) Configuration

| Type                 | Key               | Default | Description                                     |
|----------------------|-------------------|---------|-------------------------------------------------|
| Environment Variable | INTERVAL_API_ADDR | ws://192.53.169.109:4040 | Target Interval API server to communicate with. |

### 2.2) Running with NodeJS

Running the React UI with default config:
```sh
cd api
npm install
npm run start
```

Running the React UI with `INTERVAL_API_ADDR` configured:
```sh
cd api
npm install
INTERVAL_API_ADDR="ws://localhost:8080" npm run start
```

## 3.0) cli

A CLI executable that communicates with the Interval API server. There are no sub-commands, but there is a help flag
```sh
$ countercli --help

countercli is a cli client for communicating with the interval print counter server
          
   The target server address can configured with the 'addr' flag.
   Only one argument is required, and it is the interval inbetween prints in seconds

   Example:
        ./countercli 3 --addr=localhost:4200

Usage:
  countercli INTERVAL [flags]

Flags:
  -A, --addr string   http service address (default "192.53.169.109:4040")
  -h, --help          help for countercli
```

### 3.1) Configuration

| Type                 | Key               | Default | Description                                     |
|----------------------|-------------------|---------|-------------------------------------------------|
| CLI Flag | addr | ws://192.53.169.109:4040 | Target Interval API server to communicate with. |
| Arugment | INTERVAL | `none` | Interval the server should send messages back to the client in seconds. Must be greater than 0  |

### 3.2) Running with prebuilt executable
You can download the latest prebuilt CLI binaries [here](https://github.com/JonAlfaro/IntervalPrintCounter/releases/latest).

Running countercli with default config:
```sh
countercli 5
```

Running the React UI with `addr` configured:
```sh
countercli 5 --addr=localhost:8080
```



### 3.3) Building from source and running
To build from source you will require [golang 1.8](https://dl.google.com/go/go1.18.linux-amd64.tar.gz) installed.

Building from source and then running:
```
cd cli
go build -o countercli .
./countercli 5
```