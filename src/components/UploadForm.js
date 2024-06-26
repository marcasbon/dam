// src/components/UploadForm.js
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const storage = getStorage();
    const storageRef = ref(storage, `assets/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('File available at', downloadURL);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadForm;
