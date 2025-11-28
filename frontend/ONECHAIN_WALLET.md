# 🔗 ONEChain Wallet Integration

## What is ONEChain Wallet?

ONEChain Wallet is a multi-chain wallet that supports Sui blockchain. The game now detects and works with ONEChain Wallet automatically!

## ✅ Detected!

If you see ONEChain Wallet in the debug info (`"onechainWallet": true`), you're all set!

## 🚀 Quick Start

### 1. Make Sure Wallet is Unlocked
1. Click the ONEChain Wallet extension icon
2. Enter your password if prompted
3. You should see your wallet dashboard

### 2. Switch to Sui Network
1. Open ONEChain Wallet
2. Look for network selector (usually at top)
3. Select **"Sui"** or **"Sui Testnet"**
4. Confirm the switch

### 3. Get Test Tokens
You need SUI tokens for gas fees:

**Option 1: CLI Faucet**
```bash
sui client faucet
```

**Option 2: Discord Faucet**
1. Join [Sui Discord](https://discord.gg/sui)
2. Go to #testnet-faucet
3. Request tokens with your address

**Option 3: Web Faucet**
Visit: https://faucet.sui.io/

### 4. Connect to Game
1. Refresh the game page
2. Click **"Connect Wallet"** button
3. ONEChain Wallet will pop up
4. Click **"Approve"** or **"Connect"**
5. Your address will appear in the game!

## 🎮 Submit Score

### Current Method: CLI (Recommended)

After playing, the game will show your wallet address and a CLI command:

1. **Copy the command** shown in the game
2. **Open your terminal**
3. **Paste and run** the command
4. **Confirm** in your terminal
5. **Check Sui Explorer** for your transaction!

Example command:
```bash
sui client call \
  --package 0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81 \
  --module game \
  --function submit_score \
  --args 0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849 YOUR_SCORE \
  --gas-budget 10000000
```

### Why CLI?

ONEChain Wallet requires the Sui SDK's TransactionBlock object for proper integration. The CLI method is more reliable and works perfectly with your connected wallet address.

### Future: Direct Wallet Integration

We're working on adding full ONEChain Wallet transaction signing support. For now, the CLI method ensures your scores are submitted correctly to the blockchain!

## 🔧 Troubleshooting

### Wallet Not Detected After Refresh
**Solution:**
1. Make sure ONEChain Wallet extension is enabled
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Wait 3-5 seconds for wallet to inject
4. Check debug panel (bottom-right) - should show `"onechainWallet": true`

### "No accounts found"
**Solution:**
1. Open ONEChain Wallet
2. Make sure you have a Sui account created
3. If not, create one in the wallet
4. Try connecting again

### "Wrong network"
**Solution:**
1. Open ONEChain Wallet
2. Switch to **Sui Testnet** (not Mainnet)
3. Refresh game page
4. Try again

### "Insufficient gas"
**Solution:**
```bash
# Get more test tokens
sui client faucet
```

Or copy your address from ONEChain Wallet and request tokens from Discord faucet.

### Connection Popup Doesn't Appear
**Solution:**
1. Check if popup blocker is blocking it
2. Look for ONEChain icon in browser toolbar - it might be waiting there
3. Click the extension icon manually
4. Try connecting again

### Transaction Fails
**Solution:**
1. Check you have enough SUI for gas (~0.01 SUI)
2. Make sure you're on Testnet network
3. Try with higher gas budget
4. Check transaction in wallet history for error details

## 📊 View Your Transactions

### In ONEChain Wallet
1. Open ONEChain Wallet
2. Go to "Activity" or "History" tab
3. See all your game score submissions
4. Click any transaction for details

### On Sui Explorer
After submitting a score, click the transaction link to view on:
https://suiexplorer.com/?network=testnet

## 🔍 Debug Info

The debug panel (bottom-right) should show:
```json
{
  "onechainWallet": true,
  "walletKeys": ["onechainWallet"],
  "extensions": [
    {
      "name": "onechainWallet",
      "methods": ["connect", "getAccounts", "signAndExecuteTransaction", ...]
    }
  ]
}
```

If `"onechainWallet": false`, the wallet is not injecting properly.

## 🆚 ONEChain vs Other Wallets

The game supports multiple Sui wallets:
- ✅ **ONEChain Wallet** (Multi-chain, detected as `onechainWallet`)
- ✅ **Sui Wallet** (Official, detected as `suiWallet`)
- ✅ **Suiet** (Popular alternative)
- ✅ **Ethos Wallet**

All work the same way - just click "Connect Wallet"!

## 💡 Tips

- Keep ONEChain Wallet unlocked while playing
- Make sure you're on Sui Testnet (not Mainnet)
- Get test tokens before playing
- Check transaction history in wallet
- Use debug panel to verify detection

## 🔗 Useful Links

- **ONEChain Wallet:** https://onechain.com/ (or check Chrome Web Store)
- **Sui Testnet Explorer:** https://suiexplorer.com/?network=testnet
- **Sui Discord:** https://discord.gg/sui
- **Sui Faucet:** https://faucet.sui.io/

## ❓ Still Having Issues?

1. Check browser console (F12) for errors
2. Look at debug panel for wallet detection status
3. Try the CLI method as alternative (click "Or use CLI")
4. Ask in Sui Discord #dev-help channel

---

**Your ONEChain Wallet is now ready to use with the game!** 🎮⛓️
