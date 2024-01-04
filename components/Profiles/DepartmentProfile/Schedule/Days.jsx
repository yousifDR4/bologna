import React, { memo, useMemo } from 'react'
import classes from"./Schedule.module.css"
import Card from './Card'
import AddDay from './AddDay'
const MemorizeAddDay=memo(AddDay);
const Days = ({name ,show,setshow,addhandler}) => {
  console.log(show," ",name);
  const memorizeAddDay=useMemo(()=>( <MemorizeAddDay name={name} show={show} setshow={setshow} />),[show])
  return (
   memorizeAddDay
  )
}

export default Days