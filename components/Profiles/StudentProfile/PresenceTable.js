import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'type',
    headerName: 'Lecture Type',
    width: 200,
  },
  {
    field: 'date',
    headerName: 'Lecture Date',
    width: 130,
    type:"date"
  },
  {
    field: 'startingTime',
    headerName: 'From',
    width: 130,
  },
  {
    field: 'endingTime',
    headerName: 'To',
    width: 130,
  },
  {
    field: 'fullhours',
    headerName: 'Number of Hours',
    width: 100,
  },
  {
    field: 'attendedHours',
    headerName: 'Attended Hours',
    width: 100,
  },
  {
    field: 'attended',
    headerName: 'Attended',
    type:"boolean",
    width: 130,
  },
];

const rows = [
{id:"01",name :"English",type:"in class",startingTime:"08:00",endingTime:"10:00",noHours:"2",presence:true}
];

export default function PresenceTable(probs) {
  const {attendance,lectures}=probs;
    let rows=attendance.map((at)=>{
      let attLect=lectures.filter((l)=>l.id===at.lecture)[0];
      return {...attLect,...at,date:new Date(at.y,at.M,at.D)};
    })
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid 
      sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}