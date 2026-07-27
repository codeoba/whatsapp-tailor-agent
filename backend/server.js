// WhatsApp Baileys Automation Server with Web QR Page for aaPanel VPS Deployment
const express = require('express');
const cors = require('cors');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const NodeTailorBotEngine = require('./botEngine');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const bot = new NodeTailorBotEngine();

let waSock = null;
let connectionStatus = 'DISCONNECTED';
let latestQRCodeData = null; // Store latest QR code string

async function connectToWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');

    waSock = makeWASocket({
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: true,
      browser: ["Zawadi Fashion Agent", "aaPanel Server", "1.0.0"],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 25000,
    });

    waSock.ev.on('creds.update', saveCreds);

    waSock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        latestQRCodeData = qr;
        console.log('\n======================================================');
        console.log('📱 NEW QR CODE GENERATED FOR SCANNING:');
        console.log('======================================================\n');
        qrcodeTerminal.generate(qr, { small: true });
      }

      if (connection === 'close') {
        connectionStatus = 'DISCONNECTED';
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = (statusCode !== DisconnectReason.loggedOut);
        console.log(`❌ Connection closed (Code: ${statusCode}), reconnecting in 5s: `, shouldReconnect);
        if (shouldReconnect) {
          setTimeout(connectToWhatsApp, 5000);
        }
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

        // Process message through Tailor AI Agent engine
        const botResponse = bot.processMessage(senderJid, textMessage);

        // Anti-Ban Safeguard: Human typing delay (2-4 seconds)
        const randomDelay = Math.floor(Math.random() * 2000) + 2000;
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        await waSock.sendMessage(senderJid, { text: botResponse });
        console.log(`📤 Replied to ${senderJid}: "${botResponse.slice(0, 40)}..."`);
      } catch (err) {
        console.error('Error processing message:', err);
      }
    });
  } catch (e) {
    console.error('Error in connectToWhatsApp:', e);
    setTimeout(connectToWhatsApp, 5000);
  }
}

// REST API & WEB QR ROUTE
app.get('/qr', async (req, res) => {
  if (connectionStatus === 'CONNECTED') {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>WhatsApp Status</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="background:#0f172a; color:#fff; font-family:sans-serif; text-align:center; padding:50px 20px;">
          <h1 style="color:#10b981;">✅ WhatsApp Agent is Already CONNECTED!</h1>
          <p style="color:#94a3b8;">Bot is actively listening to messages for <strong>${bot.config.business_name}</strong>.</p>
        </body>
      </html>
    `);
  }

  if (!latestQRCodeData) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>WhatsApp Status</title>
          <meta http-equiv="refresh" content="3">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="background:#0f172a; color:#fff; font-family:sans-serif; text-align:center; padding:60px 20px;">
          <h2 style="color:#f59e0b; font-size:24px;">⏳ Generating QR Code...</h2>
          <p style="color:#94a3b8; font-size:15px; margin-top:10px;">Refreshing automatically in 3 seconds...</p>
          <div style="margin-top:30px; font-size:12px; color:#64748b;">
            (Or view terminal log: <code style="color:#38bdf8;">cat /www/wwwroot/whatsapp-tailor-agent/backend/bot.log</code>)
          </div>
        </body>
      </html>
    `);
  }

  try {
    const qrImage = await QRCode.toDataURL(latestQRCodeData);
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Scan WhatsApp QR Code</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="refresh" content="12">
        </head>
        <body style="background:#0b141a; color:#fff; font-family:sans-serif; text-align:center; padding:30px 15px;">
          <h2 style="color:#10b981; margin-bottom:5px;">📱 Scan to Connect WhatsApp Agent</h2>
          <p style="color:#94a3b8; font-size:14px;">Open WhatsApp ➔ Linked Devices ➔ Link a Device</p>
          <div style="background:#fff; padding:20px; display:inline-block; border-radius:20px; margin:20px 0; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <img src="${qrImage}" style="width:260px; height:260px; display:block;" />
          </div>
          <p style="color:#64748b; font-size:12px;">This page auto-refreshes every 12 seconds.</p>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error generating QR code image');
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    status: connectionStatus,
    business: bot.config.business_name,
    bot_name: bot.config.bot_name,
    has_qr: !!latestQRCodeData
  });
});

app.post('/api/send-message', async (req, res) => {
  const { phone, message } = req.body;
  if (!waSock || connectionStatus !== 'CONNECTED') {
    return res.status(400).json({ error: 'WhatsApp is not connected yet.' });
  }

  const jid = phone.includes('@s.whatsapp.net') ? phone : `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
  await waSock.sendMessage(jid, { text: message });
  res.json({ success: true, message: `Sent message to ${jid}` });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`👗 TAILOR WHATSAPP AGENT BACKEND SERVER STARTED!`);
  console.log(`🌐 Server running at http://localhost:${PORT}`);
  console.log(`📱 Web QR Scan page: http://localhost:${PORT}/qr`);
  console.log(`======================================================\n`);
  connectToWhatsApp();
});
