# 🚀 Space Shooter - Sui Blockchain Game

**OneHack Hackathon Submission**

A thrilling 60-second arcade shooter game with seamless Sui blockchain integration and ONEChain Wallet support.

## 🎮 Demo Video

**[📹 Watch 3-Minute Demo](YOUR_VIDEO_LINK_HERE)**

## 🏆 OneHack Submission Details

- **Team:** [Your Team Name]
- **Category:** Gaming + Blockchain
- **Hackathon:** OneHack 2024
- **Blockchain:** Sui Network
- **Wallet Integration:** ONEChain Wallet

## ✨ Features

### 🎯 Game Features
- **60-second survival challenge** - Fast-paced arcade action
- **Smooth controls** - Arrow keys to move, spacebar to shoot
- **Real-time scoring** - Earn points by destroying enemies
- **Pure CSS graphics** - No external assets, all CSS animations
- **Local high scores** - Track your personal best

### ⛓️ Blockchain Integration
- **ONEChain Wallet support** - Seamless wallet connection
- **Sui smart contract** - Deployed on Sui Testnet
- **Score submission** - Permanent blockchain records
- **Transaction verification** - View on Sui Explorer
- **Multi-wallet support** - Works with various Sui wallets

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- ONEChain Wallet browser extension
- Sui CLI (for score submission)

### Installation

1. **Clone the repository**
   ```bash
   git clone [YOUR_REPO_URL]
   cd space-shooter-sui
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the game**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Game runs at: http://localhost:3000

### Setup ONEChain Wallet

1. Install [ONEChain Wallet](https://chrome.google.com/webstore) extension
2. Create or import your wallet
3. Switch to **Sui Testnet**
4. Get test tokens from [Sui Faucet](https://discord.gg/sui)

## 🎮 How to Play

1. **Connect Wallet** - Click "Connect Wallet" at the top
2. **Start Game** - Click "START GAME"
3. **Controls:**
   - **← →** Arrow keys to move
   - **SPACE** to shoot
4. **Survive** - Avoid enemies for 60 seconds
5. **Submit Score** - Copy CLI command after game over

## ⛓️ Blockchain Details

### Smart Contract
- **Network:** Sui Testnet
- **Package ID:** `0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81`
- **Contract:** [View on Sui Explorer](https://suiexplorer.com/object/0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81?network=testnet)

### Functions
- `submit_score(leaderboard, score)` - Submit player score
- `get_top_score(leaderboard)` - Get highest score
- `get_top_player(leaderboard)` - Get top player address

### Score Submission
After playing, copy and run the CLI command shown:
```bash
sui client call \
  --package 0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81 \
  --module game \
  --function submit_score \
  --args 0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849 YOUR_SCORE \
  --gas-budget 10000000
```

## 🏗️ Technical Architecture

### Frontend
- **Framework:** React 19
- **Styling:** Pure CSS with animations
- **Wallet Integration:** ONEChain Wallet API
- **State Management:** React Hooks

### Smart Contract
- **Language:** Move (Sui)
- **Features:** Score storage, leaderboard, events
- **Network:** Sui Testnet

### Project Structure
```
├── contract/
│   ├── sources/
│   │   └── game.move          # Smart contract
│   ├── Move.toml              # Contract config
│   └── README.md              # Contract docs
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main game logic
│   │   ├── App.css            # Game styling
│   │   ├── walletIntegration.js # Wallet functions
│   │   └── suiConfig.js       # Blockchain config
│   └── package.json           # Dependencies
└── docs/                      # Documentation
```

## 🎯 OneHack Requirements Compliance

### ✅ Submission Requirements
- [x] **Working MVP** - Fully functional game
- [x] **OneWallet Integration** - ONEChain Wallet support
- [x] **Demo Video** - 3-minute demonstration
- [x] **GitHub Repo** - Complete source code
- [x] **Original Work** - Built during hackathon

### ✅ Technical Innovation
- **Blockchain Gaming** - Real-time game with permanent scoring
- **Wallet Integration** - Seamless ONEChain Wallet connection
- **Smart Contract** - Custom Move contract on Sui
- **User Experience** - Web2 feel with Web3 functionality

## 🏆 Competitive Advantages

### Innovation
- **Hybrid Gaming** - Traditional arcade meets blockchain
- **Educational** - Teaches blockchain interaction through gaming
- **Accessible** - Easy wallet connection and score submission

### Technical Excellence
- **Performance** - Smooth 60fps gameplay
- **Security** - Secure smart contract with proper validation
- **Documentation** - Comprehensive guides and troubleshooting

### User Experience
- **Intuitive** - Simple controls and clear instructions
- **Reliable** - Robust error handling and fallbacks
- **Engaging** - Addictive gameplay with blockchain rewards

## 📚 Documentation

- [Setup Guide](./DEPLOYMENT_GUIDE.md) - Complete installation instructions
- [ONEChain Wallet Guide](./frontend/ONECHAIN_WALLET.md) - Wallet setup help
- [Troubleshooting](./frontend/WALLET_TROUBLESHOOTING.md) - Common issues
- [Technical Details](./SETUP_COMPLETE.md) - Architecture overview

## 🔗 Links

- **Demo Video:** [YOUR_VIDEO_LINK]
- **Live Game:** [DEPLOYED_URL] (if deployed)
- **Smart Contract:** [Sui Explorer Link](https://suiexplorer.com/object/0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81?network=testnet)
- **Leaderboard:** [Sui Explorer Link](https://suiexplorer.com/object/0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849?network=testnet)

## 👥 Team

- **[Your Name]** - Full Stack Developer & Blockchain Integration
- **[Team Member 2]** - [Role] (if applicable)
- **[Team Member 3]** - [Role] (if applicable)

## 🏅 Hackathon Journey

This project was built from scratch during the OneHack hackathon, showcasing:
- Rapid prototyping and development
- Blockchain integration expertise
- User-centered design thinking
- Technical documentation skills

**Built with ❤️ for OneHack 2024**

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

---

**Ready to play and submit scores to the blockchain!** 🎮⛓️🏆