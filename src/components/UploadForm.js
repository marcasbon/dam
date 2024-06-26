// src/components/UploadForm.js
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './UploadForm.css';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpload = () => {
    if (!file) return;
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      }, 
      (error) => {
        setMessage(`Error: ${error.message}`);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setMessage(`File uploaded successfully! URL: ${downloadURL}`);
        });
      }
    );
  };

  return (
    <div className="upload-form">
      <h1>Upload New Asset</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <div className="progress">Progress: {progress}%</div>
      {message && <p className="message">{message}</p>}
      <button onClick={() => navigate('/gallery')}>Go to Asset Gallery</button>
    </div>
  );
};

export default UploadForm;
