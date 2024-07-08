import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStorage, ref, deleteObject, getMetadata } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 
import './AssetDetails.css';

const AssetDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const asset = location.state?.asset; // Obtener el activo seleccionado de la navegación
  const storage = getStorage();
  const [metadata, setMetadata] = React.useState({ category: 'Unknown', tags: [] }); // Estado para almacenar los metadatos

  // useEffect para obtener los metadatos del activo al montar el componente
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

      fetchMetadata(); // Llamar a la función para obtener los metadatos
    }
  }, [asset, storage]);

  // Si no hay un activo seleccionado, mostrar un mensaje
  if (!asset) {
    return <div>No asset selected</div>;
  }

  // Manejar la eliminación del activo
  const handleDelete = async () => {
    const auth = getAuth(); // Obtener instancia de autenticación
    const user = auth.currentUser;

    // Verificar si el usuario tiene permiso para borrar el archivo
    if (user && user.email === 'admin@admin.com') {
      const assetRef = ref(storage, `uploads/${asset.name}`);
      try {
        await deleteObject(assetRef);
        alert('Asset deleted successfully');
        navigate('/gallery'); // Navegar a la galería después de eliminar
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
