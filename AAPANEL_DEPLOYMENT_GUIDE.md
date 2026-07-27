# 🚀 Mwongozo Kamili wa Ku-deploy WhatsApp Agent kwenye aaPanel (aaPanel Deployment Guide)

Mwongozo huu utakuelekeza hatua kwa hatua jinsi ya kuweka na kuendesha **WhatsApp Agent kwa ajili ya Fundi Cherehani** kwenye VPS yako yenye **aaPanel**.

---

## 📋 Mahitaji ya Awali (Prerequisites)
1. VPS yenye aaPanel iliyowekwa (Ubuntu/Debian/CentOS).
2. Domain Name (Mfano: `zawadifashion.co.tz` au `agent.domain.com`) au IP ya Server.
3. App za aaPanel zilizowekwa:
   - **Nginx** (Web Server)
   - **PM2 Manager** au **Node.js Version Manager** (kutoka App Store ya aaPanel).

---

## 🛠️ HATUA YA 1: Kupakua & Kuweka Mafaili kwenye aaPanel

1. Ingia kwenye **aaPanel Control Panel**.
2. Nenda kwenye **Files** menu (kushoto).
3. Ingia kwenye njia hii: `/www/wwwroot/`
4. Tengeneza folder jipya linaloitwa: `whatsapp-tailor-agent`
5. Upload mafaili yote ya mradi huu kwenye folder hilo:
   - `/www/wwwroot/whatsapp-tailor-agent/package.json`
   - `/www/wwwroot/whatsapp-tailor-agent/src/`
   - `/www/wwwroot/whatsapp-tailor-agent/backend/`
   - n.k.

---

## 📦 HATUA YA 2: Kuweka Node.js & Dependencies

1. Kwenye aaPanel, fungua **App Store**.
2. Tafuta na u-install **PM2 Manager** au **Node.js Version Manager**.
3. Hakikisha umechagua **Node.js Version 18.x au 20.x (LTS)**.
4. Fungua **Terminal** kwenye aaPanel au SSH terminal ya VPS yako:

```bash
# 1. Ingia kwenye directory ya backend
cd /www/wwwroot/whatsapp-tailor-agent/backend

# 2. Weka dependencies za backend
npm install

# 3. Rudi kwenye folder la mbele kisha uweke dependencies za frontend
cd /www/wwwroot/whatsapp-tailor-agent
npm install

# 4. Tengeneza Production Build ya Dashboard (Frontend)
npm run build
```

---

## ⚙️ HATUA YA 3: Kuendesha Backend kwa PM2 Manager (aaPanel)

Ili WhatsApp Agent server (`server.js`) iendelee kufanya kazi 24/7 bila kukatika (hata ukifunga browser au ku-reboot server):

### Njia A: Kupitia aaPanel UI (PM2 Manager)
1. Fungua **PM2 Manager** kutoka App Store ya aaPanel.
2. Bofya **Add Project**.
3. **Startup File**: Chagua `/www/wwwroot/whatsapp-tailor-agent/backend/server.js`
4. **Project Name**: `whatsapp-tailor-backend`
5. **Run User**: `www` au `root`
6. Bofya **Submit**.

### Njia B: Kupitia Command Line (SSH / Terminal)
```bash
cd /www/wwwroot/whatsapp-tailor-agent/backend
npx pm2 start server.js --name "whatsapp-tailor-agent"
npx pm2 save
npx pm2 startup
```

---

## 📱 HATUA YA 4: Ku-scan QR Code ya WhatsApp (Web Scan)

Mara baada ya kuwasha PM2 server:
1. Fungua browser kwenye simu au kompyuta yako na uingize:
   ```text
   http://IP_YA_SERVER_YAKO:5000/qr
   ```
   *(Au `http://domain-yako.com:5000/qr`)*
2. Utaona ukurasa unaoonyesha **QR Code**.
3. Fungua **WhatsApp** kwenye simu ya biashara:
   - Nenda **Settings** ➔ **Linked Devices** ➔ **Link a Device**.
4. Scan ile QR Code kwenye skrini ya browser!
5. Ukurasa utajisafisha na kukuonyesha: `✅ WhatsApp Agent is Already CONNECTED!`.

---

## 🌐 HATUA YA 5: Kuset Nginx Site kwenye aaPanel (Frontend & Reverse Proxy)

1. Nenda kwenye aaPanel menu **Website** ➔ **Add site**.
2. Weka Domain Name yako (mfano `zawadifashion.co.tz` au tumia IP).
3. **Root Directory**: Chagua `/www/wwwroot/whatsapp-tailor-agent/dist`
4. **PHP Version**: Chagua `Pure static`.
5. Bofya **Submit**.

### Kuweka Reverse Proxy kwa ajili ya API Endpoint (`/api` & `/qr`):
1. Bofya **Config / Settings** ya site yako mpya kwenye aaPanel.
2. Nenda sehemu ya **Reverse Proxy** ➔ **Add reverse proxy**.
3. **Proxy Name**: `whatsapp-api`
4. **Target URL**: `http://127.0.0.1:5000`
5. **Sent Domain**: `$host`
6. **Passthrough Path**: `/api/`
7. Bofya **Save**.

Pia unaweza kuweka **SSL (HTTPS)** kwa kubofya tab ya **SSL** ➔ **Let's Encrypt** ➔ **Apply** ili kupata kufuli ya kijani ya usalama!

---

## 🛡️ HATUA YA 6: Kufungua Port Kwenye Firewall ya aaPanel

Kama hutumii Nginx Reverse Proxy na unataka kufikia port 5000 moja kwa moja:
1. Nenda kwenye aaPanel **Security** menu (kushoto).
2. Kwenye **Port**, weka `5000`.
3. Remark: `WhatsApp Backend Port`
4. Bofya **Accept/Add**.
*(Pia kama unatumia Cloud Providers kama AWS, DigitalOcean, Contabo au Hetzner, hakikisha umefungua Port 5000 kwenye Cloud Security Group).*

---

## 🎯 Jinsi ya Kujaribu (Testing):
Tuma ujumbe kutoka kwa namba nyingine yoyote kwenda kwa namba iliyosajiliwa (mfano: *"Habari, nataka kushonewa gauni"*). 

WhatsApp Agent (`Amina Assistant`) itajibu kiotomatiki kwa kufuata mtiririko kamili wa **Zawadi Fashion House**! 👗✨
