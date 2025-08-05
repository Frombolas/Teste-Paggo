import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Erro ao fazer login');
        return;
      }

      const data = await res.json();
      const token = data.accessToken || data.token || null;

      if (!token) {
        setError('Token não recebido');
        return;
      }

      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      setError('Erro inesperado no login.');
      console.error(err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Login</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={{ fontWeight: 500 }}>Email:</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              marginBottom: 15,
              marginTop: 5,
              padding: 10,
              borderRadius: 5,
              border: '1px solid #ccc',
              fontSize: 14,
            }}
          />

          <label htmlFor="password" style={{ fontWeight: 500 }}>Senha:</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              marginBottom: 15,
              marginTop: 5,
              padding: 10,
              borderRadius: 5,
              border: '1px solid #ccc',
              fontSize: 14,
            }}
          />

          {error && <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
          }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: 10,
                backgroundColor: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => router.push('/register')}
              style={{
                flex: 1,
                padding: 10,
                backgroundColor: '#e5e7eb',
                color: '#111827',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
