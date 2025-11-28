# Arcade Shooter - Sui Smart Contract

## 设置 Sui CLI 和 OneWallet

### 1. 安装 Sui CLI
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

### 2. 配置 Sui Testnet
```bash
# 切换到 testnet
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# 激活 testnet
sui client switch --env testnet

# 查看当前配置
sui client envs
```

### 3. 导入 OneWallet 钱包
```bash
# 使用你的 OneWallet 私钥导入
sui keytool import "your-private-key-phrase" ed25519

# 或者创建新地址
sui client new-address ed25519

# 查看地址
sui client active-address
```

### 4. 获取测试币
访问 Sui Testnet Faucet:
```bash
# 方法1: 使用 CLI
sui client faucet

# 方法2: 访问网页
# https://discord.com/channels/916379725201563759/971488439931392130
```

### 5. 部署合约
```bash
cd contract

# 构建
sui move build

# 发布到 testnet
sui client publish --gas-budget 100000000 --skip-dependency-verification
```

### 6. 保存部署信息
部署后，保存以下信息：
- **Package ID**: 合约包的 ID
- **Leaderboard Object ID**: 共享对象的 ID

### 7. 调用合约
```bash
# 提交分数
sui client call \
  --package <PACKAGE_ID> \
  --module game \
  --function submit_score \
  --args <LEADERBOARD_OBJECT_ID> 1000 \
  --gas-budget 10000000

# 查看排行榜
sui client object <LEADERBOARD_OBJECT_ID>
```

## 合约功能

### submit_score
提交游戏分数到链上
- 参数: leaderboard (共享对象), score (u64)
- 自动更新最高分记录
- 发出事件通知

### get_top_score
查询当前最高分

### get_top_player
查询最高分玩家地址

## RPC 端点

**Sui Testnet RPC:**
- https://fullnode.testnet.sui.io:443
- wss://fullnode.testnet.sui.io:443

**Sui Testnet Explorer:**
- https://suiexplorer.com/?network=testnet

## 故障排除

### 如果 gas 不足
```bash
sui client faucet
```

### 查看交易历史
```bash
sui client transactions
```

### 查看对象详情
```bash
sui client object <OBJECT_ID>
```
