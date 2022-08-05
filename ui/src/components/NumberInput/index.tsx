import { TextField } from '@mui/material'
import React from 'react'
import './App.css'

interface NumberInputProps {
  label: string
  helpText: string
}

const NumberInput: React.FC<NumberInputProps> = ({label, helpText}) => {

  return (
    <TextField
      label={label}
      helperText={helpText}
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
  )
}

export default NumberInput