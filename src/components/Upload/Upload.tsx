import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { TbFidgetSpinner } from "react-icons/tb";
import axios from "axios";
import "./Upload.css";

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | undefined>(
    undefined
  );
  const [location] = React.useState<Location>(window.location);
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [isUploaded, setIsUploaded] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsUploaded(false);
      setSelectedFile(event.target.files[0]);
    }
  };

  const spinnerAnimation = React.useMemo(
    () => ({
      animation: `spin 1s linear infinite`,
    }),
    []
  );
  const upload = async () => {
    if (selectedFile) {
      setIsUploaded(false);
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      await axios
        .post(
          `${location.protocol}//${location.hostname}:5000/upload`,
          formData,
          {
            onUploadProgress(progressEvent) {
              if (progressEvent.progress)
                setProgress(progressEvent.progress * 100);
            },
          }
        )
        .then((res) => {
          setProgress(100);
          setIsUploading(false);
          setSelectedFile(undefined);
          setIsUploaded(true);
          console.log(res.data);
        })
        .catch((error) => {
          setIsUploading(false);
          setSelectedFile(undefined);
          console.log(error);
          alert("Something went wrong... Please check console...");
        });
    }
  };

  return (
    <div className="container">
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onClick={(e) => (e.currentTarget.value = "")}
        onChange={(event) => handleInputChange(event)}
      />
      <div className="upload-container" onClick={handleClick}>
        <div className="upload-area">
          <IoIosAddCircleOutline />
          <span>Select a file</span>
        </div>
      </div>
      {isUploading ? (
        <div
          className="progress-container"
          style={{
            background: `linear-gradient(90deg, rgb(233, 103, 103, 1) ${progress}%, rgb(233, 103, 103, 0.4) ${progress}%)`,
          }}
        >
          <span>{progress.toFixed(2)}%</span>
        </div>
      ) : (
        <div className="preview-container">
          {selectedFile ? (
            <div className="preview">
              <p className="preview-name">{selectedFile.name}</p>
              <RxCross2
                className="preview-cross-icon"
                onClick={() => setSelectedFile(undefined)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
      {isUploaded ? (
        <>
          <div
            className="progress-container"
            style={{
              background: `linear-gradient(90deg, rgb(233, 103, 103, 1) ${progress}%, rgb(233, 103, 103, 0.4) ${progress}%)`,
            }}
          >
            <span>{progress.toFixed(2)}%</span>
          </div>
        </>
      ) : (
        <></>
      )}
      <button className="upload-button" onClick={upload} disabled={isUploading}>
        {!isUploading ? (
          "Upload!"
        ) : (
          <TbFidgetSpinner style={spinnerAnimation} />
        )}
      </button>
    </div>
  );
};

export default Upload;
