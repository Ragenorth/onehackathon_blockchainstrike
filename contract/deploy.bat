@echo off
echo 🚀 Deploying Arcade Shooter to Sui Testnet...
echo.

echo 📦 Building contract...
sui move build
echo.

echo 🌐 Publishing to Sui testnet...
sui client publish --gas-budget 100000000 --skip-dependency-verification
echo.

echo ✅ Deployment complete!
echo 📝 Save the Package ID and Leaderboard Object ID from the output above
pause
