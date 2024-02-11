import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { serverLink } from "../../serverLink";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import documentImage from "../../images/docmentimage.jpg";
import fileDownload from "js-file-download";
function FileUploader(props) {
  const [file, setFile] = useState(null);
  const [fileExists, setFileExists] = useState(false);
  const [loading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${serverLink}/api/initialise/getMasterFileUploadStatus`, {
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

  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (file.name.split(".").pop() !== "xlsx") {
      alert("Invalid file type, please upload an xlsx file");
      return;
    }
    setFile(file);
  };
  const uploadFile = () => {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    axios
      .post(`${serverLink}/api/initialise/getFile`, formData)
      .then((res) => {
        alert("File Upload success");
        window.location.reload();
      })
      .catch((err) => alert(err));
  };
  const handleDownload = () => {
    axios
      .get(
        `${serverLink}/api/initialise/uploadedFile`,
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
        fileDownload(res.data, "uploadedFile.xlsx");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex flex-col max-w-[800px] min-w-[80%] shadow-lg rounded-xl">
      <div className="flex justify-center items-center w-full h-11 bg-zinc-100 rounded-t-xl ">
        <p className="text-xl text-black">Upload The Master Excel File</p>
      </div>
      <div className="flex justify-center h-[fit-content]  rounded-b-xl items-center gap-2 p-1 box-border">
        {!fileExists && (
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            className="w-[fit-content] p-[2px]"
            onChange={handleFileSubmit}
          >
            <input type="file" accept=".xlsx" hidden />
            Choose File
          </Button>
        )}
        {!fileExists && file === null && (
          <p className="text-xl text-grey">No Files Uploaded</p>
        )}
        {!fileExists && file !== null && (
          <div className="flex justify-center items-center gap-7">
            <div className="flex  justify-center items-center shadow p-2 w-[300px] min-w-[200px] box-border h-15 ">
              <p className="text-lg text-black truncate w-[fit-content]">
                <b className="text-zinc-500">File Name : </b> {file.name}
              </p>
            </div>
            <div className="flex  justify-center items-center shadow p-2 w-[300px] box-border min-w-[200px] h-15">
              <div className="text-lg text-black truncate w-[fit-content]">
                <b className="text-zinc-500">Type : </b>
                {file.type}
              </div>
            </div>
          </div>
        )}
        {fileExists && (
          <div className="flex items-center flex-col h-[180px] gap-1">
            <img
              src={documentImage}
              alt="Not Found"
              style={{ width: "200px", height: "120px" }}
            />
            <p className="text-xl text-grey ">
              Hmm looks like you have already uploaded the file
            </p>
          </div>
        )}
      </div>
      {!fileExists && file != null && (
        <Button
          variant="contained"
          startIcon={<FileUploadIcon />}
          style={{ margin: "auto", marginBottom: "5px" }}
          onClick={uploadFile}
        >
          Upload
        </Button>
      )}
      {fileExists && (
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          style={{ margin: "auto", marginBottom: "5px" }}
          onClick={handleDownload}
        >
          Download the Uploaded File
        </Button>
      )}
    </div>
  );
}

export default FileUploader;
