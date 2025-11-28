#!/bin/bash

echo "🚀 Deploying Arcade Shooter to Sui Testnet..."

# Build the contract
echo "📦 Building contract..."
sui move build

# Publish to testnet
echo "🌐 Publishing to Sui testnet..."
sui client publish --gas-budget 100000000 --skip-dependency-verification

echo "✅ Deployment complete!"
echo "📝 Save the Package ID and Leaderboard Object ID from the output above"
