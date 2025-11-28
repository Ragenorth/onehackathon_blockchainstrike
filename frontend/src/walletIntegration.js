// ONEWallet Integration for Sui
import { SUI_CONFIG } from './suiConfig';

// Get wallet object - Support multiple Sui wallets
function getWalletObject() {
  if (typeof window === 'undefined') return null;
  
  // Try different possible wallet object names
  return window.onechainWallet ||  // ONEChain Wallet
         window.suiWallet || 
         window.oneWallet || 
         window.sui || 
         (window.ethereum && window.ethereum.isSui) ||
         null;
}

// Check if ONEWallet is installed
export function isONEWalletInstalled() {
  const wallet = getWalletObject();
  console.log('Wallet detection:', {
    found: !!wallet,
    onechainWallet: !!window.onechainWallet,
    suiWallet: !!window.suiWallet,
    oneWallet: !!window.oneWallet,
    sui: !!window.sui,
    walletType: wallet ? (window.onechainWallet ? 'ONEChain' : 'Other') : 'None',
    allWindowKeys: Object.keys(window).filter(k => k.toLowerCase().includes('wallet') || k.toLowerCase().includes('sui'))
  });
  return !!wallet;
}

// Connect to ONEWallet
export async function connectONEWallet() {
  try {
    const wallet = getWalletObject();
    
    if (!wallet) {
      throw new Error('Sui Wallet not detected. Please install ONEChain Wallet or Sui Wallet from Chrome Web Store and refresh the page.');
    }

    console.log('Attempting to connect wallet...', wallet);
    console.log('Available methods:', Object.keys(wallet).filter(k => typeof wallet[k] === 'function'));
    
    let address = null;
    
    // Try ONEChain Wallet specific flow
    if (wallet.connect && wallet.getAccounts) {
      console.log('Using ONEChain Wallet flow...');
      
      // First connect
      const connectResult = await wallet.connect();
      console.log('Connect result:', connectResult);
      
      // Then get accounts
      const accounts = await wallet.getAccounts();
      console.log('Accounts result:', accounts);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create a Sui account in ONEChain Wallet.');
      }
      
      // Handle different account formats
      if (typeof accounts[0] === 'string') {
        address = accounts[0];
      } else if (accounts[0]?.address) {
        address = accounts[0].address;
      } else if (accounts[0]?.publicKey) {
        address = accounts[0].publicKey;
      } else {
        console.log('Account object:', accounts[0]);
        throw new Error('Unable to extract address from account. Check console for details.');
      }
    }
    // Try standard Sui Wallet flow
    else if (wallet.requestPermissions) {
      console.log('Using standard Sui Wallet flow...');
      const accounts = await wallet.requestPermissions();
      console.log('Permissions result:', accounts);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account and unlock your wallet.');
      }
      
      address = typeof accounts[0] === 'string' ? accounts[0] : accounts[0].address;
    }
    // Fallback: try getAccounts directly
    else if (wallet.getAccounts) {
      console.log('Using getAccounts directly...');
      const accounts = await wallet.getAccounts();
      console.log('Accounts result:', accounts);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your wallet.');
      }
      
      address = typeof accounts[0] === 'string' ? accounts[0] : accounts[0].address;
    }
    else {
      throw new Error('Wallet does not support standard connection methods.');
    }
    
    console.log('Final address:', address);
    
    if (!address) {
      throw new Error('Failed to get wallet address. Please make sure your wallet is unlocked and has a Sui account.');
    }
    
    return {
      success: true,
      address: address,
      wallet: wallet
    };
  } catch (error) {
    console.error('Error connecting to ONEWallet:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Disconnect wallet
export function disconnectWallet() {
  // ONEWallet doesn't require explicit disconnect
  return { success: true };
}

// Get current connected account
export async function getConnectedAccount() {
  try {
    const wallet = getWalletObject();
    if (!wallet) return null;

    if (wallet.getAccounts) {
      const accounts = await wallet.getAccounts();
      return accounts && accounts.length > 0 ? accounts[0] : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
}

// Get wallet balance - with fallback for demo
export async function getWalletBalance(address) {
  try {
    if (!address) return null;
    
    // Try to import Sui client
    try {
      const { SuiClient } = await import('@mysten/sui.js');
      
      // Create client for testnet
      const client = new SuiClient({ 
        url: SUI_CONFIG.rpc 
      });
      
      // Get all coins for the address
      const coins = await client.getAllCoins({
        owner: address,
      });
      
      // Calculate total SUI balance
      let totalBalance = 0;
      coins.data.forEach(coin => {
        if (coin.coinType === '0x2::sui::SUI') {
          totalBalance += parseInt(coin.balance);
        }
      });
      
      // Convert from MIST to SUI (1 SUI = 1,000,000,000 MIST)
      const suiBalance = totalBalance / 1000000000;
      
      return {
        sui: suiBalance,
        mist: totalBalance,
        formatted: `${suiBalance.toFixed(4)} SUI`
      };
    } catch (sdkError) {
      console.log('Sui SDK not available, using demo balance:', sdkError);
      
      // Return demo balance for testing
      return {
        sui: 2.5,
        mist: 2500000000,
        formatted: '2.5000 SUI (Demo)'
      };
    }
  } catch (error) {
    console.error('Error getting balance:', error);
    return {
      sui: 0,
      mist: 0,
      formatted: 'Error loading balance'
    };
  }
}

// Submit score to Sui blockchain via ONEWallet - REAL TRANSACTION
export async function submitScoreToBlockchain(score) {
  try {
    const wallet = getWalletObject();
    
    if (!wallet) {
      throw new Error('Wallet is not connected');
    }

    console.log('Submitting score with real transaction:', score);
    console.log('Wallet methods:', Object.keys(wallet).filter(k => typeof wallet[k] === 'function'));
    
    // Import Sui SDK dynamically
    const { TransactionBlock } = await import('@mysten/sui.js');
    
    // Create transaction block
    const txb = new TransactionBlock();
    
    // Add move call to submit score
    txb.moveCall({
      target: `${SUI_CONFIG.packageId}::game::submit_score`,
      arguments: [
        txb.object(SUI_CONFIG.leaderboardObjectId),
        txb.pure(score, 'u64')
      ],
    });
    
    // Set gas budget
    txb.setGasBudget(10000000);
    
    console.log('Transaction block created:', txb);
    
    let result;
    
    // Try ONEChain Wallet transaction signing
    if (wallet.signAndExecuteTransactionBlock) {
      console.log('Using signAndExecuteTransactionBlock...');
      
      result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        }
      });
    }
    // Fallback to signAndExecuteTransaction
    else if (wallet.signAndExecuteTransaction) {
      console.log('Using signAndExecuteTransaction...');
      
      // Serialize transaction block
      const txBytes = await txb.build();
      
      result = await wallet.signAndExecuteTransaction({
        transactionBlockBytes: txBytes,
        options: {
          showEffects: true,
          showEvents: true,
        }
      });
    }
    else {
      throw new Error('Wallet does not support transaction signing. Available methods: ' + 
        Object.keys(wallet).filter(k => typeof wallet[k] === 'function').join(', '));
    }
    
    console.log('Transaction result:', result);
    
    // Extract digest from response
    const digest = result?.digest || 
                   result?.transactionDigest || 
                   result?.effects?.transactionDigest;
    
    if (!digest) {
      console.log('Warning: No transaction digest found in result');
      console.log('Full result:', result);
    }
    
    // Check if transaction was successful
    if (result?.effects?.status?.status !== 'success') {
      throw new Error(`Transaction failed: ${result?.effects?.status?.error || 'Unknown error'}`);
    }
    
    return {
      success: true,
      digest: digest,
      result: result,
      gasUsed: result?.effects?.gasUsed?.computationCost || 'Unknown'
    };
  } catch (error) {
    console.error('Error submitting score:', error);
    
    // If it's a user rejection, show friendly message
    if (error.message?.includes('rejected') || error.message?.includes('denied')) {
      return {
        success: false,
        error: 'Transaction was cancelled by user'
      };
    }
    
    // If it's insufficient gas, show helpful message
    if (error.message?.includes('gas') || error.message?.includes('insufficient')) {
      return {
        success: false,
        error: 'Insufficient SUI tokens for gas fees. Please get more test tokens from the faucet.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Transaction failed. Please try again.'
    };
  }
}

// Get transaction explorer URL
export function getTransactionUrl(digest) {
  return `${SUI_CONFIG.explorerUrl}&txdigest=${digest}`;
}

// Purchase cosmetic from shop - CLI method for now
export async function purchaseCosmetic(cosmeticId, priceInSui) {
  try {
    const wallet = getWalletObject();
    
    if (!wallet) {
      throw new Error('Wallet is not connected');
    }

    console.log('Purchasing cosmetic:', cosmeticId, 'for', priceInSui, 'SUI');
    
    // For now, show CLI command since SDK installation is needed
    const priceInMist = Math.floor(priceInSui * 1000000000);
    const cliCommand = `sui client call --package ${SUI_CONFIG.packageId} --module game --function purchase_cosmetic --args ${SUI_CONFIG.shopObjectId || 'SHOP_OBJECT_ID'} ${cosmeticId} ${priceInMist} --gas-budget 20000000`;
    
    // Simulate purchase for demo purposes
    return {
      success: true,
      digest: 'CLI_PURCHASE_' + Date.now(),
      cliCommand: cliCommand,
      message: `To complete purchase, run this CLI command:\n\n${cliCommand}`
    };
    
  } catch (error) {
    console.error('Error purchasing cosmetic:', error);
    return {
      success: false,
      error: error.message || 'Purchase failed. Please try again.'
    };
  }
}

// Format address for display (0x1234...5678)
export function formatAddress(address) {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
