import React from 'react'
import './App.css'
import { Box, Typography, Link, ThemeProvider, Stack, TextField, Button, InputAdornment, OutlinedInput, IconButton, ListItem, List, ListItemText } from '@mui/material'
import appTheme from "./themes/appTheme"
import { Send } from '@mui/icons-material'

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <div className="app">
        <Box maxWidth={800} marginTop={10}>
          <Box>
            <Typography variant="h3" fontWeight='bold' color='primary' display="inline" gutterBottom>Interval Print Counter</Typography>
          </Box>
          <Box marginTop={4} paddingX={4}>
            <Typography color='secondary' align='justify'>
              A simple counter that tracks number inputted and prints results in a defiend interval.
            </Typography>
          </Box>
          <Box className="glass" marginTop={4} padding={2}>
            <Stack direction="column" spacing={2}>
              <Typography color='secondary' align='justify'>
                First step is set the interval, or rather how often to print the results of your counters.
              </Typography>
              <TextField
                label="Interval"
                helperText="How often to print counters in seconds"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
              <Button variant="contained" >
                Connect
              </Button>
            </Stack>
          </Box>
          <Box className="glass" marginTop={4} padding={2}>
            <Stack direction="column" spacing={2}>
              <Typography variant="h6" fontWeight='bold' color='secondary' align='left'>
                Messages - Not Connected
              </Typography>
              <List>
                <ListItem disablePadding>
                  <ListItemText primary="Message" />
                </ListItem>
              </List>
              <OutlinedInput
                id="outlined-adornment-weight"
                endAdornment={<InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                  ><Send /></IconButton>
                </InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight',
                }}
              />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" fullWidth>
                  Send
                </Button>
                <Button variant="contained" fullWidth >
                  Halt
                </Button>
                <Button variant="contained" fullWidth>
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
