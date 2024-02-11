import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { applicantsSchemaColumnNames } from "./columnNames";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SelectBox from "./SelectBox";
import axios from "axios";
import { serverLink } from "../../serverLink";
import Loader from "../Loader";
import DownloadIcon from "@mui/icons-material/Download";
import documentImage from "../../images/docmentimage.jpg";
import fileDownload from "js-file-download";

const MatchColumns = () => {
  const [columnNamesMatched, setColumnNamesMatched] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${serverLink}/api/initialise/getMasterFileModifiedStatus`, {
        withCredentials: false,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
      .then((res) => {
        setFileExists(res.data.result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const changeColumnNamesMatchedState = (
    uploadedcolumnName,
    selectedColumnName
  ) => {
    var prevState = columnNamesMatched;
    // console.log(uploadedcolumnName,selectedColumnName,columnNamesMatched)
    prevState[uploadedcolumnName] = selectedColumnName;
    setColumnNamesMatched(prevState);
    // console.log(uploadedcolumnName,selectedColumnName,columnNamesMatched)
  };
  const getMatchedColumnNames = async () => {
    setIsLoading(true);
    axios
      .get(`${serverLink}/api/initialise/getMatchedColumnNames`, {
        withCredentials: false,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
      .then((res) => {
        //   console.log(res.data.result);
        setColumnNamesMatched(res.data.result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  const sendSelectedColumnNames = () => {
    for (const actualColumnName of applicantsSchemaColumnNames) {
      let count = 0;
      for (const uploadedColumnName of Object.keys(columnNamesMatched)) {
        if (columnNamesMatched[uploadedColumnName] === actualColumnName) {
          count++;
        }
      }
      // console.log(actualColumnName,count)
      if (count >= 2) {
        alert(`${actualColumnName} is Selected Twice`);
        return;
      }
      if (count === 0) {
        alert(`${actualColumnName} is Not Selected `);
        return;
      }
    }
    setIsLoading(true);
    axios
      .post(
        `${serverLink}/api/initialise/saveToDataBase`,
        { result: columnNamesMatched },
        {
          withCredentials: false,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      )
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err.response.data.result);
      });
  };
  const handleDownload = () => {
    axios
      .get(
        `${serverLink}/api/initialise/modifiedFile`,
        {
          responseType: "blob",
        },
        {
          withCredentials: false,
          headers: {
            responseType: "blob",
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      )
      .then((res) => {
        console.log(res);
        fileDownload(res.data, "modifiedFile.xlsx");
      })
      .catch((err) => {
        alert(err.response.data.result);
      });
  };
  return (
    <div className="flex flex-col max-w-[800px] min-w-[80%] shadow-lg rounded-xl ">
      <div className="flex justify-center items-center w-full h-11 bg-zinc-100 rounded-t-xl gap-10">
        <p className="text-xl text-black">Match The Columns</p>
      </div>
      {!fileExists && columnNamesMatched !== null && !isLoading && (
        <div className="flex justify-center rounded-b-xl items-center gap-2 p-2 box-border h-[500px] flex-wrap overflow-y-scroll">
          {!fileExists &&
            columnNamesMatched != null &&
            Object.keys(columnNamesMatched).map((columnName) => {
              return (
                <div className="w-[250px] flex flex-col justify-center rounded-md p-2 shadow-md">
                  <p className="text-md text-gray-400">{columnName}</p>
                  <SelectBox
                    uploadedColumnName={columnName}
                    predictedColumnName={columnNamesMatched[columnName]}
                    changeState={changeColumnNamesMatchedState}
                  />
                </div>
              );
            })}
        </div>
      )}
      {fileExists && !isLoading && (
        <div className="flex items-center flex-col h-[180px] gap-1">
          <img
            src={documentImage}
            alt="Not Found"
            style={{ width: "200px", height: "120px" }}
          />
          <p className="text-xl text-grey ">
            Hmm looks like you have already Matched the Columns
          </p>
        </div>
      )}
      {!fileExists && columnNamesMatched === null && !isLoading && (
        <div className="flex justify-center rounded-b-xl items-center gap-2 p-2 box-border h-[100px] flex-wrap">
          <p className="text-xl">Press The button to get Data</p>
        </div>
      )}
      {!fileExists && isLoading && (
        <div className="flex w-full justify-center items-center">
          <Loader />
        </div>
      )}

      <div className="w-full p-2 flex justify-center">
        {!fileExists && columnNamesMatched != null && (
          <Button
            variant="contained"
            startIcon={<FileUploadIcon />}
            style={{ margin: "auto", marginBottom: "5px" }}
            onClick={sendSelectedColumnNames}
          >
            Save To DataBase
          </Button>
        )}
        {!fileExists && columnNamesMatched == null && (
          <Button
            variant="contained"
            onClick={getMatchedColumnNames}
            style={{ margin: "auto", marginBottom: "5px" }}
          >
            Get Column Names
          </Button>
        )}
        {fileExists && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            style={{ margin: "auto", marginBottom: "5px" }}
            onClick={handleDownload}
          >
            Download The Edited File
          </Button>
        )}
      </div>
    </div>
  );
};

export default MatchColumns;
