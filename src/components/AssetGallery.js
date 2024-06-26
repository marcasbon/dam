// src/components/AssetGallery.js
import React, { useEffect, useState } from 'react';
import { getStorage, listAll, ref, getDownloadURL } from "firebase/storage";

const AssetGallery = ({ onSelectAsset }) => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const storage = getStorage();
      const listRef = ref(storage, 'assets/');
      const res = await listAll(listRef);
      const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
      setAssets(urls);
    };

    fetchAssets();
  }, []);

  return (
    <div>
      {assets.map((url, index) => (
        <img key={index} src={url} alt={`asset-${index}`} onClick={() => onSelectAsset(url)} />
      ))}
    </div>
  );
};

export default AssetGallery;
