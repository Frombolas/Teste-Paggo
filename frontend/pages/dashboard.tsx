'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Upload {
  id: string;
  filename: string;
  iaResponse: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:3000/upload', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUploads(data))
      .catch((err) => console.error('Erro ao buscar uploads:', err));
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
      const newUpload = data.document;

      setUploads((prev) => [newUpload, ...prev]);
      setSelectedUpload(newUpload);
      setResponse(newUpload.iaResponse || 'Nenhuma resposta retornada.');
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{
        width: '300px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
      }}>
        {/* Avatar e menu */}
        <div style={{ marginBottom: '20px' }}>
          <div
            onClick={() => setShowMenu(!showMenu)}
            style={{
              cursor: 'pointer',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '24px',
              color: '#fff',
            }}
          >
            👤
          </div>

          {showMenu && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '10px',
              marginTop: '10px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}>
              <button onClick={handleEditProfile} style={{ display: 'block', marginBottom: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
                Editar Perfil
              </button>
              <button onClick={handleLogout} style={{ display: 'block', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                Sair
              </button>
            </div>
          )}
        </div>

        <h3 style={{ marginBottom: '10px', color: '#111827' }}>Histórico de Uploads</h3>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {uploads.length === 0 && <p style={{ color: '#6b7280' }}>Nenhum upload encontrado.</p>}
          {uploads.map((upload) => (
            <div
              key={upload.id}
              onClick={() => {
                setSelectedUpload(upload);
                setResponse(upload.iaResponse);
              }}
              style={{
                cursor: 'pointer',
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: selectedUpload?.id === upload.id ? '#e0f2fe' : '#f9fafb',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#111827',
                transition: 'background-color 0.2s',
              }}
            >
              {upload.filename}
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>
            Dashboard
          </h1>

          {response ? (
            <div style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Resposta da IA:</h2>
              <p style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{response}</p>
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>Selecione um upload para ver a resposta da IA.</p>
          )}
        </div>

        {/* Área de upload */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb',
        }}>
          <h3 style={{ marginBottom: '10px', fontWeight: '500', color: '#111827' }}>
            Upload de Arquivo
          </h3>
          <input type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
