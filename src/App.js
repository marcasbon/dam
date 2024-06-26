// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import UploadForm from './components/UploadForm';
import AssetGallery from './components/AssetGallery';
import AssetDetails from './components/AssetDetails';
import { auth } from "./firebaseConfig";  // Importar auth desde firebaseConfig.js
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

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/gallery" /> : <Auth />} />
          <Route path="/gallery" element={user ? <AssetGallery onSelectAsset={setSelectedAsset} /> : <Navigate to="/" />} />
          <Route path="/upload" element={user ? <UploadForm /> : <Navigate to="/" />} />
          <Route path="/details" element={user && selectedAsset ? <AssetDetails asset={selectedAsset} /> : <Navigate to="/gallery" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
