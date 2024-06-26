// src/components/AssetDetails.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import './AssetDetails.css';

const AssetDetails = ({ asset }) => {
  const navigate = useNavigate();
  const storage = getStorage();

  const handleDelete = async () => {
    const assetRef = ref(storage, `uploads/${asset.name}`);
    try {
      await deleteObject(assetRef);
      alert('Asset deleted successfully');
      navigate('/gallery');
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Error deleting asset');
    }
  };

  return (
    <div className="asset-details">
      <h1>Asset Details</h1>
      {/* <img src={asset.url} alt={asset.name} /> */}
      <p>{asset.name}</p>
      <button onClick={handleDelete}>Delete Asset</button>
      <button onClick={() => navigate('/gallery')}>Back to Gallery</button>
    </div>
  );
};

export default AssetDetails;
