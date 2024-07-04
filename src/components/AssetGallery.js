import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem } from '@mui/material';
import './AssetGallery.css';

const AssetGallery = ({ onSelectAsset }) => {
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      const storage = getStorage();
      const listRef = ref(storage, 'uploads/');
      const res = await listAll(listRef);

      const assetPromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        return {
          name: itemRef.name,
          url,
          category: metadata.customMetadata?.category || 'Unknown',
          tags: metadata.customMetadata?.tags ? metadata.customMetadata.tags.split(',') : []
        };
      });

      const assetObjects = await Promise.all(assetPromises);

      const uniqueAssets = assetObjects.filter((asset, index, self) =>
        index === self.findIndex((t) => t.name === asset.name)
      );

      setAssets(uniqueAssets);
    };

    fetchAssets();
  }, []);

  const handleSelectAsset = (asset) => {
    onSelectAsset(asset);
    navigate('/details', { state: { asset } });
  };

  const isImage = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  };

  const filteredAssets = assets.filter(asset => !filter || asset.category === filter);

  return (
    <div>
      <h1>Galería de archivos</h1>
      <button onClick={() => navigate('/upload')}>Subir archivo</button>
      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value=""><em>All</em></MenuItem>
        <MenuItem value="Images">Images</MenuItem>
        <MenuItem value="Videos">Videos</MenuItem>
        <MenuItem value="Documents">Documents</MenuItem>
      </Select>
      <div className="gallery">
        {filteredAssets.map((asset) => (
          <div key={asset.name} className="asset-item" onClick={() => handleSelectAsset(asset)}>
            {isImage(asset.name) ? (
              <img src={asset.url} alt={asset.name} />
            ) : (
              <p>{asset.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetGallery;
