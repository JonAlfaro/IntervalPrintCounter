# API Documentation

## Routes

### /counter
#### Protocol
**Protocol: web-socket**
#### Parameters
| Parameter Type | Type    | Name     | Required | Description                                                                                    |
|----------------|---------|----------|----------|------------------------------------------------------------------------------------------------|
| Query          | Integer | interval | true     | Interval the server should send messages back to the client in seconds. Must be greater than 0 |

**Example URL**:
```sh
ws://localhost:4040/counter?interval=2
```

#### Send Message Parameters
| Parameter Type     | Type    | Name   | Required               | Description                                                                 |
|--------------------|---------|--------|------------------------|-----------------------------------------------------------------------------|
| Body JSON Property | Enum    | action | true                   | Action that should be performed. ENUM["ADD", "HALT", "RESUME", "TERMINATE"] |
| Body JSON Property | Integer | number | true if action = "ADD" | Number that should be incremented in service counter.                       |

**Example Body**:
```json
{
    "action":"ADD",
    "number": 1
}
```

##### Actions
Multiple actions can be done depending on the value of `action` in the Message Request.
* ADD - Increment a number's counter on the API server if it exists, if it doesn't exist start tracking the number from 1.
* HALT - Pause server timer and stops interval reporting of counters
* RESUME - Resume interval reporting on the server.
* TERMINATE - Request server to stop interval reporting and close connection.


#### Recieve Message Parameters
| Parameter Type     | Type     | Name    | Required | Description                                  |
|--------------------|----------|---------|----------|----------------------------------------------|
| Body JSON Property | String   | message | false    | String of sent message from server           |
| Body JSON Property | []String | number  | false    | Array of any errors that occurred on server. |

**Example Response**:
```json
{
    "message":"Tracked [Number:Counter]: 10:2",
}
```

