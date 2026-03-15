import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { pairingApi } from '../services/api';
import { Smartphone, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pairing: React.FC = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const initiatePairing = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await pairingApi.initiate('Main Desktop');
      setToken(data.token);
    } catch (err: any) {
      setError('Failed to generate pairing token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initiatePairing();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg p-10 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Pair Your Device</h1>
        <p className="text-zinc-400 mb-8">Scan this QR code with your mobile app to link it to this desktop.</p>
        
        <div className="bg-white p-6 rounded-2xl mb-8 inline-block shadow-inner ring-8 ring-zinc-800">
          {loading ? (
            <div className="w-64 h-64 flex items-center justify-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          ) : token ? (
            <QRCodeSVG value={token} size={256} />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-zinc-900 italic">
              Error generating QR
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={initiatePairing}
            className="flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Token
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-800 flex items-center justify-around text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>Open Mobile App</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Select Pair Device</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Success!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pairing;
