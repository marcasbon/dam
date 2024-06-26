// src/components/AssetDetails.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, deleteObject } from 'firebase/storage';

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
    <div>
      <h1>Asset Details</h1>
      <img src={asset.url} alt={asset.name} style={{ maxWidth: '100%', height: 'auto' }} />
      <p>{asset.name}</p>
      <button onClick={handleDelete}>Delete Asset</button>
      <button onClick={() => navigate('/gallery')}>Back to Gallery</button>
    </div>
  );
};

export default AssetDetails;
