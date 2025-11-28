// Sui Testnet Configuration
export const SUI_CONFIG = {
  network: 'testnet',
  rpc: 'https://fullnode.testnet.sui.io:443',
  packageId: '0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81',
  leaderboardObjectId: '0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849',
  shopObjectId: 'REPLACE_AFTER_NEW_DEPLOYMENT', // Will be updated after deploying shop contract
  explorerUrl: 'https://suiexplorer.com/?network=testnet'
};

// Submit score to Sui blockchain via CLI command
export function getSubmitScoreCommand(score) {
  return `sui client call --package ${SUI_CONFIG.packageId} --module game --function submit_score --args ${SUI_CONFIG.leaderboardObjectId} ${score} --gas-budget 10000000`;
}

// Get explorer link for the leaderboard
export function getLeaderboardExplorerLink() {
  return `${SUI_CONFIG.explorerUrl}&object=${SUI_CONFIG.leaderboardObjectId}`;
}

// Get explorer link for the package
export function getPackageExplorerLink() {
  return `${SUI_CONFIG.explorerUrl}&object=${SUI_CONFIG.packageId}`;
}
