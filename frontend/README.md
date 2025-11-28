# 🚀 Space Shooter - Sui Blockchain Game

A fun arcade-style space shooter game with Sui blockchain integration for score submission!

## 🎮 Game Features

- **60-second survival challenge** - Stay alive and shoot enemies
- **Score tracking** - Earn points by destroying enemies
- **Local high score** - Beat your personal best
- **ONEWallet integration** - Connect wallet and submit scores directly
- **Sui blockchain integration** - Scores stored on Sui testnet

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run the Game
```bash
npm start
```

The game will open at [http://localhost:3000](http://localhost:3000)

## 🎯 How to Play

- **← →** Arrow keys to move left/right
- **SPACE** to shoot
- **Survive 60 seconds** and get the highest score!

## ⛓️ Sui Blockchain Integration

### Deployed Contract Info
- **Network:** Sui Testnet
- **Package ID:** `0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81`
- **Leaderboard Object:** `0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849`

### 👛 Connect Wallet

**Supported Wallets:**
- ✅ ONEChain Wallet (Multi-chain)
- ✅ Sui Wallet (Official)
- ✅ Suiet
- ✅ Other Sui-compatible wallets

**Quick Setup:**
1. Install a Sui wallet extension from Chrome Web Store
2. Create or import your wallet
3. Switch to **Sui Testnet**
4. Get test tokens from [Sui Faucet](https://discord.gg/sui)
5. Click **"Connect Wallet"** in the game
6. After game over, **copy the CLI command** shown
7. **Run the command** in your terminal to submit score

Your score will be submitted to the Sui blockchain!

**Note:** ONEChain Wallet users: The game shows a CLI command for reliable score submission. Direct wallet signing coming soon!

📖 **Need help?** 
- [ONEChain Wallet Guide](./ONECHAIN_WALLET.md) - For ONEChain Wallet users
- [ONEWallet Setup Guide](./ONEWALLET_SETUP.md) - For Sui Wallet users
- [Wallet Troubleshooting](./WALLET_TROUBLESHOOTING.md) - Fix detection issues

### Alternative: Submit via CLI

If you prefer using the command line, click **"Or use CLI"** to see the command:

```bash
sui client call \
  --package 0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81 \
  --module game \
  --function submit_score \
  --args 0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849 YOUR_SCORE \
  --gas-budget 10000000
```

### View on Sui Explorer

Check the leaderboard and transactions on [Sui Explorer](https://suiexplorer.com/?network=testnet)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.js          # Main game logic
│   ├── App.css         # Game styling
│   ├── suiConfig.js    # Sui blockchain configuration
│   └── index.js        # React entry point
├── public/
└── package.json
```

## 🛠️ Configuration

### Blockchain Settings
Edit `src/suiConfig.js` to update:
- Package ID
- Leaderboard Object ID
- RPC endpoint
- Network

### Wallet Integration
The game uses `src/walletIntegration.js` for ONEWallet connection:
- Automatic wallet detection
- Transaction signing
- Score submission

## 🎨 Built With

- React 19
- Pure CSS animations
- Sui blockchain (testnet)

## 📝 License

MIT
