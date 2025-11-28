// Wallet Debug Component
import { useState, useEffect } from 'react';

function WalletDebug() {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const checkWallet = () => {
      const info = {
        suiWallet: !!window.suiWallet,
        oneWallet: !!window.oneWallet,
        sui: !!window.sui,
        ethereum: !!window.ethereum,
        walletKeys: Object.keys(window).filter(k => 
          k.toLowerCase().includes('wallet') || 
          k.toLowerCase().includes('sui')
        ),
        userAgent: navigator.userAgent,
        extensions: []
      };

      // Check for common wallet properties
      ['onechainWallet', 'suiWallet', 'oneWallet', 'sui'].forEach(key => {
        if (window[key]) {
          info.extensions.push({
            name: key,
            methods: Object.keys(window[key]).filter(k => typeof window[key][k] === 'function')
          });
        }
      });

      setDebugInfo(info);
    };

    checkWallet();
    
    // Recheck after a delay (wallets might inject later)
    const timer = setTimeout(checkWallet, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '10px',
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto',
      fontFamily: 'monospace',
      zIndex: 9999
    }}>
      <div><strong>Wallet Debug Info:</strong></div>
      <pre style={{ margin: '5px 0', fontSize: '9px' }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}

export default WalletDebug;
