# Interval Print Counter


## Getting Started

### api
Inside the api directory there is a Express API server with a single WebSocket route. It handle's all of the interval timing logic; accepting messages from clients to increment counter, while also pushing tracked counters at the desired interval.

### Configuration
| Type                 | Key  | Default | Description                   |
|----------------------|------|---------|-------------------------------|
| Environment Variable | PORT | 4040    | PORT that api will listen on. |

### Using Public API
There is a free instance of this api running at [ws://192.53.169.109:4040](ws://192.53.169.109:4040) that uses the latest built api [Docker image](https://hub.docker.com/r/jkizo/interval-ws-server). **Please Note:** this API is insecure, not production ready, it is hosted only for convience during development. For this to be production ready it would require TSL as most browsers will not allow insecure ws connection.

### Running with NodeJS
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

### Running with Docker
Running the server container with default config:
```sh
docker run -p 4040:4040 jkizo/interval-ws-server:latest
```

Running the server container with PORT configured:
```sh
docker run -p 8080:8080 -e PORT=8080 jkizo/interval-ws-server:latest
```

### ui

Inside the ui directory is a React UI for interfacing with the Interval API. 

### Configuration

| Type                 | Key               | Default | Description                                     |
|----------------------|-------------------|---------|-------------------------------------------------|
| Environment Variable | INTERVAL_API_ADDR | ws://192.53.169.109:4040 | Target Interval API server to communicate with. |

### Running with NodeJS

Running the server with default config:
```sh
cd api
npm install
npm run start
```

Running the server with INTERVAL_API_ADDR configured:
```sh
cd api
npm install
INTERVAL_API_ADDR="ws://localhost:4040" npm run start
```

### cli

### Configuration

| Type                 | Key               | Default | Description                                     |
|----------------------|-------------------|---------|-------------------------------------------------|
| CLI Flag | addr | ws://192.53.169.109:4040 | Target Interval API server to communicate with. |

### Running with executable



### Building from source and running