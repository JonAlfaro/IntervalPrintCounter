import { Alert, Box, Button, Stack, TextField, ThemeProvider, Typography } from '@mui/material'
import MessageBox from 'components/MessageBox'
import useIntervalCounter from 'hooks/UseIntervalCounter'
import useNumberState from 'hooks/UseNumberState'
import React, { useState } from 'react'
import './App.css'
import appTheme from "./themes/appTheme"

const App = () => {
  const [intervalValue, setIntervalValue] = useNumberState(4)
  const [paused, setPaused] = useState(false)
  const { err, clearErr, connected, messages, startConnection, terminateTimer, sendNumber, haltTimer, resumeTimer } = useIntervalCounter()

  return (
    <ThemeProvider theme={appTheme}>
      <div className="app">
        <Box maxWidth={800} marginTop={5}>
          <Box>
            <Typography variant="h3" fontWeight='bold' color='primary' display="inline" gutterBottom>Interval Print Counter</Typography>
          </Box>
          <Box marginTop={4} paddingX={4}>
            <Typography color='secondary' align='justify'>
              A simple counter that tracks number inputted and prints results in a defiend interval.
            </Typography>
          </Box>
          {
            err ?
              <Box marginTop={4}>
                <Alert severity="error" onClose={() => { clearErr() }}>{err && err.length > 0 ? `Errors: ${err.join(", ")}` : ""}</Alert>
              </Box> :
              <></>
          }
          <Box className="glass" marginTop={4} padding={2}>
            <Stack direction="column" spacing={2}>
              <Typography color='secondary' align='justify'>
                First step is set the interval, or rather how often to print the results of your counters.
              </Typography>
              <TextField
                label="Interval"
                disabled={connected}
                value={intervalValue}
                onChange={(e) => { setIntervalValue(e.target.value) }}
                helperText="How often to print counters in seconds"
                InputLabelProps={{ shrink: true }}
                inputProps={{ inputMode: 'numeric', pattern: '[1-9]*' }} />
              <Button variant="contained" onClick={() => { startConnection(intervalValue) }} disabled={connected}>
                {connected ? "Connected" : "Connect"}
              </Button>
            </Stack>
          </Box>
          <Box className="glass" marginTop={4} padding={2}>
            <Stack direction="column" spacing={2}>
              <Typography variant="h6" fontWeight='bold' color={connected ? "primary" : "secondary"} align='left'>
                Messages - {connected ? "Connected" : "Not Connected"} {paused ? "PAUSED" : ""}
              </Typography>
              <MessageBox messages={messages} sendNumber={sendNumber} disabled={!connected} />
              <Stack direction="row" spacing={2}>

                <Button variant="contained" fullWidth disabled={!connected} onClick={() => {
                  if (paused) {
                    resumeTimer()
                    setPaused(false)
                  } else {
                    haltTimer()
                    setPaused(true)
                  }
                }}>
                  {paused ? "Resume" : "Halt"}
                </Button>
                <Button variant="contained" fullWidth disabled={!connected} onClick={() => { terminateTimer(); setPaused(false) }}>
                  Terminate
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default App
