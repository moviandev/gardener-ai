import { useEffect, useState } from 'react';
import { api } from './services/api';

function App() {
  const [status, setStatus] = useState<string>('Carregando...');

  useEffect(() => {
    // Teste simples de conexão (assumindo que você tem uma rota raiz "/" ou "/health")
    api.get('/') 
      .then((response) => {
        setStatus(`Backend conectado! Resposta: ${JSON.stringify(response.data)}`);
      })
      .catch((error) => {
        setStatus('Erro ao conectar com o backend. O servidor está rodando?');
        console.error(error);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Gardener Agent 🌱</h1>
      <div style={{ 
        padding: '1rem', 
        background: '#f0f0f0', 
        borderRadius: '8px',
        marginTop: '1rem' 
      }}>
        <strong>Status do Sistema:</strong> {status}
      </div>
    </div>
  );
}

export default App;