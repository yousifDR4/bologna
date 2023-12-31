import React from 'react'
import classes from"./Schedule.module.css"
import Days from './Days'
import Card from './Card';
const Schedule = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', , 'Saturday'];
  return (
    <div className={`${classes.cont}`}>
    {daysOfWeek.map((val,index)=><Days name={val}/>)}  

    </div>
  )
}
export default Schedule