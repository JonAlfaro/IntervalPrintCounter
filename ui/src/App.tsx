import React from 'react'
import './App.css'
import {Box, Typography, Link, ThemeProvider} from '@mui/material'
import appTheme from "./themes/appTheme"

const githubUrl = ''

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <div className="app">
        <Box maxWidth={600} marginTop={10}>
          <Box>
            <Typography variant="h3" fontWeight='bold' color='primary' display="inline" gutterBottom>Interval Print Counter</Typography>
          </Box>
          <Box marginTop={4} paddingX={4}>
            <Typography color='secondary' align='justify'>
              TODO
            </Typography>
          </Box>
          <Box className="glass" marginTop={4} paddingX={4} style={{minHeight: "90px"}}>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default App
