'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsDebug() {
  const [gaStatus, setGaStatus] = useState<{
    loaded: boolean;
    gaId: string | null;
    gtag: boolean;
    dataLayer: boolean;
    eventsSent: number;
  }>({
    loaded: false,
    gaId: null,
    gtag: false,
    dataLayer: false,
    eventsSent: 0
  });

  useEffect(() => {
    const checkGA = () => {
      const gaId = process.env.NEXT_PUBLIC_GA_ID;
      const gtag = typeof window !== 'undefined' && !!(window as any).gtag;
      const dataLayer = typeof window !== 'undefined' && !!(window as any).dataLayer;
      
      setGaStatus(prev => ({
        ...prev,
        loaded: true,
        gaId: gaId || null,
        gtag,
        dataLayer
      }));
    };

    // Check immediately and after delays
    checkGA();
    setTimeout(checkGA, 1000);
    setTimeout(checkGA, 3000);
  }, []);

  const sendTestEvent = () => {
    if ((window as any).gtag) {
      const eventName = `test_event_${Date.now()}`;
      (window as any).gtag('event', eventName, {
        event_category: 'debug',
        event_label: 'manual_test',
        custom_parameter: 'test_value'
      });
      
      setGaStatus(prev => ({ ...prev, eventsSent: prev.eventsSent + 1 }));
      
      console.log('✅ Evento enviado:', eventName);
      alert(`Evento enviado: ${eventName}\n\nRevisa GA4 → Realtime → Events en los próximos 30 segundos.`);
    } else {
      alert('❌ gtag no está disponible');
    }
  };

  const sendPageView = () => {
    if ((window as any).gtag) {
      (window as any).gtag('config', gaStatus.gaId, {
        page_title: 'Debug Test Page',
        page_location: window.location.href,
        custom_map: { 'custom_dimension_1': 'debug_test' }
      });
      
      console.log('✅ PageView enviado');
      alert('PageView enviado!\n\nRevisa GA4 → Realtime → Overview');
    }
  };

  // Force show in development
  const shouldShow = process.env.NEXT_PUBLIC_DEBUG_MODE || process.env.NODE_ENV === 'development';
  
  if (!shouldShow) {
    console.log('Debug mode disabled. NEXT_PUBLIC_DEBUG_MODE:', process.env.NEXT_PUBLIC_DEBUG_MODE);
    return null;
  }

  console.log('Debug panel should be visible. GA Status:', gaStatus);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50 font-mono">
      <h4 className="font-bold mb-2 text-yellow-400">🔍 GA4 Debug</h4>
      <div className="space-y-1 mb-3">
        <div>ID: {gaStatus.gaId || '❌ No config'}</div>
        <div>gtag: {gaStatus.gtag ? '✅' : '❌'}</div>
        <div>dataLayer: {gaStatus.dataLayer ? '✅' : '❌'}</div>
        <div>Events: {gaStatus.eventsSent}</div>
        <div className="text-xs text-gray-400">URL: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</div>
      </div>
      
      <div className="space-y-1">
        {gaStatus.gtag && (
          <>
            <button 
              onClick={sendTestEvent}
              className="w-full bg-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-700"
            >
              🎯 Test Event
            </button>
            <button 
              onClick={sendPageView}
              className="w-full bg-green-600 px-2 py-1 rounded text-xs hover:bg-green-700"
            >
              📄 Test PageView
            </button>
          </>
        )}
        
        <div className="text-xs text-gray-400 mt-2">
          {gaStatus.gtag ? '✅ GA4 Ready' : '⏳ Loading...'}
        </div>
      </div>
    </div>
  );
}