# 🚀 ProofLink

### _ISO 20022 Compliant Payment Verification on Flare Network_

**ProofLink** is a decentralized payment gateway and verification layer that bridges the gap between traditional financial messaging standards (**ISO 20022**) and blockchain transparency. Built on the **Flare Network**, it allows projects to receive contributions in multiple assets while providing cryptographically anchored proof of payment for every transaction.

---

## 📖 Table of Contents

- [Core Capabilities](https://www.google.com/search?q=%23-core-capabilities)
- [How It Works](https://www.google.com/search?q=%23-how-it-works)
- [Technical Stack](https://www.google.com/search?q=%23-technical-stack)
- [API & Integration](https://www.google.com/search?q=%23-api--integration)
- [Future Potentials](https://www.google.com/search?q=%23-future-potentials)
- [Getting Started](https://www.google.com/search?q=%23-getting-started)

---

## ✨ Core Capabilities

### 1. Multi-Token Support (Coston2 Testnet)

While **C2FLR** is the native gas and default payment token, ProofLink is architected to handle diverse assets:

- **Native Payments:** Direct C2FLR transfers.
- **Tokenized Assets:** Support for **USDT**, **FXRP**, and other ERC-20 tokens.
- **Decimals Handling:** Automated precision scaling (6 vs 18 decimals) ensures accounting accuracy across different asset types.

### 2. ISO 20022 Metadata Anchoring

Every payment is more than just a transfer; it's a financial message.

- **Structured Data:** Each transaction carries a `projectId`, `paymentId`, and `reference`.
- **Compliance Ready:** Data is formatted to be compatible with global banking standards, allowing for seamless exports to traditional accounting systems.

### 3. Developer First: API Key Management

- **Self-Service Portal:** Developers can connect their wallets to instantly check for or generate unique `X-API-KEY` credentials.
- **Verification Endpoint:** A dedicated GET endpoint allows external apps to verify if a user has paid for a specific service using a combination of `walletAddress` and `projectId`.

---

## 🛠 How It Works

1. **Selection:** User selects their preferred currency (e.g., FXRP) on the ProofLink-enabled project page.
2. **Execution:** The frontend handles the logic—Standard transfer for native FLR or `transfer()` for ERC-20 tokens.
3. **Anchoring:** ProofLink’s backend detects the transaction hash and generates a structured payment record.
4. **Verification:** Third-party platforms query the ProofLink API to grant access or services based on the `hasPaid` status.

---

## 💻 Technical Stack

- **Blockchain:** Flare Network (Coston2 Testnet).
- **Frontend:** Next.js 14, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (for payment indexing and API key storage).
- **Web3 Integration:** Ethers.js for wallet interaction and smart contract calls.

---

## 📡 API & Integration

Developers can verify payments with a simple request:

```bash
curl -X GET "https://prooflink.onrender.com/api/v1/payments/verify?projectId=SOLAR-01&walletAddress=0x..." \
  -H "X-API-KEY: your_api_key_here"

```

**Response Example:**

```json
{
  "hasPaid": true,
  "payment": {
    "amount": 150.5,
    "asset": "FLR",
    "receiptId": "RCPT-992-ZZ",
    "proofHash": "0xaf...2b"
  }
}
```

---

## 🔮 Future Potentials

- **Flare Data Connector Integration:** Use state connectors to verify payments happening on other chains (like BTC or XRP) and anchor the proof on Flare.
- **Zk-Proofs for Privacy:** Implementing Zero-Knowledge proofs to allow users to prove they paid _enough_ for a project without revealing their total wallet balance.
- **Fiat On-Ramp Integration:** Allowing "Credit Card to FLR" payments that automatically trigger the ISO 20022 anchoring process.

---
