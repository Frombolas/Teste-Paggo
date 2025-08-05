'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleVoltar = () => {
    router.push('/dashboard');
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '100px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <h1>Editar Perfil</h1>
      <p style={{ marginBottom: '20px' }}>Funcionalidade ainda não implementada.</p>
      <button
        onClick={handleVoltar}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Voltar ao Dashboard
      </button>
    </div>
  );
}
