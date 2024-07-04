import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStorage, ref, deleteObject, getMetadata } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Importar Firebase Auth
import './AssetDetails.css';

const AssetDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const asset = location.state?.asset;
  const storage = getStorage();
  const [metadata, setMetadata] = React.useState({ category: 'Unknown', tags: [] });

  React.useEffect(() => {
    if (asset) {
      const fetchMetadata = async () => {
        const assetRef = ref(storage, `uploads/${asset.name}`);
        const metadata = await getMetadata(assetRef);
        setMetadata({
          category: metadata.customMetadata?.category || 'Unknown',
          tags: metadata.customMetadata?.tags ? metadata.customMetadata.tags.split(',') : []
        });
      };

      fetchMetadata();
    }
  }, [asset, storage]);

  if (!asset) {
    return <div>No asset selected</div>;
  }

  const handleDelete = async () => {
    const auth = getAuth(); // Obtener instancia de autenticación
    const user = auth.currentUser;

    if (user && user.email === 'admin@admin.com') {
      const assetRef = ref(storage, `uploads/${asset.name}`);
      try {
        await deleteObject(assetRef);
        alert('Asset deleted successfully');
        navigate('/gallery');
      } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Error deleting asset');
      }
    } else {
      alert('No tienes permiso para borrar este archivo.');
    }
  };

  return (
    <div className="asset-details">
      <h1>Detalles del archivo</h1>
      <p>{asset.name}</p>
      <p>Categoría: {metadata.category}</p>
      <p>Etiquetas: {metadata.tags.join(', ')}</p>
      <button onClick={handleDelete}>Borrar</button>
      <button onClick={() => navigate('/gallery')}>Atras</button>
    </div>
  );
};

export default AssetDetails;
