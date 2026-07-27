# 👗 WhatsApp AI Agent Backend Server (For Tailor / Fundi Cherehani)

A production-ready WhatsApp Automation server using `@whiskeysockets/baileys` (Unofficial WhatsApp Web API). 

## ⚡ Features
- **Zero API Costs**: Connects directly to your standard business phone number via WhatsApp Web QR code.
- **Anti-Ban Protections**: Includes randomized human typing delays (2-4 seconds) and rate limiting.
- **Tailor State Machine**: Multi-step order intake, self-measurement guide, price estimations, payment receipt checks, and order status tracking in Swahili/English.
- **Human Escalation**: Automatic escalation ("Hamishia kwa Fundi") for complex complaints or price negotiations.

## 🚀 Quick Setup & Run

1. Open your terminal in the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Scan the **QR Code** displayed in the terminal using your WhatsApp app (`Linked Devices` ➔ `Link a Device`).

5. Once connected, any customer messaging your WhatsApp will receive automated responses from **Amina Assistant**!

## ⚠️ Anti-Ban Recommendations (Section 10)
- Do NOT use this server for sending unprompted bulk spam to strangers.
- Keep responses reactive (replying to incoming customer inquiries).
- Always keep the delay settings active (built-in 2-4 seconds delay).
