'use client';

export default function EnvDebug() {
  return (
    <div className="p-4 bg-gray-100 m-4 rounded">
      <h3 className="font-bold mb-2">🔍 Environment Debug</h3>
      <div className="space-y-1 text-sm font-mono">
        <div>GA_ID: {process.env.NEXT_PUBLIC_GA_ID || '❌ No definido'}</div>
        <div>DEBUG_MODE: {process.env.NEXT_PUBLIC_DEBUG_MODE || '❌ No definido'}</div>
        <div>NODE_ENV: {process.env.NODE_ENV || '❌ No definido'}</div>
        <div>gtag: {typeof window !== 'undefined' && (window as any).gtag ? '✅' : '❌'}</div>
        <div>dataLayer: {typeof window !== 'undefined' && (window as any).dataLayer ? '✅' : '❌'}</div>
      </div>
      
      {typeof window !== 'undefined' && (window as any).gtag && (
        <button 
          onClick={() => {
            (window as any).gtag('event', 'debug_test', { source: 'env_debug' });
            alert('Evento enviado desde EnvDebug!');
          }}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Test Event
        </button>
      )}
    </div>
  );
}