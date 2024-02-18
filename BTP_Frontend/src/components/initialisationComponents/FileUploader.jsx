import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { serverLink } from "../../serverLink";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import documentImage from "../../images/docmentimage.jpg";
import fileDownload from "js-file-download";
import Cookies from "js-cookie";
import Alert from "@mui/material/Alert";

function FileUploader(props) {
  const [file, setFile] = useState(null);
  const [fileExists, setFileExists] = useState(false);
  const [loading, setIsLoading] = useState(false);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .get(`http://localhost:4444/api/initialise/getMasterFileUploadStatus`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          setFileExists(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("2");
          console.log(err);
          console.log("1");
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, []);

  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (file.name.split(".").pop() !== "xlsx") {
      alert("Invalid file type, please upload an xlsx file");
      return;
    }
    setFile(file);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    console.log("inside here");

    try {
      const response = await axios.post(
        "http://localhost:4444/api/initialise/getFile",
        formData,
        { withCredentials: true }
      );
      alert("File Upload success");
      // <Alert severity="success">File upload successful</Alert>;
      // <Alert severity="success" color="warning">
      //   This is a success Alert with warning colors.
      // </Alert>;
      window.location.reload(); // Reload the page after successful upload
    } catch (error) {
      console.error("Upload error:", error);
      console.log("the error, ", error.response);
      console.log("the error, ", error.response.status);
      if (error.response && error.response.status === 401) {
        // toast.error("Please log in to access the website");
        <Alert severity="error">Please log in to access the website.</Alert>;
      } else {
        // toast.error("File upload failed. Please check console for details.");
        <Alert severity="error">
          File upload failed. Please check console for details.
        </Alert>;
      }
    }
  };

  const handleDownload = async () => {
    try {
      const token = getCookie("jwtToken"); // Get the JWT token from wherever it's stored (cookies, local storage, etc.)
      const response = await axios.get(
        `http://localhost:4444/api/initialise/uploadedFile`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response);
      fileDownload(response.data, "uploadedFile.xlsx");
    } catch (error) {
      console.log(error);
    }
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
