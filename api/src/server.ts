import express, { Request, NextFunction, response } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
import expressWs from 'express-ws';
import { buildFibCache, isFib } from './fib';

console.log('Building Fibonacci Cache to 1000 places');
buildFibCache(1000);

const app = expressWs(express()).app;
const ajv = new Ajv();
const PORT = process.env.PORT || 4040;
console.log("PORT was configured to ", PORT)

interface Response {
  message?: string;
  errors?: string[];
}

interface TrackedCounter {
  number: number;
  count: number;
}

interface CounterMessageRequest {
  number: number;
  action: string;
}

// counterMessageRequestSchema - JSON Schema used for request validation
const counterMessageRequestSchema: JSONSchemaType<CounterMessageRequest> = {
  type: 'object',
  properties: {
    number: { type: 'integer' },
    action: {
      type: 'string',
      enum: ['ADD', 'HALT', 'RESUME', 'QUIT'],
    },
  },
  required: ['action'],
  anyOf: [
    {
      not: {
        properties: {
          action: { const: 'ADD' },
        },
        required: ['action'],
      },
    },
    { required: ['action', 'number'] },
  ],
  additionalProperties: false,
};

app.ws('/counter', function (ws, req) {
  console.log("New Connection Established")
  let trackedCounters: TrackedCounter[] = [];
  const counterMessageRequestValidate = ajv.compile(
    counterMessageRequestSchema,
  );

  // Validate INTERVAL is set in the header
  const interval = Number(req.query['interval']);
  if (isNaN(interval)) {
    const resp: Response = {
      errors: ["Query - 'interval' required. Must be a number(s)"],
    };
    ws.close(1007, JSON.stringify(resp));
    return;
  } else if (interval <= 0) {
    const resp: Response = {
      errors: ["Query - 'interval' must be greater than zero"],
    };
    ws.close(1007, JSON.stringify(resp))
  }

  //  startTimer - Return a setInterval that sends tracked numbers 
  //  to the client on the configured INTERVAL(s)
  function startTimer() {
    return setInterval(() => {
      trackedCounters.sort(function (a, b) {
        return b.count - a.count;
      });

      const msgSuffix =
        trackedCounters.length > 0
          ? trackedCounters
              .map(function (tCounter) {
                return `${tCounter.number}:${tCounter.count}`;
              })
              .join(', ')
          : 'None';

      const resp: Response = {
        message: 'Tracked [Number:Counter]: ' + msgSuffix,
      };

      ws.send(JSON.stringify(resp));
    }, interval * 1000);
  }

  // init startTimer on new connection
  let intervalID = startTimer();

  ws.on('message', function (msg) {
    let resp: Response = {};
    let parsed: any;

    // Validate payload is JSON
    try {
      parsed = JSON.parse(msg.toString());
    } catch (e) {
      resp.errors = ['payload is not a JSON Object'];
      ws.send(JSON.stringify(resp));
      return;
    }

    // Validate Request Body
    if (counterMessageRequestValidate(parsed)) {
      // Select action to peform
      switch (parsed.action) {
        case 'ADD':
          const idx = trackedCounters.findIndex(
            (e) => e.number === parsed.number,
          );
          if (idx >= 0) {
            trackedCounters[idx].count++;
          } else {
            trackedCounters.push({ count: 1, number: parsed.number });
          }

          if (isFib(parsed.number)) {
            resp.message = 'FIB';
          }
          break;
        case 'HALT':
          resp.message = "Timer halted"
          clearTimeout(intervalID);
          break;
        case 'RESUME':
          resp.message = "Timer resumed"
          intervalID = startTimer();
          break;
        case 'QUIT':
          const closeReason: Response = {
            message: 'Thanks for player, connection terminated by client',
          };
          ws.close(1000, JSON.stringify(closeReason));
          break;
        default:
          break;
      }
    } else {
      // Set Error
      resp.errors = counterMessageRequestValidate.errors?.map((err) => {
        if (err.instancePath) {
          return `property '${err.instancePath}' ${err.message}`;
        }

        return `payload ${err.message}`;
      });
    }

    ws.send(JSON.stringify(resp));
  });

  ws.on('close', function () {
    console.log("Connection Ended")
    clearTimeout(intervalID);
  });
});

export const server = app;

app.listen(PORT, () => {
  console.log(`Starting server listening on port: ${PORT}`);
});

