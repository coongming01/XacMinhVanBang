# XacMinhVanBang - Hệ Thống Xác Minh Văn Bằng Trên Blockchain

Hệ thống cấp và xác minh văn bằng tốt nghiệp sử dụng Soulbound Token (SBT) trên Ethereum Blockchain.

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Smart Contract | Solidity + OpenZeppelin + Hardhat |
| Frontend | Next.js + Ethers.js |
| Lưu trữ | IPFS (Pinata) |
| Blockchain | Ethereum Sepolia Testnet |

## Cấu trúc

```
contracts/   # Hardhat project - Smart Contract
frontend/    # Next.js project - Giao diện web
```

## Cài đặt

### 1. Smart Contract
```bash
cd contracts
npm install
cp .env.example .env  # Điền PRIVATE_KEY và ALCHEMY_API_KEY
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Điền API keys
npm run dev
```

## Biến môi trường

Xem `.env.example` ở mỗi thư mục con.

## Tác giả

Văn Đức Công Minh — Đồ án An toàn ứng dụng Web 2026
