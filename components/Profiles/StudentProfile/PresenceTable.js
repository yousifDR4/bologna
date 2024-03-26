import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'name',
    headerName: 'Module Name',
    width: 150,
  },
  {
    field: 'type',
    headerName: 'Lecture Type',
    width: 200,
  },
  {
    field: 'date',
    headerName: 'Lecture Date',
    width: 130,
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
    field: 'noHours',
    headerName: 'Number of Hours',
    width: 100,
  },
  {
    field: 'presence',
    headerName: 'Presence State',
    type:"boolean",
    width: 130,
  },
];

const rows = [
{id:"01",name :"English",type:"in class",date:"2024:01:12",startingTime:"08:00",endingTime:"10:00",noHours:"2",presence:true}
];

export default function PresenceTable(probs) {
    const [Lectures,setLectures]=React.useState(rows);
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid 
      sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
        rows={Lectures}
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