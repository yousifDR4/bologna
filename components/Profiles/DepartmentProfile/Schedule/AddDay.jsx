import React, { useState } from 'react'
import classses from"./Schedule.module.css"
import AddDayForm from './AddDayForm';
import { useDispatch, useSelector } from 'react-redux';
import Scheduleslice from '../../../../store/Schedule-slice';
const AddDay = ({name}) => {
 console.log(name);
 const dispathchredux=useDispatch();
 const clickhandle=()=>{
  dispathchredux(Scheduleslice.actions.setOneDay({name:name}))
 }
  return (
    <>
    <div>
      <AddDayForm name={name} />
    <div  className={classses.addcontainer }>
        <div className={classses.pluscontainer} onClick={clickhandle}>
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