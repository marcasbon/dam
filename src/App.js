// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';
import UploadForm from './components/UploadForm';
import AssetGallery from './components/AssetGallery';
import AssetDetails from './components/AssetDetails';
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="App">
      <h1>Digital Asset Management (DAM) System</h1>
      <UploadForm />
      <AssetGallery onSelectAsset={setSelectedAsset} />
      {selectedAsset && <AssetDetails asset={selectedAsset} />}
    </div>
  );
};

export default App;