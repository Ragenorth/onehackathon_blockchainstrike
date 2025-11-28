import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

import { 
  connectONEWallet, 
  purchaseCosmetic,
  formatAddress,
  getWalletBalance
} from './walletIntegration';


function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover, shop, paused
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerPos, setPlayerPos] = useState(50);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [highScore, setHighScore] = useState(0);

  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownedCosmetics, setOwnedCosmetics] = useState([]);
  const [activePlayerCosmetic, setActivePlayerCosmetic] = useState(0);
  const [activeEnemyCosmetic, setActiveEnemyCosmetic] = useState(0);
  const [randomSkins, setRandomSkins] = useState([]);
  const gameLoopRef = useRef(null);
  const keysPressed = useRef({});

  // Generate random skin
  const generateRandomSkin = () => {
    const types = ['player', 'enemy'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Random color generation
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
    const lightness = 40 + Math.floor(Math.random() * 30); // 40-70%
    
    // Random pattern
    const patterns = [
      `hsl(${hue}, ${saturation}%, ${lightness}%)`, // Solid
      `linear-gradient(45deg, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%))`, // Two-tone
      `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${(hue + 120) % 360}, ${saturation}%, ${lightness}%))`, // Diagonal
      `radial-gradient(circle, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness - 20}%))`, // Radial
      `linear-gradient(90deg, hsl(${hue}, ${saturation}%, ${lightness}%) 0%, hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%) 50%, hsl(${(hue + 120) % 360}, ${saturation}%, ${lightness}%) 100%)`, // Rainbow
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Random rarity
    const rarityRoll = Math.random();
    let rarity, value;
    if (rarityRoll < 0.5) {
      rarity = 'Common';
      value = 0.05 + Math.random() * 0.05; // 0.05-0.1 SUI
    } else if (rarityRoll < 0.8) {
      rarity = 'Rare';
      value = 0.1 + Math.random() * 0.1; // 0.1-0.2 SUI
    } else if (rarityRoll < 0.95) {
      rarity = 'Epic';
      value = 0.2 + Math.random() * 0.2; // 0.2-0.4 SUI
    } else {
      rarity = 'Legendary';
      value = 0.4 + Math.random() * 0.4; // 0.4-0.8 SUI
    }
    
    return {
      id: Date.now() + Math.random(),
      type: type,
      name: `${rarity} ${type === 'player' ? 'Ship' : 'Invader'} #${Math.floor(Math.random() * 9999)}`,
      rarity: rarity,
      color: pattern,
      value: parseFloat(value.toFixed(3)),
      timestamp: Date.now()
    };
  };

  // Shop cosmetics data
  const shopCosmetics = [
    {
      id: 1,
      name: "Golden Ship",
      description: "Shiny golden player ship",
      price: 0.1,
      type: "player",
      color: "#FFD700"
    },
    {
      id: 2,
      name: "Neon Blue Ship", 
      description: "Electric blue player ship",
      price: 0.15,
      type: "player",
      color: "#00BFFF"
    },
    {
      id: 3,
      name: "Rainbow Ship",
      description: "Multicolor rainbow ship", 
      price: 0.3,
      type: "player",
      color: "linear-gradient(45deg, #ff0000, #00ff00, #0000ff)"
    },
    {
      id: 4,
      name: "Red Invaders",
      description: "Fierce red enemy ships",
      price: 0.08,
      type: "enemy", 
      color: "#FF4500"
    },
    {
      id: 5,
      name: "Purple Aliens",
      description: "Mysterious purple enemies",
      price: 0.12,
      type: "enemy",
      color: "#8A2BE2"
    }
  ];

  const handleConnectWallet = async () => {
    const result = await connectONEWallet();
    if (result.success) {
      setWalletAddress(result.address);
      
      // Get wallet balance
      try {
        const balance = await getWalletBalance(result.address);
        setWalletBalance(balance);
      } catch (error) {
        console.error('Error getting balance:', error);
        setWalletBalance({ formatted: 'Error loading balance' });
      }
      
      alert(`Wallet connected: ${formatAddress(result.address)}`);
    } else {
      alert(`Failed to connect: ${result.error}`);
    }
  };

  const handleOpenShop = async () => {
    // Auto-connect wallet if not connected
    if (!walletAddress) {
      const result = await connectONEWallet();
      if (result.success) {
        setWalletAddress(result.address);
        try {
          const balance = await getWalletBalance(result.address);
          setWalletBalance(balance);
        } catch (error) {
          console.error('Error getting balance:', error);
          setWalletBalance({ formatted: 'Error loading balance' });
        }
      } else {
        alert(`Failed to connect wallet: ${result.error}`);
        return;
      }
    }
    setGameState('shop');
  };

  const handleSellSkin = (skin) => {
    const confirmSell = window.confirm(
      `Sell ${skin.name}?\n\n` +
      `Rarity: ${skin.rarity}\n` +
      `Value: ${skin.value} SUI\n\n`
    );
    
    if (confirmSell) {
      // Remove skin from inventory
      setRandomSkins(prev => prev.filter(s => s.id !== skin.id));
      
      // Simulate balance increase (in demo mode)
      if (walletBalance) {
        const newBalance = walletBalance.sui + skin.value;
        setWalletBalance({
          sui: newBalance,
          mist: newBalance * 1000000000,
          formatted: `${newBalance.toFixed(4)} SUI (Demo)`
        });
      }
      
      alert(`Sold ${skin.name} for ${skin.value} SUI!`);
    }
  };

  const handleEquipSkin = (skin) => {
    if (skin.type === 'player') {
      setActivePlayerCosmetic(skin.id);
    } else {
      setActiveEnemyCosmetic(skin.id);
    }
    alert(`Equipped ${skin.name}!`);
  };





  const handlePurchaseCosmetic = async (cosmetic) => {
    if (!walletAddress) {
      alert('Please connect your wallet first!');
      return;
    }

    if (walletBalance && walletBalance.sui < cosmetic.price) {
      alert(`Insufficient SUI! You need ${cosmetic.price} SUI but only have ${walletBalance.sui.toFixed(4)} SUI`);
      return;
    }

    setIsSubmitting(true);

    const result = await purchaseCosmetic(cosmetic.id, cosmetic.price);
    
    setIsSubmitting(false);

    if (result.success) {
      if (result.cliCommand) {
        // Show CLI command for purchase
        const shouldProceed = window.confirm(
          `${cosmetic.name} - ${cosmetic.price} SUI\n\n` +
          `To complete this purchase, copy and run this command in your terminal:\n\n` +
          `${result.cliCommand}\n\n` +
          `Click OK to simulate purchase for demo purposes, or Cancel to abort.`
        );
        
        if (shouldProceed) {
          // Simulate purchase for demo
          setOwnedCosmetics(prev => [...prev, cosmetic.id]);
          
          // Set as active if it's the first of its type
          if (cosmetic.type === 'player' && activePlayerCosmetic === 0) {
            setActivePlayerCosmetic(cosmetic.id);
          } else if (cosmetic.type === 'enemy' && activeEnemyCosmetic === 0) {
            setActiveEnemyCosmetic(cosmetic.id);
          }
          
          alert(`${cosmetic.name} simulated purchase complete! In a real deployment, run the CLI command to spend actual SUI.`);
        }
      } else {
        // Real transaction completed
        setOwnedCosmetics(prev => [...prev, cosmetic.id]);
        
        if (cosmetic.type === 'player' && activePlayerCosmetic === 0) {
          setActivePlayerCosmetic(cosmetic.id);
        } else if (cosmetic.type === 'enemy' && activeEnemyCosmetic === 0) {
          setActiveEnemyCosmetic(cosmetic.id);
        }

        // Refresh wallet balance
        if (walletAddress) {
          const newBalance = await getWalletBalance(walletAddress);
          setWalletBalance(newBalance);
        }
        
        alert(`${cosmetic.name} purchased successfully! Transaction: ${result.digest}`);
      }
    } else {
      alert(`Failed to purchase ${cosmetic.name}: ${result.error}`);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setPlayerPos(50);
    setBullets([]);
    setEnemies([]);
  };

  const endGame = () => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
    }
    
    // Award random skin
    const newSkin = generateRandomSkin();
    setRandomSkins(prev => [newSkin, ...prev]);
  };

  const shoot = useCallback(() => {
    setBullets(prev => [...prev, { x: playerPos, y: 90, id: Date.now() }]);
  }, [playerPos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (e.key === ' ' && gameState === 'playing') {
        e.preventDefault();
        shoot();
      }
      if (e.key === 'Escape') {
        if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        } else if (gameState === 'shop') {
          setGameState('menu');
        }
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, shoot]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const enemySpawner = setInterval(() => {
      setEnemies(prev => [...prev, {
        x: Math.random() * 90 + 5,
        y: 0,
        id: Date.now() + Math.random()
      }]);
    }, 1000);

    return () => clearInterval(enemySpawner);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      // Move player
      if (keysPressed.current['ArrowLeft']) {
        setPlayerPos(prev => Math.max(5, prev - 2));
      }
      if (keysPressed.current['ArrowRight']) {
        setPlayerPos(prev => Math.min(95, prev + 2));
      }

      // Move bullets
      setBullets(prev => prev
        .map(b => ({ ...b, y: b.y - 3 }))
        .filter(b => b.y > 0)
      );

      // Move enemies
      setEnemies(prev => {
        const updated = prev
          .map(e => ({ ...e, y: e.y + 1 }))
          .filter(e => e.y < 100);
        
        // Check if any enemy reached bottom
        if (prev.some(e => e.y >= 95)) {
          endGame();
        }
        
        return updated;
      });

      // Check collisions
      setBullets(prevBullets => {
        let newBullets = [...prevBullets];
        setEnemies(prevEnemies => {
          let newEnemies = [...prevEnemies];
          let scoreIncrease = 0;

          newBullets = newBullets.filter(bullet => {
            const hitEnemy = newEnemies.findIndex(enemy => 
              Math.abs(bullet.x - enemy.x) < 5 && 
              Math.abs(bullet.y - enemy.y) < 5
            );
            
            if (hitEnemy !== -1) {
              newEnemies.splice(hitEnemy, 1);
              scoreIncrease += 10;
              return false;
            }
            return true;
          });

          if (scoreIncrease > 0) {
            setScore(prev => prev + scoreIncrease);
          }

          return newEnemies;
        });

        return newBullets;
      });
    }, 50);

    return () => clearInterval(gameLoopRef.current);
  }, [gameState]);

  return (
    <div className="App">

      {gameState === 'menu' && (
        <div className="menu">
          <h1>🚀 SPACE SHOOTER 🚀</h1>
          <p>Use ← → arrows to move</p>
          <p>Press SPACE to shoot</p>
          <p>Survive for 60 seconds!</p>
          
          <div className="menu-buttons">
            <button onClick={startGame} className="game-btn">🎮 START GAME</button>
            <button 
              onClick={handleOpenShop} 
              className="shop-btn"
            >
              🛒 SHOP
            </button>
          </div>
          
          {highScore > 0 && <p className="high-score">High Score: {highScore}</p>}
          
          {walletAddress && (
            <div className="menu-wallet-info">
              <p>💰 Balance: {walletBalance?.formatted || 'Loading...'}</p>
              {ownedCosmetics.length > 0 && (
                <p>🎨 Owned Cosmetics: {ownedCosmetics.length}</p>
              )}
            </div>
          )}
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-container">
          <div className="hud">
            <div className="score">Score: {score}</div>
            <div className="timer">Time: {timeLeft}s</div>
          </div>
          
          <div className="game-area">
            <div 
              className="player" 
              style={{ 
                left: `${playerPos}%`,
                background: (() => {
                  // Check random skins first
                  const randomSkin = randomSkins.find(s => s.id === activePlayerCosmetic && s.type === 'player');
                  if (randomSkin) return randomSkin.color;
                  
                  // Then check shop cosmetics
                  const shopCosmetic = shopCosmetics.find(c => c.id === activePlayerCosmetic);
                  if (shopCosmetic) return shopCosmetic.color;
                  
                  // Default
                  return 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)';
                })()
              }}
            ></div>
            
            {bullets.map(bullet => (
              <div 
                key={bullet.id} 
                className="bullet" 
                style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
              ></div>
            ))}
            
            {enemies.map(enemy => (
              <div 
                key={enemy.id} 
                className="enemy" 
                style={{ 
                  left: `${enemy.x}%`, 
                  top: `${enemy.y}%`,
                  background: (() => {
                    // Check random skins first
                    const randomSkin = randomSkins.find(s => s.id === activeEnemyCosmetic && s.type === 'enemy');
                    if (randomSkin) return randomSkin.color;
                    
                    // Then check shop cosmetics
                    const shopCosmetic = shopCosmetics.find(c => c.id === activeEnemyCosmetic);
                    if (shopCosmetic) return shopCosmetic.color;
                    
                    // Default
                    return 'linear-gradient(135deg, #ff006e 0%, #8b0000 100%)';
                  })()
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="pause-menu">
          <h1>⏸️ GAME PAUSED</h1>
          <p>Press ESC to resume or choose an option:</p>
          
          <div className="pause-buttons">
            <button onClick={() => setGameState('playing')} className="resume-btn">
              ▶️ RESUME GAME
            </button>
            <button 
              onClick={handleOpenShop} 
              className="shop-btn"
            >
              🛒 VISIT SHOP
            </button>
            <button onClick={() => setGameState('menu')} className="menu-btn">
              🏠 MAIN MENU
            </button>
          </div>

          {walletAddress && (
            <div className="pause-wallet-info">
              <p>💰 Balance: {walletBalance?.formatted || 'Loading...'}</p>
              {ownedCosmetics.length > 0 && (
                <p>🎨 Owned Cosmetics: {ownedCosmetics.length}</p>
              )}
            </div>
          )}
        </div>
      )}

      {gameState === 'shop' && (
        <div className="shop">
          <div className="shop-header">
            <button onClick={() => setGameState('menu')} className="shop-back-btn">
              ← MENU
            </button>
            <div className="shop-title">
              <h1>🛒 COSMETIC SHOP</h1>
              <p>Spend SUI tokens to customize your ship and enemies!</p>
            </div>
            {walletAddress && walletBalance && (
              <div className="shop-balance">
                💰 {walletBalance.formatted}
              </div>
            )}
          </div>
          
          <div className="shop-categories">
            {/* Random Skins Inventory */}
            {randomSkins.length > 0 && (
              <div className="shop-category">
                <h2>🎒 Your Inventory ({randomSkins.length} skins)</h2>
                <div className="cosmetics-grid">
                  {randomSkins.map(skin => (
                    <div key={skin.id} className="cosmetic-item random-skin">
                      <div 
                        className={`cosmetic-preview ${skin.type === 'player' ? 'player-preview' : 'enemy-preview'}`}
                        style={{ background: skin.color }}
                      ></div>
                      <h3>{skin.name}</h3>
                      <p className={`rarity-badge rarity-${skin.rarity.toLowerCase()}`}>
                        {skin.rarity}
                      </p>
                      <div className="cosmetic-price">💰 {skin.value} SUI</div>
                      
                      <div className="skin-actions">
                        <button 
                          className="cosmetic-btn equip"
                          onClick={() => handleEquipSkin(skin)}
                        >
                          {(skin.type === 'player' && activePlayerCosmetic === skin.id) || 
                           (skin.type === 'enemy' && activeEnemyCosmetic === skin.id) ? 
                           '✅ EQUIPPED' : '🎨 EQUIP'}
                        </button>
                        <button 
                          className="cosmetic-btn sell"
                          onClick={() => handleSellSkin(skin)}
                        >
                          💵 SELL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="shop-category">
              <h2>🚀 Player Ships</h2>
              <div className="cosmetics-grid">
                {shopCosmetics.filter(c => c.type === 'player').map(cosmetic => (
                  <div key={cosmetic.id} className="cosmetic-item">
                    <div 
                      className="cosmetic-preview player-preview"
                      style={{ background: cosmetic.color }}
                    ></div>
                    <h3>{cosmetic.name}</h3>
                    <p>{cosmetic.description}</p>
                    <div className="cosmetic-price">💰 {cosmetic.price} SUI</div>
                    
                    {ownedCosmetics.includes(cosmetic.id) ? (
                      <button 
                        className="cosmetic-btn owned"
                        onClick={() => setActivePlayerCosmetic(cosmetic.id)}
                      >
                        {activePlayerCosmetic === cosmetic.id ? '✅ ACTIVE' : '🎨 USE'}
                      </button>
                    ) : (
                      <button 
                        className="cosmetic-btn purchase"
                        onClick={() => handlePurchaseCosmetic(cosmetic)}
                        disabled={isSubmitting || !walletAddress}
                      >
                        {isSubmitting ? '⏳ BUYING...' : '💳 BUY'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="shop-category">
              <h2>👾 Enemy Ships</h2>
              <div className="cosmetics-grid">
                {shopCosmetics.filter(c => c.type === 'enemy').map(cosmetic => (
                  <div key={cosmetic.id} className="cosmetic-item">
                    <div 
                      className="cosmetic-preview enemy-preview"
                      style={{ background: cosmetic.color }}
                    ></div>
                    <h3>{cosmetic.name}</h3>
                    <p>{cosmetic.description}</p>
                    <div className="cosmetic-price">💰 {cosmetic.price} SUI</div>
                    
                    {ownedCosmetics.includes(cosmetic.id) ? (
                      <button 
                        className="cosmetic-btn owned"
                        onClick={() => setActiveEnemyCosmetic(cosmetic.id)}
                      >
                        {activeEnemyCosmetic === cosmetic.id ? '✅ ACTIVE' : '🎨 USE'}
                      </button>
                    ) : (
                      <button 
                        className="cosmetic-btn purchase"
                        onClick={() => handlePurchaseCosmetic(cosmetic)}
                        disabled={isSubmitting || !walletAddress}
                      >
                        {isSubmitting ? '⏳ BUYING...' : '💳 BUY'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      )}

      {gameState === 'gameover' && (
        <div className="menu">
          <h1>GAME OVER!</h1>
          <p className="final-score">Final Score: {score}</p>
          {score === highScore && score > 0 && <p className="new-high">🎉 NEW HIGH SCORE! 🎉</p>}
          
          {randomSkins.length > 0 && (
            <div className="new-skin-reward">
              <h2>🎁 NEW SKIN UNLOCKED!</h2>
              <div className="skin-preview-large">
                <div 
                  className={`skin-icon ${randomSkins[0].type === 'player' ? 'player-preview' : 'enemy-preview'}`}
                  style={{ background: randomSkins[0].color }}
                ></div>
                <div className="skin-details">
                  <h3>{randomSkins[0].name}</h3>
                  <p className={`rarity-${randomSkins[0].rarity.toLowerCase()}`}>
                    {randomSkins[0].rarity}
                  </p>
                  <p className="skin-value">💰 Worth {randomSkins[0].value} SUI</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="gameover-buttons">
            <button onClick={startGame} className="game-btn">🎮 PLAY AGAIN</button>
            <button 
              onClick={handleOpenShop} 
              className="shop-btn"
            >
              🛒 VISIT SHOP
            </button>
            <button onClick={() => setGameState('menu')} className="menu-btn">
              🏠 MAIN MENU
            </button>
          </div>

          {walletAddress && (
            <div className="gameover-wallet-info">
              <p>💰 Balance: {walletBalance?.formatted || 'Loading...'}</p>
              {ownedCosmetics.length > 0 && (
                <p>🎨 Owned Cosmetics: {ownedCosmetics.length}</p>
              )}
            </div>
          )}

          {!walletAddress && (
            <div className="gameover-connect-hint">
              <p>💡 Connect your wallet to access the shop and buy cosmetics!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
