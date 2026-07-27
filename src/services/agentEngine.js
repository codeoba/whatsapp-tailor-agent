// WhatsApp AI Agent State & Response Engine for Tailors (Fundi Cherehani)

export class TailorAgentEngine {
  constructor(businessConfig = {}) {
    this.config = businessConfig;
    this.sessions = new Map(); // Store state per phone/session
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Check if current time is outside business hours
  isOutsideBusinessHours() {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday
    const hours = now.getHours();
    
    // Sunday is off day
    if (day === 0) return true;
    // Working hours: 8:00 AM (8) to 6:00 PM (18)
    if (hours < 8 || hours >= 18) return true;
    return false;
  }

  // Get or initialize session state
  getSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        step: "IDLE",
        orderDraft: {
          garment_type: "",
          occasion: "",
          design_notes: "",
          fabric: "self-provided",
          color: "",
          measurements: { bust: "", waist: "", hip: "", shoulder: "", sleeve_length: "", garment_length: "" },
          deadline: "",
          estimated_price: "",
          deposit_paid: "0 TZS",
          balance_due: "",
          delivery_method: "pickup",
          delivery_address: "Studio",
          status: "received"
        },
        language: "sw" // default Swahili
      });
    }
    return this.sessions.get(sessionId);
  }

  resetSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  // Process incoming user text message
  processMessage(sessionId, textMessage, existingOrders = []) {
    const session = this.getSession(sessionId);
    const text = textMessage.trim();
    const lowerText = text.toLowerCase();

    // Check for English language detection
    if (/\b(hello|hi|good morning|order|gown|suit|measurement|price|cost|catalogue|tracking)\b/i.test(lowerText) && session.language !== 'en') {
      session.language = 'en';
    } else if (/\b(habari|mambo|shikamoo|karibu|oda|nguo|vipimo|bei|catalogue|fuatilia)\b/i.test(lowerText)) {
      session.language = 'sw';
    }

    // 1. Sensitive Escalation Keywords Check
    const escalationKeywords = ["pesa zangu", "urudishe pesa", "mzozo", "kesi", "sheria", "polisi", "tumeonana mbaya", "bovu sana", "haiingii", "refund", "sue", "lawyer", "scam"];
    if (escalationKeywords.some(kw => lowerText.includes(kw))) {
      return this.handleEscalation(session, "sensitive_complaint");
    }

    // 2. Direct reset or restart keywords
    if (lowerText === "menu" || lowerText === "anaza" || lowerText === "restart" || lowerText === "hi" || lowerText === "habari") {
      session.step = "IDLE";
    }

    // Main State Routing
    switch (session.step) {
      case "IDLE":
        return this.handleGreeting(session, textMessage);

      case "ORDER_GARMENT_TYPE":
        session.orderDraft.garment_type = text;
        session.step = "ORDER_OCCASION";
        return session.language === 'en' 
          ? `Great! What is the occasion/event for this ${text}? (e.g. Wedding, Office, Kitchen Party, Casual wear, Religious event)`
          : `Vizuri sana! Je, hii ${text} ni kwa ajili ya tukio/occasion gani? (Mfano: Harusi, Kitchen Party, Ofisi, Kawaida, Ibada, n.k.)`;

      case "ORDER_OCCASION":
        session.orderDraft.occasion = text;
        session.step = "ORDER_FABRIC";
        return session.language === 'en'
          ? `Understood! Regarding the fabric:\n1️⃣ I already have my fabric\n2️⃣ I need advice / purchasing fabric from the studio\n\nPlease type 1 or 2.`
          : `Nimeelewa! Kuhusu kitambaa:\n1️⃣ Nina kitambaa changu tayari\n2️⃣ Nahitaji ushauri / mnipatie kitambaa kutoka studio\n\nTafadhali andika namba 1 au 2.`;

      case "ORDER_FABRIC":
        if (text === "1" || lowerText.includes("nina") || lowerText.includes("changu")) {
          session.orderDraft.fabric = "Ana kitambaa chake mwenyewe";
        } else {
          session.orderDraft.fabric = "Anahitaji ushauri & kununuliwa kitambaa studio";
        }
        session.step = "ORDER_DESIGN";
        return session.language === 'en'
          ? `Please describe the design/style you want, or mention if you have a reference picture! 🎨 (You can also mention your favorite colors)`
          : `Tafadhali nieleze mfano wa mtindo/design unaoutaka, au sema kama una picha ya mfano! 🎨 (Pamoja na rangi unazopendelea)`;

      case "ORDER_DESIGN":
        session.orderDraft.design_notes = text;
        session.step = "ORDER_MEASUREMENT_METHOD";
        return session.language === 'en'
          ? `Perfect! For accurate fitting measurements:\n📍 Option 1: Visit studio for direct measurement\n📞 Option 2: Live Video Call with tailor\n📏 Option 3: Self-measurement at home guide\n\nWhich option do you prefer? (Type 1, 2, or 3)`
          : `Safi sana! Kwa vipimo sahihi vya nguo yako:\n📍 1: Kuja studio kupimwa moja kwa moja\n📞 2: Video Call na fundi akuelekeze kupima\n📏 3: Kutumia mwongozo wa kujipima nyumbani\n\nUngependa njia ipi? (Andika 1, 2, au 3)`;

      case "ORDER_MEASUREMENT_METHOD":
        if (text.includes("1") || lowerText.includes("studio")) {
          session.orderDraft.measurements_type = "Studio Visit";
          session.step = "ORDER_DEADLINE";
          return session.language === 'en'
            ? `Noted! Studio visit booked. When would you like the garment to be ready? (e.g. 10th August)`
            : `Hiyo ni nzuri! Karibu studio Saa 8:00 AM - 6:00 PM. Je, unahitaji nguo iwe tayari tarehe gani? (Mfano: Tarehe 10 Agosti)`;
        } else if (text.includes("2") || lowerText.includes("video")) {
          session.orderDraft.measurements_type = "Video Call";
          session.step = "ORDER_DEADLINE";
          return session.language === 'en'
            ? `Noted! We will schedule a measurement video call. When do you need this garment ready?`
            : `Safi! Tutafanya video call na fundi. Je, unahitaji nguo hii iwe tayari tarehe gani?`;
        } else {
          session.step = "ORDER_HOME_MEASUREMENTS";
          return session.language === 'en'
            ? `📏 *Home Measurement Guide (in cm)*:\nPlease send us these measurements:\n1. Bust (Kifua)\n2. Waist (Kiuno)\n3. Hips (Nyonga)\n4. Sleeve Length (Mkono)\n5. Shoulder (Bega)\n6. Dress Length (Urefu)\n\ne.g.: Bust 90, Waist 72, Hip 100, Sleeve 55, Length 140`
            : `📏 *Mwongozo wa Kujipima Nyumbani (kwa Sentimita)*:\nTafadhali tutumie vipimo vyako hivi:\n1. Kifua (Bust)\n2. Kiuno (Waist)\n3. Nyonga (Hips)\n4. Upana wa Bega (Shoulder)\n5. Urefu wa Mkono (Sleeve)\n6. Urefu wa Nguo (Dress Length)\n\nMfano: Kifua 90, Kiuno 72, Nyonga 100, Bega 40, Mkono 55, Urefu 140`;
        }

      case "ORDER_HOME_MEASUREMENTS":
        session.orderDraft.measurements_raw = text;
        session.orderDraft.measurements = this.parseMeasurements(text);
        session.step = "ORDER_DEADLINE";
        return session.language === 'en'
          ? `Measurements received! ✅ What is your target deadline date to receive the completed outfit?`
          : `Vipimo vimepokelewa kikamilifu! ✅ Je, ni tarehe gani unahitaji nguo yako iwe tayari kabisa?`;

      case "ORDER_DEADLINE":
        session.orderDraft.deadline = text;
        session.step = "ORDER_DELIVERY";
        return session.language === 'en'
          ? `Got it! How would you like to receive your completed order?\n1️⃣ Studio Pickup (Kinondoni)\n2️⃣ Local Delivery (Bodaboda/Sendy)\n3️⃣ Courier/Bus (Outside Dar)\n\nPlease reply with 1, 2 or 3 and your location.`
          : `Safi! Ungependa kupokea nguo yako iliyokamilika kwa njia gani?\n1️⃣ Kuchukua Studio (Kinondoni)\n2️⃣ Delivery ya Bodaboda / Sendy (Ndani ya Dar)\n3️⃣ Basi / Courier (Nje ya Dar)\n\nTafadhali andika namba pamoja na eneo/anwani yako.`;

      case "ORDER_DELIVERY":
        session.orderDraft.delivery_info = text;
        if (text.includes("1") || lowerText.includes("studio") || lowerText.includes("pickup")) {
          session.orderDraft.delivery_method = "pickup";
          session.orderDraft.delivery_address = "Studio Kinondoni";
        } else {
          session.orderDraft.delivery_method = "delivery";
          session.orderDraft.delivery_address = text;
        }

        // Calculate estimate
        const estimatedVal = this.calculateEstimate(session.orderDraft.garment_type);
        session.orderDraft.estimated_price = `${estimatedVal.toLocaleString()} TZS`;
        session.orderDraft.deposit_req = `${(estimatedVal * 0.5).toLocaleString()} TZS`;
        session.orderDraft.balance_due = `${(estimatedVal * 0.5).toLocaleString()} TZS`;

        session.step = "ORDER_CONFIRMATION";
        return this.formatQuotationAndSummary(session);

      case "ORDER_CONFIRMATION":
        if (lowerText.includes("ndiyo") || lowerText.includes("yes") || text === "1") {
          session.step = "ORDER_PAYMENT";
          const newOrderId = `ZF2026-${Math.floor(100 + Math.random() * 900)}`;
          session.orderDraft.order_id = newOrderId;
          return this.formatPaymentInstructions(session);
        } else {
          session.step = "IDLE";
          return session.language === 'en'
            ? `No problem! Your order draft is saved. Feel free to contact us whenever you are ready! 👗`
            : `Bila shaka! Oda yako imehifadhiwa. Karibu ukichagua kuendelea wakati wowote! 👗`;
        }

      case "ORDER_PAYMENT":
        session.step = "COMPLETED";
        return session.language === 'en'
          ? `Thank you for sending the payment confirmation! 📜\nYour order ID is *#${session.orderDraft.order_id}*.\nOur team is verifying the deposit. You can track progress anytime by replying *5*!`
          : `Asante sana kwa kutuma uthibitisho wa malipo! 📜\nNamba ya Oda yako ni *#${session.orderDraft.order_id}*.\nFundi wetu anathibitisha malipo. Unaweza kufuatilia hatua za kazi wakati wowote kwa kuandika *5*!`;

      case "TRACKING_INPUT":
        return this.handleOrderTracking(session, text, existingOrders);

      default:
        return this.handleGreeting(session, textMessage);
    }
  }

  // Handle Initial Greeting and Menu Options 1-6
  handleGreeting(session, text) {
    const b = this.config;
    const lower = text.toLowerCase();

    // Check menu option numbers
    if (text === "1" || lower.includes("shonewa nguo") || lower.includes("new order")) {
      session.step = "ORDER_GARMENT_TYPE";
      return session.language === 'en'
        ? `Awesome! Let's take your new order. 👗\nWhat type of garment would you like to make? (e.g. Evening gown, Wedding dress, Office suit, Skirt & Top, Kitenge design, Abaya)`
        : `Hongera! Karibu tuweke oda yako mpya ya ushonaji. 👗\nJe, unataka kushonewa aina gani ya nguo? (Mfano: Gauni la jioni, Mavazi ya harusi, Suti ya kiofisi, Sketi na Blauzi, Kitenge design, Buibui)`;
    }

    if (text === "2" || lower.includes("marekebisho") || lower.includes("alteration")) {
      session.step = "ORDER_GARMENT_TYPE";
      session.orderDraft.garment_type = "Marekebisho (Alteration)";
      return session.language === 'en'
        ? `What type of alteration do you need? (e.g., Resizing waist, shortening dress, zipper replacement, narrowing sleeves)`
        : `Unahitaji marekebisho gani kwenye nguo yako? (Mfano: Kupunguza/kuongeza kiuno, kufupisha urefu, kubadilisha zip, kurekebisha mabega)`;
    }

    if (text === "3" || lower.includes("bei") || lower.includes("price") || lower.includes("quotation")) {
      return this.formatPriceList(session);
    }

    if (text === "4" || lower.includes("catalogue") || lower.includes("mifano") || lower.includes("portfolio")) {
      return this.formatCatalogueResponse(session);
    }

    if (text === "5" || lower.includes("fuatilia") || lower.includes("track")) {
      session.step = "TRACKING_INPUT";
      return session.language === 'en'
        ? `Please enter your Order ID number (e.g. #ZF2026-014) to view your work progress:`
        : `Tafadhali ingiza Namba ya Oda yako (Mfano: #ZF2026-014) ili nikupe hatua iliyofikia:`;
    }

    if (text === "6" || lower.includes("fundi") || lower.includes("talk to tailor")) {
      return this.handleEscalation(session, "customer_requested");
    }

    // Default Main Greeting Menu
    return session.language === 'en'
      ? `Karibu sana kwa *${b.business_name || "Zawadi Fashion House"}*! 👗✂️\nI am *${b.bot_name || "Amina Assistant"}*, your digital assistant.\n\nHow may I help you today?\n1️⃣ I want a new custom outfit\n2️⃣ I need garment alterations\n3️⃣ Price estimate & Quotation\n4️⃣ View design catalogue & portfolio\n5️⃣ Track my existing order status\n6️⃣ Speak directly with the tailor\n\nReply with a number (1-6) or tell me in your own words!`
      : `Karibu sana kwa *${b.business_name || "Zawadi Fashion House"}*! 👗✂️\nMimi ni *${b.bot_name || "Amina Assistant"}*, msaidizi wako wa kidijitali.\n\nNingependa kukusaidiaje leo?\n1️⃣ Nataka kushonewa nguo mpya\n2️⃣ Nataka marekebisho ya nguo\n3️⃣ Naomba bei/makadirio\n4️⃣ Nataka kuona mifano ya kazi (catalogue)\n5️⃣ Nafuatilia oda yangu\n6️⃣ Naomba kuzungumza na fundi moja kwa moja\n\nAndika namba (1-6) au niambie unahitaji nini kwa maneno yako mwenyewe.`;
  }

  // Calculate Price Estimates
  calculateEstimate(garmentType = "") {
    const g = garmentType.toLowerCase();
    if (g.includes("harusi") || g.includes("wedding")) return 280000;
    if (g.includes("suti") || g.includes("suit")) return 110000;
    if (g.includes("kitenge") || g.includes("batiki")) return 55000;
    if (g.includes("buibui") || g.includes("abaya")) return 75000;
    if (g.includes("marekebisho") || g.includes("alteration")) return 15000;
    return 45000;
  }

  // Format Quotation & Summary
  formatQuotationAndSummary(session) {
    const o = session.orderDraft;
    const b = this.config;

    return ` Asanteni kwa maelezo mazuri! Kwa *${o.garment_type}* (${o.occasion || "kawaida"}), makadirio ya gharama ni:
- Ushonaji: *${o.estimated_price}*
- Advance ya kuanzia (50%): *${o.deposit_req}*
- Salio la kumalizia: *${o.balance_due}*

⚠️ *Kumbuka*: Bei hii ni makadirio ya awali. Bei ya mwisho itathibitishwa na fundi wetu *${b.owner_name}* baada ya kuona picha kamili na kitambaa.

📋 *Uthibitisho wa Taarifa za Oda*:
👗 Aina: ${o.garment_type}
🎨 Mtindo/Occasion: ${o.occasion} (${o.design_notes})
📏 Vipimo: ${o.measurements_raw || "Vimepokelewa Studio"}
📅 Tarehe ya Kukamilisha: ${o.deadline}
📍 Delivery: ${o.delivery_address}

Je, unathibitisha kuendelea na oda hii?
1️⃣ Ndiyo, niko tayari kulipa advance
2️⃣ Hapana, nitafanya baadaye`;
  }

  // Format Payment Instructions
  formatPaymentInstructions(session) {
    const b = this.config;
    const o = session.orderDraft;

    return `Vizuri sana! Oda yako Namba *#${o.order_id}* imetengenezwa. 📝

Ili kuanza ushonaji, tafadhali lipa advance ya *${o.deposit_req}* kupitia njia hizi:

📱 *M-Pesa Lipa Namba*: ${b.payments.mpesa_lipa}
📱 *Tigo Pesa*: ${b.payments.tigo_pesa}
🏦 *Benki*: ${b.payments.bank}

Baada ya kulipa, tafadhali tuma *Screenshot au Ujumbe wa Muamala (Receipt)* hapa ili tuthibitishe na kuanza kukata kitambaa mara moja! ✂️`;
  }

  // Format Price List
  formatPriceList(session) {
    return `💵 *Orodha ya Makadirio ya Bei za Ushonaji*:

👗 *Gauni za Kawaida / Kitenge*: TZS 40,000 – 60,000
👑 *Gauni za Harusi & Party*: TZS 200,000 – 400,000
👔 *Suti za Kiofisi (Koti & Sketi/Suruali)*: TZS 90,000 – 140,000
👚 *Blauzi / Sketi Moja Moja*: TZS 25,000 – 40,000
🧕 *Buibui & Abaya*: TZS 60,000 – 90,000
✂️ *Marekebisho (Zip, Kiuno, Urefu)*: TZS 10,000 – 25,000

*Muda wa Kazi*: siku 3–14.
Je, ungependa kuweka oda ya vazi gani leo? (Andika *1* kuanza oda)`;
  }

  // Format Catalogue Response
  formatCatalogueResponse(session) {
    return `📸 *Catalogue & Portfolio ya Zawadi Fashion House*:

Tazama baadhi ya kazi zetu zilizopita:
1️⃣ *Gauni la Harusi & Reception* (TZS 350,000)
2️⃣ *Suti ya Kiofisi Professional* (TZS 120,000)
3️⃣ *Gauni la Kitenge Modern Design* (TZS 65,000)
4️⃣ *Buibui & Abaya la Nidha* (TZS 85,000)

Pia unaweza kututumia picha yoyote ya mtindo unaoutaka kutoka Instagram/Pinterest na tutakushonhea vizuri zaidi! 

Unapendelea mtindo gani? (Andika *1* kuweka oda)`;
  }

  // Order Tracking
  handleOrderTracking(session, orderIdInput, existingOrders = []) {
    session.step = "IDLE";
    const cleanedId = orderIdInput.trim().toUpperCase().replace('#', '');
    const foundOrder = existingOrders.find(o => o.order_id.replace('#', '').toUpperCase() === cleanedId);

    if (foundOrder) {
      const statusMap = {
        received: "✅ Imepokelewa na kuthibitishwa",
        cutting: "✂️ Inakatwa kitambaa (Cutting stage)",
        sewing: "🧵 Inashonwa kwa umakini (Sewing in progress)",
        finishing: "🎀 Inamaliziwa & Kupigwa Pasi (Finishing stage)",
        ready: "📦 Tayari kabisa kuchukuliwa / kutumwa!",
        delivered: "🚚 Imeshakabidhiwa kwa mteja"
      };

      return `📍 *Taarifa za Oda #${foundOrder.order_id}*:
Mteja: *${foundOrder.customer_name}*
Nguo: *${foundOrder.garment_type}*
Hatua ya Sasa: *${statusMap[foundOrder.status] || foundOrder.status}*
Tarehe ya Kukamilika: *${foundOrder.deadline}*
Salio Lililobaki: *${foundOrder.balance_due}*

Asante kwa kuendelea kufuatilia na *${this.config.business_name}*! 🙏`;
    } else {
      return `❌ Samahani, hatukuweza kupata Oda Namba *${orderIdInput}*. 
Tafadhali hakikisha namba yako au zungumza na fundi moja kwa moja kwa kuandika *6*.`;
    }
  }

  // Parse Home Measurements
  parseMeasurements(rawText) {
    return {
      bust: rawText.match(/kifua|bust|\b(\d+)\b/i)?.[1] || "90",
      waist: rawText.match(/kiuno|waist|\b(\d+)\b/i)?.[1] || "72",
      hip: rawText.match(/nyonga|hip|\b(\d+)\b/i)?.[1] || "100",
      shoulder: rawText.match(/bega|shoulder|\b(\d+)\b/i)?.[1] || "40",
      sleeve_length: rawText.match(/mkono|sleeve|\b(\d+)\b/i)?.[1] || "55",
      garment_length: rawText.match(/urefu|length|\b(\d+)\b/i)?.[1] || "140"
    };
  }

  // Handle Escalation to Human Tailor
  handleEscalation(session, reason) {
    session.step = "ESCALATED";
    const b = this.config;
    return ` Hili ni jambo ambalo fundi wetu *${b.owner_name}* anahitaji kulishughulikia moja kwa moja. Namtaarifu sasa hivi kupitia WhatsApp na atakujibu hivi karibuni. 

Simu ya Dharura: *${b.phone}*
Asante sana kwa uvumilivu wako! 🙏`;
  }
}
