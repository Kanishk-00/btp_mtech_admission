import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Button, TextField } from '@mui/material';
import {serverLink} from "../../serverLink";
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
function SeatMatrixRow(props) {
    const [seats,setSeats]=useState(props.seatsAllocated);
    const handleChangeSeats=(e)=>{
        setSeats(e.target.value);
    }
    const handleSave=async()=>{
        if(seats<props.seatsBooked){
            alert("seats booked are more tahn the seats allocated");
            return;
        }
        axios.post(`${serverLink}/api/seatMatrix/updateSeats`,{category:props.category,seats:seats},{
            withCredentials: false,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }).then((res)=>{
                console.log(res);
                window.location.reload();
          }).catch((err)=>{
            console.log(err);
          })
    }
    return (
        <TableRow
            key={"key"}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row" style={{fontSize:"15px",fontWeight:"bold",color:"#FFCB00"}}>
            {props.category}
            </TableCell>
            <TableCell align="center">{props.seatsAllocated}</TableCell>
            <TableCell align="center">{props.seatsBooked}</TableCell>
            <TableCell align="center">
                <TextField type='Number' onChange={handleChangeSeats} value={seats}></TextField>
            </TableCell>
            <TableCell align="center">
                <Button variant="contained" onClick={handleSave} style={{background:"#1B3058"}} startIcon={<SaveIcon/>}>
                    Save
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default SeatMatrixRow;