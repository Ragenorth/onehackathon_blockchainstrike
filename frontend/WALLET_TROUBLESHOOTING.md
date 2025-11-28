# 🔧 Wallet Detection Troubleshooting

## Issue: "ONEWallet not detected"

If you see this message even though ONEWallet is installed, try these steps:

### Step 1: Check Debug Info
Look at the bottom-right corner of the game screen. You'll see a debug panel showing:
- Which wallet objects are detected
- Available wallet methods
- Browser information

### Step 2: Verify Installation
1. Click the puzzle icon (🧩) in your browser toolbar
2. Look for "ONEWallet" or "Sui Wallet" in the list
3. Make sure it's enabled (not grayed out)
4. Pin it to your toolbar for easy access

### Step 3: Refresh the Page
Wallet extensions inject themselves when the page loads:
1. Press `Ctrl+R` (Windows) or `Cmd+R` (Mac)
2. Or click the refresh button
3. Wait 2-3 seconds for the wallet to load

### Step 4: Check Wallet is Unlocked
1. Click the ONEWallet extension icon
2. If it asks for a password, enter it
3. Make sure you see your wallet address
4. Refresh the game page

### Step 5: Verify Network
1. Open ONEWallet
2. Check the network dropdown at the top
3. Make sure it says **"Testnet"** (not Mainnet)
4. If not, switch to Testnet

### Step 6: Try Different Browser
Some wallets work better in specific browsers:
- **Chrome** - Best compatibility
- **Brave** - Good compatibility
- **Edge** - Good compatibility
- **Firefox** - May have issues

### Step 7: Reinstall Extension
If nothing works:
1. Remove ONEWallet extension
2. Restart browser
3. Reinstall from Chrome Web Store
4. Set up wallet again
5. Refresh game page

## Common Issues

### "No accounts found"
**Solution:** Create an account in ONEWallet first
1. Click ONEWallet icon
2. Follow setup wizard
3. Create new wallet or import existing
4. Refresh game

### "Connection failed"
**Solution:** Check wallet permissions
1. Open ONEWallet
2. Go to Settings → Connected Sites
3. Make sure localhost:3000 is allowed
4. Try connecting again

### "Transaction failed"
**Solution:** Check gas balance
```bash
# Get test tokens
sui client faucet
```
Or visit Discord #testnet-faucet

### Debug Info Shows Empty
**Solution:** Wallet not injecting properly
1. Wait 5 seconds after page load
2. Hard refresh: `Ctrl+Shift+R`
3. Check browser console (F12) for errors
4. Try incognito/private mode (with extension enabled)

## Alternative: Use CLI Method

If wallet connection keeps failing, you can still submit scores via CLI:

1. Play the game
2. Click "Or use CLI" button
3. Copy the command shown
4. Run it in your terminal
5. Score will be submitted!

## Debug Console Commands

Open browser console (F12) and try:

```javascript
// Check what's available
console.log('suiWallet:', window.suiWallet);
console.log('oneWallet:', window.oneWallet);
console.log('sui:', window.sui);

// List all wallet-related objects
Object.keys(window).filter(k => 
  k.toLowerCase().includes('wallet') || 
  k.toLowerCase().includes('sui')
);
```

## Still Not Working?

### Check Browser Console
1. Press `F12` to open DevTools
2. Click "Console" tab
3. Look for red error messages
4. Share them for help

### Verify Extension ID
Different Sui wallets have different names:
- ONEWallet
- Sui Wallet
- Suiet
- Ethos Wallet

Make sure you have the correct one installed.

### Contact Support
- [Sui Discord](https://discord.gg/sui) - #dev-help channel
- [ONEWallet Support](https://onewallet.io/)
- Check game console logs for detailed errors

## Expected Debug Output

When working correctly, you should see:
```json
{
  "suiWallet": true,
  "walletKeys": ["suiWallet"],
  "extensions": [
    {
      "name": "suiWallet",
      "methods": ["connect", "getAccounts", "signAndExecuteTransaction"]
    }
  ]
}
```

If you see `"suiWallet": false`, the wallet is not injecting properly.

---

**Need more help?** Check the browser console for detailed error messages!
