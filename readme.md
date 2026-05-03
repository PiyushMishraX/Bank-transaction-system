# 🏦 Banking Application Backend

An advanced, production-level backend for a banking application that simulates how real banks process money transfers. It moves away from static balances, instead utilizing a highly secure, immutable ledger system to track the exact flow of money. Built with Node.js, Express.js, and MongoDB.

---

### 🕹️ Features
* **Immutable Ledger & Dynamic Balances:** Calculates exact balances dynamically in real-time using MongoDB Aggregation Pipelines, while Mongoose pre-hooks forcefully block any modifications to existing entries.
* **ACID Transactions & Idempotency:** Guarantees atomic transfers using MongoDB Sessions and uses client-generated Idempotency Keys to prevent double-deductions during network retries.
* **Secure Auth & Token Blacklisting:** Manages sessions securely with JWTs in HTTP-only cookies and implements secure logouts using a Blacklist collection with 3-day TTL auto-cleanup.
* **Automated Email Notifications:** Acts as an SMTP transporter via Nodemailer and Google's OAuth2/Gmail API to send real-time registration and transaction alerts.
* **System User Funding:** Features a highly-protected "System User" account to simulate ATM cash deposits and securely fund new standard accounts.
* **Modular Routing:** Cleanly organized Express routing for `/api/auth`, `/api/accounts`, and `/api/transactions`.

### 🚀 Quick Start
1. Clone or download the repository.
2. Run `npm install` to install dependencies.
3. Configure your `.env` file with necessary credentials (e.g., MongoDB URI, JWT Secret, Google API keys).
4. Run `npm start` (or `node server.js`) to launch the server.
5. Send a `GET` request to `/` to verify the "Ledger Service is up and running".

### 🔗 Live Demo
API base URL (Deployed on Render): **https://backend-ledger-akvy.onrender.com/**