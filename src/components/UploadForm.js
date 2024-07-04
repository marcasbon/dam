import React, { useState, useCallback } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, updateMetadata } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { Slider, Select, MenuItem, TextField } from '@mui/material';
import './UploadForm.css';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      setIsImage(true);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setIsImage(false);
      setImageSrc(null);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    let fileToUpload = file;

    if (isImage) {
      fileToUpload = await getCroppedImg(imageSrc, croppedAreaPixels);
    }

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        setMessage(`Error: ${error.message}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setDownloadURL(downloadURL);
          setMessage(`File uploaded successfully!`);

          // Set metadata for category and tags
          const metadata = {
            customMetadata: {
              category: category,
              tags: tags,
            },
          };
          await updateMetadata(storageRef, metadata);
        });
      }
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadURL);
    alert('Download link copied to clipboard!');
  };

  const getEmbedCode = () => {
    return `<iframe src="${downloadURL}" width="600" height="400"></iframe>`;
  };

  return (
    <div className="upload-form">
      <h1>Subir nuevo archivo</h1>
      <input type="file" onChange={handleFileChange} />
      {isImage && imageSrc && (
        <div className="crop-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <div className="controls">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </div>
        </div>
      )}
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value="Images">Images</MenuItem>
        <MenuItem value="Videos">Videos</MenuItem>
        <MenuItem value="Documents">Documents</MenuItem>
      </Select>
      <TextField
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        helperText="Comma separated tags"
      />
      <button onClick={handleUpload}>Subir</button>
      <div className="progress">Progreso: {progress}%</div>
      {message && <p className="message">{message}</p>}
      {downloadURL && (
        <div className="links">
          <button onClick={handleCopyLink}>Copiar enlace de descarga</button>
          <div>
            <label>Código de inserción:</label>
            <textarea readOnly value={getEmbedCode()} />
          </div>
        </div>
      )}
      <button onClick={() => navigate('/gallery')}>Ir a la galeria</button>
    </div>
  );
};

export default UploadForm;
