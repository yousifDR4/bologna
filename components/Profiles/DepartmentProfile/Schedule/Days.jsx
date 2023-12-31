import React from 'react'
import classes from"./Schedule.module.css"
import Card from './Card'
const Days = (probs) => {
  return (
    <div className={classes.day}>
        <h2 className={classes.daytitle}>{probs.name}</h2>
    <Card/>
    </div>
  )
}

export default Days