import React, { useState } from 'react'
import classses from"./Schedule.module.css"
import AddDayForm from './AddDayForm';
const AddDay = ({name}) => {
  const [show,setshow]=useState(false);
  const addhandler=(()=>{
    setshow(true);
  })
  return (
    <>
    <div>
      <AddDayForm show={show} setshow={setshow} />
    <div  className={classses.addcontainer }>
        <div className={classses.pluscontainer} onClick={addhandler}>
        <div className={classses.right}></div>
        <div className={classses.vertical}></div>
        <div className={classses.left}></div>
        </div>
        <div className={classses.title}>
        <h3 >{name}</h3>
        </div>
        </div>
        </div>
    
        </>
  )
}

export default AddDay