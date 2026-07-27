// WhatsApp Baileys Automation Server with Dynamic Web QR Engine
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const Baileys = require('@whiskeysockets/baileys');
const pino = require('pino');
const NodeTailorBotEngine = require('./botEngine');

// Handle CommonJS export variations for Baileys
const makeWASocket = Baileys.default || Baileys.makeWASocket || Baileys;
const useMultiFileAuthState = Baileys.useMultiFileAuthState;
const DisconnectReason = Baileys.DisconnectReason;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const bot = new NodeTailorBotEngine();

let waSock = null;
let connectionStatus = 'DISCONNECTED';
let latestQRCodeData = null;
let lastErrorLog = 'No errors logged yet';

const authFolder = path.join(__dirname, 'baileys_auth_info');

async function connectToWhatsApp() {
  try {
    console.log('🚀 Starting Baileys WhatsApp connection...');
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    waSock = makeWASocket({
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: true,
      browser: ["Zawadi Fashion Agent", "aaPanel Linux", "1.0.0"],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 15000,
      retryRequestDelayMs: 2000
    });

    waSock.ev.on('creds.update', saveCreds);

    waSock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        latestQRCodeData = qr;
        console.log('\n======================================================');
        console.log('📱 NEW WHATSAPP QR CODE READY FOR SCANNING!');
        console.log('======================================================\n');
        qrcodeTerminal.generate(qr, { small: true });
      }

      if (connection === 'close') {
        connectionStatus = 'DISCONNECTED';
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        console.log(`❌ WhatsApp socket closed (Code: ${statusCode})`);

        if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
          console.log('🧹 Clearing stale auth session folder...');
          latestQRCodeData = null;
          try {
            fs.rmSync(authFolder, { recursive: true, force: true });
          } catch (e) {}
        }

        console.log('🔄 Reconnecting in 3 seconds...');
        setTimeout(connectToWhatsApp, 3000);
      } else if (connection === 'open') {
        connectionStatus = 'CONNECTED';
        latestQRCodeData = null;
        console.log('✅ WHATSAPP AGENT IS LIVE & CONNECTED SUCCESSFULLY!');
      }
    });

    waSock.ev.on('messages.upsert', async (m) => {
      try {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const senderJid = msg.key.remoteJid;
        const textMessage = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (!textMessage) return;

        console.log(`📩 Message from ${senderJid}: "${textMessage}"`);

        const botResponse = bot.processMessage(senderJid, textMessage);

        const randomDelay = Math.floor(Math.random() * 2000) + 2000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        await waSock.sendMessage(senderJid, { text: botResponse });
        console.log(`📤 Replied to ${senderJid}: "${botResponse.slice(0, 40)}..."`);
      } catch (err) {
        console.error('Error processing message:', err);
      }
    });
  } catch (e) {
    lastErrorLog = e.stack || e.toString();
    console.error('CRITICAL ERROR in connectToWhatsApp:', e);
    setTimeout(connectToWhatsApp, 3000);
  }
}

// REST API Endpoints
app.get('/api/status', async (req, res) => {
  let qrImage = null;
  if (latestQRCodeData) {
    try {
      qrImage = await QRCode.toDataURL(latestQRCodeData);
    } catch (e) {}
  }

  res.json({
    status: connectionStatus,
    business: bot.config.business_name,
    bot_name: bot.config.bot_name,
    has_qr: !!latestQRCodeData,
    qr_image: qrImage,
    last_error: lastErrorLog
  });
});

// Debug endpoint to view server logs in browser
app.get('/api/log', (req, res) => {
  const logFile = path.join(__dirname, 'bot.log');
  if (fs.existsSync(logFile)) {
    const logs = fs.readFileSync(logFile, 'utf8');
    res.type('text/plain').send(logs.slice(-3000));
  } else {
    res.send('bot.log file not created yet or empty. Last error: ' + lastErrorLog);
  }
});

// Dynamic Auto-updating HTML Page for QR Scanning
app.get('/qr', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="sw">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Scan WhatsApp QR Code — Zawadi Fashion</title>
        <style>
          body { background: #0b141a; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 40px 15px; margin: 0; }
          .card { background: #111b21; max-width: 420px; margin: 0 auto; padding: 30px; border-radius: 24px; border: 1px solid #1e293b; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .qr-box { background: #fff; padding: 15px; border-radius: 16px; display: inline-block; margin: 20px 0; min-width: 240px; min-height: 240px; }
          .qr-box img { width: 240px; height: 240px; display: block; }
          .spinner { border: 4px solid #1e293b; border-top: 4px solid #10b981; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 80px auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .badge { background: #005c4b; color: #6ee7b7; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">👗 Zawadi Fashion Assistant</div>
          <h2 id="title" style="margin: 0; color: #10b981;">Inatafuta QR Code...</h2>
          <p id="desc" style="color: #94a3b8; font-size: 13px; margin-top: 8px;">Tafadhali subiri sekunde chache...</p>
          
          <div class="qr-box" id="qr-container">
            <div class="spinner"></div>
          </div>

          <div style="font-size: 11px; color: #64748b; margin-top: 15px;">
            WhatsApp ➔ Linked Devices ➔ Link a Device
          </div>
        </div>

        <script>
          async function checkStatus() {
            try {
              const res = await fetch('/api/status');
              const data = await res.json();
              
              const titleEl = document.getElementById('title');
              const descEl = document.getElementById('desc');
              const container = document.getElementById('qr-container');

              if (data.status === 'CONNECTED') {
                titleEl.innerText = '✅ WhatsApp Agent is CONNECTED!';
                titleEl.style.color = '#10b981';
                descEl.innerText = 'Bot ipo hewani tayari kujibu wateja!';
                container.innerHTML = '<div style="padding: 40px 10px; color: #005c4b; font-weight: bold;">CONNECTED ONLINE 🟢</div>';
              } else if (data.qr_image) {
                titleEl.innerText = '📱 Scan QR Code na WhatsApp Yako';
                titleEl.style.color = '#10b981';
                descEl.innerText = 'Fungua WhatsApp ➔ Linked Devices ➔ Link a Device';
                container.innerHTML = '<img src="' + data.qr_image + '" alt="QR Code" />';
              }
            } catch(e) {
              console.error(e);
            }
          }

          checkStatus();
          setInterval(checkStatus, 1500);
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`👗 TAILOR WHATSAPP AGENT BACKEND SERVER STARTED!`);
  console.log(`🌐 Server running at http://localhost:${PORT}`);
  console.log(`📱 Dynamic Web QR Page: http://localhost:${PORT}/qr`);
  console.log(`======================================================\n`);
  connectToWhatsApp();
});
