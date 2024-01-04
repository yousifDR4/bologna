import React, { memo, useMemo, useState } from 'react'
import classses from"./Schedule.module.css"
import AddDayForm from './AddDayForm';
import { useDispatch, useSelector } from 'react-redux';
import Scheduleslice from '../../../../store/Schedule-slice';
const MemorizeAddDay=memo(AddDayForm);
const AddDay = ({name}) => {
 const [show,setshow]=useState(false)
 const clickhandle=()=>{
  setshow(true);
 }
 const memorizeAddDay=useMemo(()=><MemorizeAddDay name={name} show={show} setshow={setshow}/>,[show])

  return (
    <>
    <div>
    {memorizeAddDay}
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