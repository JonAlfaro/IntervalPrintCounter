import express, { Request, NextFunction, response } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';
import expressWs from 'express-ws';
import { buildFibCache, isFib } from './fib';

console.log('Building Fibonacci');
buildFibCache(1000);

const app = expressWs(express()).app;
const ajv = new Ajv();
const port = 4200;

// https://stackoverflow.com/questions/23437476/in-typescript-how-to-check-if-a-string-is-numeric
// https://www.split.io/blog/node-js-typescript-express-tutorial/

interface Response {
  message?: string;
  errors?: string[];
}

interface CounterResponse {
  number: number;
  count: string;
}

interface TrackedCounter {
  number: number;
  count: number;
}

interface CounterMessageRequest {
  number: number;
  action: string;
}

const counterMessageRequestSchema: JSONSchemaType<CounterMessageRequest> = {
  type: 'object',
  properties: {
    number: { type: 'integer' },
    action: {
      type: 'string',
      enum: ['ADD', 'HALT', 'RESUME', 'TERMINATE'],
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
  console.log('NEWW !!!');
  let trackedCounters: TrackedCounter[] = [];
  const counterMessageRequestValidate = ajv.compile(
    counterMessageRequestSchema,
  );

  // Validate INTERVAL is set in the header
  const interval = Number(req.query['interval']);
  if (isNaN(interval)) {
    console.log('HELLO!??');
    const resp: Response = {
      errors: ["Query - 'interval' required. Must be a number(s)"],
    };
    ws.close(1007, JSON.stringify(resp));
    return;
  }

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
      switch (parsed.action) {
        case 'ADD':
          const idx = trackedCounters.findIndex(
            (e) => e.number === parsed.number,
          );
          if (idx >= 0) {
            trackedCounters[idx].count++;
          } else {
            trackedCounters.push({ count: 0, number: parsed.number });
          }

          if (isFib(parsed.number)) {
            resp.message = 'FIB!!!';
          }
          break;
        case 'HALT':
          clearTimeout(intervalID);
          break;
        case 'RESUME':
          intervalID = startTimer();
          break;
        case 'TERMINATE':
          ws.close();
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
    clearTimeout(intervalID);
  });
});

app.listen(port, () => {
  console.log(`Starting server listening on port: ${port}`);
});
