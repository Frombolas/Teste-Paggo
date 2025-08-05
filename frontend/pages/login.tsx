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

      // Salva token
      localStorage.setItem('token', token);

      // Redireciona para dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Erro inesperado no login.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />

        <label htmlFor="password">Senha:</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ padding: 10, width: '40%' }}>
          Entrar
        </button>

        <button type="button" style={{ padding: 10, width: '40%', marginLeft: '10%' }} onClick={() => router.push('/register')}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}