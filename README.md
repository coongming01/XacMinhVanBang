# 🎓 XacMinhVanBang — Hệ Thống Xác Minh Văn Bằng Trên Blockchain

<div align="center">

**Hệ thống cấp và xác minh văn bằng tốt nghiệp sử dụng Soulbound Token (SBT) trên Ethereum Blockchain**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-363636?logo=solidity)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Ethereum](https://img.shields.io/badge/Network-Sepolia_Testnet-3C3C3D?logo=ethereum)](https://sepolia.etherscan.io/)
[![IPFS](https://img.shields.io/badge/Storage-IPFS_(Pinata)-65C2CB?logo=ipfs)](https://pinata.cloud/)
[![Tests](https://img.shields.io/badge/Tests-45_passing-brightgreen)]()

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Smart Contract](#-smart-contract)
- [Quy trình hoạt động](#-quy-trình-hoạt-động)
- [Biến môi trường](#-biến-môi-trường)
- [Tác giả](#-tác-giả)

---

## 📖 Giới thiệu

**XacMinhVanBang** là hệ thống ứng dụng công nghệ Blockchain để giải quyết vấn đề **giả mạo văn bằng tốt nghiệp** trong giáo dục. Hệ thống sử dụng **Soulbound Token (SBT)** — một loại NFT không thể chuyển nhượng — để đảm bảo tính xác thực, minh bạch và bất biến của văn bằng.

### Vấn đề giải quyết

| ❌ Truyền thống | ✅ Blockchain |
|---|---|
| Văn bằng giấy dễ giả mạo | Dữ liệu ghi trên blockchain, không thể sửa đổi |
| Xác minh thủ công, mất thời gian | Xác minh tức thì bằng QR code |
| Phụ thuộc vào cơ sở đào tạo | Dữ liệu phi tập trung, không phụ thuộc server |
| Không minh bạch phí cấp bằng | Phí thu qua smart contract, minh bạch 100% |

---

## 🏗 Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Landing  │  │  Admin   │  │ Student  │  │   Verify   │  │
│  │  Page    │  │  Page    │  │  Page    │  │   Page     │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│         │              │            │              │        │
│         └──────────────┼────────────┼──────────────┘        │
│                        │            │                       │
│              ┌─────────┴────────────┴──────────┐            │
│              │    Ethers.js + MetaMask Wallet   │            │
│              └─────────────────┬────────────────┘            │
└────────────────────────────────┼────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
           ┌───────┴───────┐    │   ┌────────┴────────┐
           │   Ethereum    │    │   │   IPFS (Pinata)  │
           │   Sepolia     │    │   │                  │
           │  ┌──────────┐ │    │   │  • File bằng     │
           │  │  Smart   │ │    │   │  • Metadata JSON │
           │  │ Contract │ │    │   │  • Lưu trữ phi   │
           │  │  (SBT)   │ │    │   │    tập trung     │
           │  └──────────┘ │    │   └─────────────────┘
           └───────────────┘    │
                                │
                    ┌───────────┴───────────┐
                    │   Alchemy RPC Node    │
                    │   (Read blockchain)   │
                    └───────────────────────┘
```

---

## ✨ Tính năng

### 🔐 Smart Contract (Solidity)
- **Soulbound Token (SBT)**: Văn bằng gắn vĩnh viễn với ví sinh viên, không thể chuyển nhượng
- **Hệ thống yêu cầu 2 bước**: Admin tạo yêu cầu → Sinh viên xác nhận & thanh toán
- **Phí cấp bằng on-chain**: 0.3 ETH, thu tự động qua smart contract
- **Hết hạn tự động**: Yêu cầu hết hạn sau 30 ngày nếu chưa xác nhận
- **Từ chối có lý do**: Sinh viên từ chối → lý do ghi vĩnh viễn trên blockchain
- **Thu hồi văn bằng**: Admin có thể thu hồi (revoke) bằng nếu phát hiện sai phạm
- **Cấp hàng loạt**: Hỗ trợ tạo nhiều yêu cầu cùng lúc (batch)

### 👨‍💼 Admin (Quản trị viên)
- Kết nối ví MetaMask với quyền MINTER_ROLE
- Tạo yêu cầu cấp bằng: nhập thông tin + upload file bằng lên IPFS
- Cấp hàng loạt qua file CSV
- Dashboard thống kê: tổng bằng, đang chờ, tổng phí thu
- Hủy yêu cầu đang chờ
- Thu hồi bằng đã cấp

### 🎓 Sinh viên
- Kết nối ví MetaMask để xem yêu cầu đang chờ
- Kiểm tra thông tin bằng trước khi xác nhận
- Xác nhận & thanh toán 0.3 ETH → Mint SBT
- Từ chối nếu thông tin sai (kèm lý do)
- Xem danh sách bằng đã nhận
- Tạo QR code thông minh cho từng bằng

### 🔍 Xác minh công khai
- Xác minh bằng **địa chỉ ví** (Ethereum address)
- Xác minh bằng **Token ID**
- Quét **QR code** → tự động xác minh
- Không cần tài khoản, ai cũng có thể xác minh

---

## 🛠 Công nghệ

| Thành phần | Công nghệ | Mô tả |
|---|---|---|
| **Smart Contract** | Solidity 0.8.27 | Ngôn ngữ lập trình smart contract |
| **Framework** | OpenZeppelin v5 | Thư viện chuẩn ERC-721, AccessControl |
| **Dev Tools** | Hardhat | Compile, test, deploy smart contract |
| **Frontend** | Next.js 14 (App Router) | Framework React SSR/SSG |
| **Blockchain** | Ethers.js v6 | Tương tác với Ethereum từ frontend |
| **Wallet** | MetaMask | Ví điện tử cho người dùng |
| **Lưu trữ** | IPFS (Pinata) | Lưu file bằng và metadata phi tập trung |
| **Network** | Ethereum Sepolia | Testnet để phát triển và demo |
| **RPC** | Alchemy | Node đọc dữ liệu blockchain |
| **QR Code** | qrcode.react | Tạo mã QR xác minh thông minh |

---

## 📁 Cấu trúc dự án

```
XacMinhVanBang/
├── contracts/                      # Hardhat project
│   ├── contracts/
│   │   └── SoulboundDegreeV2.sol   # Smart contract chính
│   ├── scripts/
│   │   └── deploy.js               # Script deploy lên Sepolia
│   ├── test/
│   │   └── SoulboundDegreeV2.test.js  # 78 unit tests
│   ├── hardhat.config.js           # Cấu hình Hardhat
│   ├── .env.example                # Mẫu biến môi trường
│   └── package.json
│
├── frontend/                       # Next.js project
│   ├── app/
│   │   ├── page.js                 # Landing page
│   │   ├── admin/page.js           # Trang quản trị
│   │   ├── student/page.js         # Trang sinh viên
│   │   ├── verify/page.js          # Trang xác minh
│   │   ├── api/
│   │   │   ├── upload-file/route.js  # API upload file → IPFS
│   │   │   └── upload-json/route.js  # API upload JSON → IPFS
│   │   ├── globals.css             # Design system
│   │   └── layout.js               # Root layout
│   ├── components/
│   │   ├── ConnectWallet.js        # Component kết nối MetaMask
│   │   ├── DegreeCard.js           # Card hiển thị bằng
│   │   ├── Header.js               # Thanh điều hướng
│   │   ├── Footer.js               # Footer
│   │   └── QRCodeGenerator.js      # Tạo QR code thông minh
│   ├── lib/
│   │   ├── contract.js             # ABI + helper tương tác contract
│   │   └── pinata.js               # Helper upload/fetch IPFS
│   ├── next.config.js              # Cấu hình Next.js
│   ├── .env.example                # Mẫu biến môi trường
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js >= 18
- MetaMask browser extension
- Sepolia ETH (lấy từ [faucet](https://sepoliafaucet.com/))

### 1. Clone dự án

```bash
git clone https://github.com/coongming01/XacMinhVanBang.git
cd XacMinhVanBang
```

### 2. Smart Contract

```bash
cd contracts
npm install

# Cấu hình biến môi trường
cp .env.example .env
# Sửa .env: điền ALCHEMY_API_KEY và PRIVATE_KEY

# Chạy test
npx hardhat test

# Deploy lên Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Frontend

```bash
cd frontend
npm install

# Cấu hình biến môi trường
cp .env.example .env.local
# Sửa .env.local: điền contract address và API keys

# Chạy development server
npm run dev
```

Truy cập: http://localhost:3000

---

## 📜 Smart Contract

### Thông tin deploy

| Thông số | Giá trị |
|---|---|
| **Contract** | `SoulboundDegreeV2` |
| **Network** | Ethereum Sepolia Testnet |
| **Address** | `0x41d204D469184a6217D1431F9B939149834A53A7` |
| **Phí cấp bằng** | 0.3 ETH |
| **Thời hạn yêu cầu** | 30 ngày |
| **Token chuẩn** | ERC-721 (Soulbound — không chuyển nhượng được) |

### Các hàm chính

| Hàm | Quyền | Mô tả |
|---|---|---|
| `createRequest(student, uri)` | Admin | Tạo yêu cầu cấp bằng |
| `createBatchRequests(students[], uris[])` | Admin | Tạo hàng loạt yêu cầu |
| `confirmAndMint(requestId)` | Student | Xác nhận + thanh toán 0.3 ETH → Mint SBT |
| `rejectRequest(requestId, reason)` | Student | Từ chối yêu cầu kèm lý do |
| `cancelRequest(requestId)` | Admin | Hủy yêu cầu đang chờ |
| `revoke(tokenId)` | Admin | Thu hồi văn bằng |
| `cleanExpired(requestId)` | Anyone | Đánh dấu yêu cầu hết hạn |

### Xem trên Etherscan

🔗 [Xem contract trên Sepolia Etherscan](https://sepolia.etherscan.io/address/0x41d204D469184a6217D1431F9B939149834A53A7)

---

## 🔄 Quy trình hoạt động

```
  ┌──────────────────┐
  │  1. ADMIN tạo    │     Ghi lên Blockchain
  │  yêu cầu cấp    │────────────────────────►  RequestCreated Event
  │  bằng            │     (Gas ~0.002 ETH)
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │  2. SINH VIÊN    │
  │  kiểm tra        │
  │  thông tin       │
  └────────┬─────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
  ┌────────┐  ┌────────────────┐
  │ ĐÚNG ✅│  │ SAI ❌          │
  │        │  │                │
  │ Xác    │  │ Từ chối +      │
  │ nhận & │  │ ghi lý do      │
  │ trả    │  │ lên blockchain │
  │ 0.3ETH │  └────────────────┘
  └───┬────┘
      │
      ▼
  ┌──────────────────┐
  │  3. MINT SBT     │     Token gắn vĩnh viễn
  │  Soulbound Token │────────────────────────►  Không thể chuyển nhượng
  │  + Phí → Treasury│     Phí → Ví Admin
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │  4. XÁC MINH     │     Quét QR / Nhập ví
  │  Ai cũng có thể  │────────────────────────►  Kết quả tức thì
  │  xác minh        │     Không cần tài khoản
  └──────────────────┘
```

---

## 🔑 Biến môi trường

### Smart Contract (`contracts/.env`)

| Biến | Mô tả |
|---|---|
| `ALCHEMY_API_KEY` | API Key từ [Alchemy](https://alchemy.com/) |
| `PRIVATE_KEY` | Private key ví deployer (có 0x prefix) |
| `ETHERSCAN_API_KEY` | API Key để verify contract trên Etherscan |

### Frontend (`frontend/.env.local`)

| Biến | Mô tả |
|---|---|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Địa chỉ smart contract đã deploy |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID mạng Ethereum (Sepolia: `11155111`) |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Alchemy API Key để đọc blockchain |
| `PINATA_API_KEY` | API Key từ [Pinata](https://pinata.cloud/) |
| `PINATA_SECRET_KEY` | Secret Key từ Pinata |
| `PINATA_JWT` | JWT token từ Pinata |
| `NEXT_PUBLIC_PINATA_GATEWAY` | URL gateway IPFS |

> ⚠️ **Lưu ý**: Không commit file `.env` và `.env.local` lên Git. Chỉ commit `.env.example`.

---

## 🧪 Testing

```bash
cd contracts
npx hardhat test
```

**45 test cases** bao gồm:
- ✅ Deployment & cấu hình
- ✅ Tạo yêu cầu (đơn lẻ & hàng loạt)
- ✅ Xác nhận & thanh toán (confirmAndMint)
- ✅ Từ chối có lý do (rejectRequest)
- ✅ Hủy yêu cầu (cancelRequest)
- ✅ Xử lý hết hạn (cleanExpired)
- ✅ View functions (getPendingRequests, getStats)
- ✅ Soulbound enforcement (chặn transfer)
- ✅ Thu hồi bằng (revoke)
- ✅ Quản lý treasury

---

## 👤 Tác giả

**Văn Đức Công Minh**

Đồ án Ứng dụng Blockchain trong Xác minh Văn bằng — 2026

---

## 📄 License

MIT License
