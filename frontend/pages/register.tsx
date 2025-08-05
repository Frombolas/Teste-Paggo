import { useState } from 'react';
import { useRouter } from 'next/router';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 400,
    margin: '50px auto',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center' as React.CSSProperties['textAlign'],
  },
  title: {
    marginBottom: 30,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  secondaryButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eaeaea',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Erro ao registrar');
        return;
      }

      const data = await res.json();
      const token = data.accessToken || data.token;
      if (!token) {
        setError('Token não recebido');
        return;
      }

      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      setError('Erro inesperado no registro.');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Criar Conta</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          id="name"
          type="text"
          placeholder="Nome"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          style={styles.input}
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          id="password"
          type="password"
          placeholder="Senha"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.primaryButton}>Registrar</button>
          <button type="button" style={styles.secondaryButton} onClick={() => router.push('/login')}>
            Já tenho conta
          </button>
        </div>
      </form>
    </div>
  );
}
