import React from 'react'
import classes from"./Schedule.module.css"
import Card from './Card'
import AddDay from './AddDay'
const Days = ({name}) => {
  return (
   <AddDay name={name}/>
  
  )
}

export default Days