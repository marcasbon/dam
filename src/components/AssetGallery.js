// src/components/AssetGallery.js
import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';


const AssetGallery = ({ onSelectAsset }) => {
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      const storage = getStorage();
      const listRef = ref(storage, 'uploads/');
      
      // Limpiar la lista de activos antes de agregar nuevos
      setAssets([]);
      
      const res = await listAll(listRef);
      const assetPromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      });

      const assetObjects = await Promise.all(assetPromises);

      // Filtrar duplicados basados en el nombre del archivo
      const uniqueAssets = assetObjects.filter((asset, index, self) =>
        index === self.findIndex((t) => t.name === asset.name)
      );

      setAssets(uniqueAssets);
    };

    fetchAssets();
  }, []);

  const handleSelectAsset = (asset) => {
    onSelectAsset(asset);
    navigate('/details');
  };

  return (
    <div>
      <h1>Asset Gallery</h1>
      <button onClick={() => navigate('/upload')}>Upload New Asset</button>
      <div className="gallery">
        {assets.map((asset) => (
          <div key={asset.name} className="asset-item" onClick={() => handleSelectAsset(asset)}>
            <img src={asset.url} alt={asset.name} />
            <p>{asset.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetGallery;
