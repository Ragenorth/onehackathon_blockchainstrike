# 👛 ONEWallet Setup Guide

## What is ONEWallet?

ONEWallet is a browser extension wallet for Sui blockchain. It allows you to:
- Store and manage SUI tokens
- Sign transactions securely
- Interact with Sui dApps like this game

## Installation Steps

### 1. Install ONEWallet Extension

**Chrome/Brave/Edge:**
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "ONEWallet" or "Sui Wallet"
3. Click "Add to Chrome/Browser"
4. Confirm the installation

### 2. Create or Import Wallet

**Create New Wallet:**
1. Click the ONEWallet extension icon
2. Select "Create New Wallet"
3. **IMPORTANT:** Write down your recovery phrase (12 or 24 words)
4. Store it safely - you'll need it to recover your wallet
5. Set a strong password
6. Confirm and create

**Import Existing Wallet:**
1. Click the ONEWallet extension icon
2. Select "Import Wallet"
3. Enter your recovery phrase
4. Set a password
5. Confirm and import

### 3. Switch to Testnet

1. Open ONEWallet
2. Click the network dropdown (usually shows "Mainnet")
3. Select **"Testnet"**
4. Confirm the switch

### 4. Get Test Tokens

You need SUI tokens to pay for transactions (gas fees):

**Method 1: Sui Faucet (CLI)**
```bash
sui client faucet
```

**Method 2: Discord Faucet**
1. Join [Sui Discord](https://discord.gg/sui)
2. Go to #testnet-faucet channel
3. Type: `!faucet <YOUR_WALLET_ADDRESS>`
4. Wait for tokens to arrive

**Method 3: Web Faucet**
Visit: https://faucet.sui.io/

### 5. Connect to Game

1. Open the Space Shooter game
2. Click **"Connect ONEWallet"** at the top
3. ONEWallet will pop up asking for permission
4. Click **"Approve"** or **"Connect"**
5. Your wallet address will appear in the game

## Using ONEWallet in Game

### Submit Score to Blockchain

1. Play the game and finish (survive 60 seconds or get hit)
2. Click **"Submit Score to Blockchain"**
3. ONEWallet will pop up with transaction details:
   - Function: `submit_score`
   - Arguments: Your score
   - Gas fee: ~0.01 SUI
4. Review and click **"Approve"**
5. Wait for confirmation (usually 2-5 seconds)
6. See your transaction on Sui Explorer!

### View Your Transactions

1. Open ONEWallet
2. Click "Activity" or "Transactions"
3. See all your submitted scores
4. Click any transaction to view on Sui Explorer

## Troubleshooting

### ONEWallet Not Detected
- Make sure the extension is installed and enabled
- Refresh the game page
- Try restarting your browser

### Connection Failed
- Check if ONEWallet is unlocked (enter password)
- Make sure you're on Testnet network
- Try disconnecting and reconnecting

### Transaction Failed
- Check if you have enough SUI for gas fees
- Get more test tokens from faucet
- Make sure you're on the correct network (Testnet)

### Insufficient Gas
```bash
# Get more test tokens
sui client faucet
```

## Security Tips

🔒 **NEVER share your recovery phrase with anyone!**
🔒 **Store your recovery phrase offline and securely**
🔒 **Use a strong password for ONEWallet**
🔒 **This is testnet - don't use real money**
🔒 **Always verify transaction details before approving**

## Network Information

- **Network:** Sui Testnet
- **RPC:** https://fullnode.testnet.sui.io:443
- **Explorer:** https://suiexplorer.com/?network=testnet
- **Faucet:** Discord #testnet-faucet

## Need Help?

- [Sui Documentation](https://docs.sui.io/)
- [Sui Discord](https://discord.gg/sui)
- [ONEWallet Support](https://onewallet.io/)

---

Happy Gaming! 🎮⛓️
