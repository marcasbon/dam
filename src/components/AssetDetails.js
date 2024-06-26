// src/components/AssetDetails.js
import React from 'react';

const AssetDetails = ({ asset }) => {
  return (
    <div>
      <h2>Asset Details</h2>
      <img src={asset} alt="Selected asset" />
      {/* Implementa herramientas de edición aquí */}
    </div>
  );
};

export default AssetDetails;
