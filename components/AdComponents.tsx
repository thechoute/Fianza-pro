
import React, { useState, useEffect } from 'react';

// Componente de Banner (Persistente)
export const AdBanner: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 border-y border-slate-100 py-2 px-4 flex flex-col items-center justify-center min-h-[60px] my-4 overflow-hidden">
      <div className="text-[8px] font-bold text-slate-300 uppercase mb-1 tracking-widest">Publicidad</div>
      <div className="w-full max-w-[320px] h-[50px] bg-slate-200 rounded animate-pulse flex items-center justify-center text-slate-400 text-xs font-medium">
        Espacio para Banner de AdMob
      </div>
    </div>
  );
};

// Componente Intersticial (Pantalla completa)
interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    let timer: number;
    if (isOpen && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute top-6 right-6">
        <button 
          onClick={timeLeft === 0 ? onClose : undefined}
          className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${
            timeLeft === 0 ? 'bg-white text-black' : 'bg-white/20 text-white/50 cursor-not-allowed'
          }`}
        >
          {timeLeft > 0 ? `Cerrar en ${timeLeft}s` : 'CERRAR ANUNCIO ✕'}
        </button>
      </div>
      
      <div className="text-center space-y-4">
        <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Anuncio de Video</div>
        <div className="w-64 h-64 bg-indigo-500/20 rounded-3xl border border-indigo-500/30 flex items-center justify-center">
             <svg className="w-20 h-20 text-indigo-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
             </svg>
        </div>
        <div className="text-white">
            <h4 className="font-bold text-xl">¡Descubre Finanza Premium!</h4>
            <p className="text-sm text-white/60">Monetiza tus ahorros con nuestra red.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-900/50 active:scale-95 transition-transform">
            SABER MÁS
        </button>
      </div>
    </div>
  );
};
