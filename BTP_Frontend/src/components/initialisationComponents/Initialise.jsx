import { Button } from '@mui/material';
import React from 'react';
import FileUploader from './FileUploader';
import MatchColumns from './MatchColumns';
import { serverLink } from '../../serverLink';
import axios from 'axios';
function Initialise(props) {
    //function to call server to reset database
    const handleReset=async ()=>{
      try {
        const res=axios
        .get(`${serverLink}/api/initialise/reset`, {
          withCredentials: false,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        })
        window.location.reload();
      } catch (error) {
        alert(error)
      }
    }
    return (
      <div className='flex w-full justify-center flex-col items-center gap-6 p-8'>
          <div className='flex  content-center justify-center w-full gap-6'>
              <p className='text-3xl text-gray-400'>Initialise The DataBase</p>
              <Button variant ="outlined" onClick={handleReset} style={{color:"white",background:"red"}}>Reset</Button>
          </div>
          <FileUploader/>
          <div className='h-[50px] border-2'>
          </div>
          <MatchColumns/>
      </div>
    );
}

export default Initialise;