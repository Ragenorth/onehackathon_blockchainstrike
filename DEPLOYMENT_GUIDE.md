# 🎮 Arcade Shooter - 部署指南

## ✅ 部署状态

**合约已成功部署到 Sui Testnet！**

- **Package ID:** `0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81`
- **Leaderboard Object ID:** `0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849`
- **Network:** Sui Testnet
- **Explorer:** [View on Sui Explorer](https://suiexplorer.com/object/0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81?network=testnet)

---

## 游戏功能
- ⏱️ 60秒时间限制
- 🎯 射击敌人得分
- 🏆 本地最高分记录
- 👛 ONEWallet 钱包集成
- ⛓️ Sui区块链集成 - 直接提交分数
- 🎨 纯CSS绘制的游戏资源

## 快速开始

### 1️⃣ 运行游戏
```bash
cd frontend
npm install
npm start
```

游戏将在 http://localhost:3000 打开

### 控制方式:
- ⬅️ ➡️ 左右箭头键移动
- ⎵ 空格键射击
- 存活60秒并获得最高分！

### 使用 ONEWallet:
1. 安装 [ONEWallet 浏览器扩展](https://chrome.google.com/webstore)
2. 在游戏中点击 **"Connect ONEWallet"**
3. 游戏结束后点击 **"Submit Score to Blockchain"**
4. 确认交易，分数将提交到 Sui 区块链！

---

## 2️⃣ 部署 Sui 智能合约 (已完成)

### 前置要求
1. 安装 Sui CLI
2. 配置 OneWallet (使用 Sui 网络)
3. 获取 Testnet 测试币

### 详细步骤

#### A. 安装 Sui CLI
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

#### B. 配置 Sui Testnet
```bash
# 添加 testnet 环境
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# 切换到 testnet
sui client switch --env testnet

# 确认当前环境
sui client envs
```

#### C. 导入 OneWallet 钱包
```bash
# 方法1: 导入现有钱包的助记词
sui keytool import "your twelve word mnemonic phrase here" ed25519

# 方法2: 创建新地址
sui client new-address ed25519

# 查看当前地址
sui client active-address
```

#### D. 获取测试币
```bash
# 使用 CLI 获取
sui client faucet

# 或访问 Discord Faucet:
# https://discord.com/channels/916379725201563759/971488439931392130
```

#### E. 部署合约 ✅
```bash
cd contract

# 构建合约
sui move build

# 发布到 testnet (gas budget: 0.1 SUI)
sui client publish --gas-budget 100000000
```

**状态:** ✅ 已完成

#### F. 保存部署信息 ✅
部署成功！已自动更新配置文件:
- ✅ `contract/sui-config.json`
- ✅ `frontend/src/suiConfig.js`

**部署信息:**
- Package ID: `0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81`
- Leaderboard: `0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849`
- Gas Used: ~0.013 SUI

---

## 3️⃣ 使用智能合约

### 方式 1: 使用 ONEWallet (推荐)
1. 在游戏界面点击 **"Connect ONEWallet"**
2. 游戏结束后点击 **"Submit Score to Blockchain"**
3. 在 ONEWallet 弹窗中确认交易
4. 等待交易确认，查看结果！

### 方式 2: 使用 CLI
游戏结束后，点击 **"Or use CLI"** 按钮获取命令，或直接运行：

```bash
sui client call \
  --package 0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81 \
  --module game \
  --function submit_score \
  --args 0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849 YOUR_SCORE \
  --gas-budget 10000000
```

将 `YOUR_SCORE` 替换为你的实际分数。

### 查看排行榜
```bash
sui client object 0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849
```

### 在浏览器查看
- **合约:** https://suiexplorer.com/object/0xfbcea7587ae70ddb97b96805af0815d20fd63600e49104462d37e3cd526e8b81?network=testnet
- **排行榜:** https://suiexplorer.com/object/0xfe2f60afd619d567aa1e830d0c94e8c962b7c81e4c1b674c9d7f2a13fafb0849?network=testnet

---

## 📝 合约功能说明

### submit_score
- 提交游戏分数到区块链
- 自动更新最高分记录
- 发出链上事件

### get_top_score
- 查询当前最高分

### get_top_player
- 查询最高分玩家地址

---

## 🔧 故障排除

### Gas 不足
```bash
sui client faucet
```

### 查看余额
```bash
sui client gas
```

### 查看交易历史
```bash
sui client transactions
```

### 切换钱包地址
```bash
sui client addresses
sui client switch --address <ADDRESS>
```

---

## 🌐 Sui Testnet 资源

- **RPC**: https://fullnode.testnet.sui.io:443
- **WebSocket**: wss://fullnode.testnet.sui.io:443
- **Explorer**: https://suiexplorer.com/?network=testnet
- **Faucet**: Discord #testnet-faucet channel

---

## 🎯 完成状态

1. ✅ 游戏已创建并可以运行
2. ✅ 智能合约已成功部署到 Sui Testnet
3. ✅ 前端已集成 Sui 配置
4. ✅ 游戏界面显示区块链提交命令
5. ✅ 所有配置文件已更新

## 🚀 开始游戏

```bash
cd frontend
npm start
```

游戏将在 http://localhost:3000 打开

享受游戏吧！🎮⛓️
