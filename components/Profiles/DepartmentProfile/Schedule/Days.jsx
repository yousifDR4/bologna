import React, { memo, useMemo } from 'react'
import classes from"./Schedule.module.css"
import Card from './Card'
import AddDay from './AddDay'
const MemorizeAddDay=memo(AddDay);
const Days = ({name}) => {
  
  const memorizeAddDay=useMemo(()=>( <MemorizeAddDay  name={name} />),[])
  return (
    <div className={classes.lectures}>
   {memorizeAddDay}
   </div>
  )
}

export default Days