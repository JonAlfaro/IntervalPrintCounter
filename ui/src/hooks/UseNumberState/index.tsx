import { useState } from "react"

export default function useNumberState(initNumber: number):  [number, (newNumber: string) => void] {
  const [numberState, setNumberState] = useState(initNumber)

  const setNewNumber = (newValue: string) => {
    const newNumber = Number(newValue)
    if (!isNaN(newNumber)) {
      setNumberState(newNumber)
    } 
  }


  return [
    numberState,
    setNewNumber
  ]
}