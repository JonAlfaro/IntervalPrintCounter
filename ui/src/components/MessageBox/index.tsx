import React from 'react'
import { Send } from '@mui/icons-material'
import { IconButton, InputAdornment, List, ListItem, ListItemText, OutlinedInput, Tooltip } from '@mui/material'
import useNumberState from 'hooks/UseNumberState'

interface MessageBoxProps {
  messages: string[]
  disabled: boolean
  sendNumber: (n: number) => void
}

const MessageBox: React.FC<MessageBoxProps> = ({ messages, disabled, sendNumber }) => {
  const [sendValue, setSendValue] = useNumberState(1)

  return (
    <>
      <List
        sx={{
          position: 'relative',
          overflow: 'auto',
          minHeight: 200,
          maxHeight: 200,
          display: "flex",
          flexDirection: "column-reverse",
          '& ul': { padding: 0 },
        }}
      >
        {
          messages.map((_, idx) => {
            return (
              <ListItem key={`msg-${idx}`} disablePadding>
                <ListItemText primary={messages[messages.length - 1 - idx]} />
              </ListItem>
            )
          })
        }
      </List>
      <OutlinedInput
        id="outlined-adornment-weight"
        disabled={disabled}
        value={sendValue}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            sendNumber(sendValue)
          }
        }}
        onChange={(e) => { setSendValue(e.target.value) }}
        endAdornment={<InputAdornment position="end">
          <Tooltip title="Send Number to be Incremented">
            <IconButton
              disabled={disabled}
              aria-label="toggle password visibility"
              edge="end"
              onClick={() => {
                sendNumber(sendValue)
              }}
            ><Send /></IconButton>
          </Tooltip>
        </InputAdornment>}
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          'aria-label': 'weight',
        }}
      />
    </>
  )
}

export default MessageBox