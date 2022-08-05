import { useState } from "react"

export default function useNumberState(initNumber: number):  [number, (newNumber: any) => void] {
  const [numberState, setNumberState] = useState(initNumber)

  const setNewNumber = (newValue: any) => {
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