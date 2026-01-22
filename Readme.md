# 🚀 Quirklr

### _ISO 20022 Compliant Payment Verification on Flare Network_

**Quirklr** is a decentralized payment gateway and verification layer designed to bridge the gap between blockchain transparency and traditional financial messaging standards (**ISO 20022**). Built on the **Flare Network (Coston2)**, Quirklr enables builders to accept contributions and service payments while anchoring every transaction with cryptographically verifiable proof and automated protocol-level accounting.

---

## 📖 Table of Contents

- [User Personas](https://www.google.com/search?q=%23-user-personas)
- [Core Capabilities](https://www.google.com/search?q=%23-core-capabilities)
- [Technical Architecture](https://www.google.com/search?q=%23-technical-architecture)
- [How It Works](https://www.google.com/search?q=%23-how-it-works)
- [API & Integration](https://www.google.com/search?q=%23-api--integration)
- [Admin Governance](https://www.google.com/search?q=%23-admin-governance)
- [Future Potentials](https://www.google.com/search?q=%23-future-potentials)

---

## 👥 User Personas

### 1. Builders (Type 1: Fundraisers)

- **Workflow:** Connect wallet ➔ Create project ➔ Watch project grow ➔ Withdraw funds.
- **Goal:** Socially-driven crowdfunding with transparent on-chain accounting.

### 2. Builders (Type 2: Service Merchants)

- **Workflow:** Connect wallet ➔ Create one-time payment link ➔ Integrate into existing suite ➔ Track status via API.
- **Goal:** Seamlessly accepting crypto for digital services with automated verification.

### 3. Users (Contributors/Payers)

- **Workflow:** Explore projects ➔ Contribute/Pay ➔ View receipt ➔ Download ISO 20022 bundle (XML/Metadata).
- **Goal:** Securely support projects and receive professional financial documentation.

---

## ✨ Core Capabilities

### 1. Multi-Asset Treasury Management

The smart contract vault handles diverse assets on **Coston2** with automated precision:

- **Supported Tokens:** Native **C2FLR**, **USDT0**, and **FXRP**.
- **Precision Scaling:** Handles accounting for both 6-decimal (USDT/FXRP) and 18-decimal (C2FLR) tokens.
- **Fixed Protocol Fee:** A **1.5% protocol fee** is automatically calculated and separated from project obligations during the withdrawal phase.

### 2. ISO 20022 Metadata Anchoring

Through the **Proofrails API**, every payment is treated as a structured financial message:

- **Documentation:** Users can download a full XML bundle of their payment for traditional accounting audits.
- **Structured Identity:** Payments are tied to a `projectId`, `paymentId`, and `receiptId`.

---

## 🛠 How It Works

1. **Payment:** The user signs a transaction via **Wagmi**. For ERC-20s, the UI handles a 2-step process (Approve + Contribute).
2. **Indexing:** Upon transaction confirmation, the frontend triggers a sync to the MongoDB backend via the `/add_payment` endpoint.
3. **Verification:** Merchants use a unique `X-API-KEY` (stored as a hash in the DB) to verify payment status via the dedicated verification endpoint.
4. **Settlement:** Builders withdraw funds. The contract deducts the 1.5% fee, which is then made available in the Admin pool.

---

## 💻 Technical Stack

- **Blockchain:** Flare Network (Coston2 Testnet).
- **Smart Contracts:** Solidity (Vault & Fee Management).
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide Icons.
- **Web3 Hooks:** **Wagmi v2**, **Viem**, and **RainbowKit**.
- **Backend:** Node.js, Express, MongoDB.
- **Infrastructure:** Hosted on **Render** (Backend) and **Vercel** (Frontend).

---

## 📡 API & Integration

### Verify a Payment

Developers can verify payments by sending a `GET` request with their API key.

```bash
curl -X GET "https://quirklr.onrender.com/api/v1/payments/verify?projectId=YOUR_PROJECT_ID&walletAddress=0x..." \
  -H "X-API-KEY: your_uuid_api_key"

```

**Successful Response:**

```json
{
  "hasPaid": true,
  "payment": {
    "amount": 100.0,
    "currency": "USDT0",
    "receiptId": "RCPT-12345",
    "timestamp": "2026-01-21T..."
  }
}
```

---

## 🛡 Admin Governance

Access to the System Finance Dashboard is protected by a dual-layer security check:

1. **On-Chain Verification:** The wallet must be the `protocolAdmin` stored in the contract.
2. **Frontend Gate:** Requires a passkey defined in `NEXT_PUBLIC_ADMIN_PASSKEY`.

**Admin Capabilities:**

- Monitor total on-chain balances across all tokens.
- View accumulated protocol charges (1.5% fees).
- Execute withdrawal of protocol profits.

---

## 🔮 Future Potentials

- **State Connector Integration:** Verify payments on BTC or XRP chains and anchor proof on Flare.
- **Editable Fees:** Transition the 1.5% fee to a dynamic variable controlled by the admin.
- **Zk-Proofs:** Prove payment completion without revealing the user's full transaction history.

---
