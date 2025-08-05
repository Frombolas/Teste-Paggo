'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo.');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao enviar o arquivo.');

      const data = await res.json();
      setResponse(data.document.iaResponse|| 'Nenhuma resposta retornada.');
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '80px',
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        position: 'relative',
      }}>
        <div
          onClick={() => setShowMenu(!showMenu)}
          style={{
            cursor: 'pointer',
            backgroundColor: '#555',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
          }}
        >
          👤
        </div>

        {/* Menu flutuante */}
        {showMenu && (
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '90px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}>
            <button onClick={handleEditProfile} style={{ display: 'block', marginBottom: 8 }}>Editar Perfil</button>
            <button onClick={handleLogout} style={{ display: 'block', color: 'red' }}>Sair</button>
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h1>Bem-vindo ao Dashboard</h1>
          <p>Conteúdo protegido aqui...</p>
        </div>

        {/* Área de Upload */}
        <div style={{
          borderTop: '1px solid #ccc',
          paddingTop: '20px',
          marginTop: 'auto',
        }}>
          <h3>Upload de Arquivo para IA</h3>

          <input type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
          <button onClick={handleUpload} disabled={loading} style={{ marginLeft: '10px' }}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {response && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <strong>Resposta da IA:</strong>
              <p>{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
