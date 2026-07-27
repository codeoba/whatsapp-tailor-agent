// CommonJS Multi-Agent Architecture for Node.js Backend

class ReceptionistAgent {
  constructor(config) {
    this.name = config.bot_name || "Amina Assistant";
    this.role = "Pokea Mteja & Usajili wa Oda";
    this.avatar = "👗";
  }

  handle(session, text, lower) {
    if (text === "1" || lower.includes("shonewa nguo")) {
      session.activeAgent = "IntakeAgent";
      session.step = "ORDER_GARMENT_TYPE";
      return `Hongera! Mimi ni *${this.name}*. Karibu tuweke oda yako mpya ya ushonaji. 👗\nJe, unataka kushonewa aina gani ya nguo? (Mfano: Gauni la jioni, Mavazi ya harusi, Suti ya kiofisi, Sketi na Blauzi, Kitenge design, Buibui)`;
    }

    if (text === "2" || lower.includes("marekebisho")) {
      session.activeAgent = "IntakeAgent";
      session.step = "ORDER_GARMENT_TYPE";
      session.orderDraft.garment_type = "Marekebisho (Alteration)";
      return `Unahitaji marekebisho gani kwenye nguo yako? (Mfano: Kupunguza/kuongeza kiuno, kufupisha urefu, kubadilisha zip, kurekebisha mabega)`;
    }

    if (text === "3" || lower.includes("bei")) {
      session.activeAgent = "FinanceAgent";
      return session.orchestrator.getAgent("FinanceAgent").formatPriceList(session);
    }

    if (text === "4" || lower.includes("catalogue") || lower.includes("mifano")) {
      session.activeAgent = "StylistAgent";
      return session.orchestrator.getAgent("StylistAgent").showCatalogue(session);
    }

    if (text === "5" || lower.includes("fuatilia")) {
      session.activeAgent = "TrackingAgent";
      session.step = "TRACKING_INPUT";
      return `Tafadhali ingiza Namba ya Oda yako (Mfano: #ZF2026-014) ili nikupe hatua iliyofikia:`;
    }

    if (text === "6" || lower.includes("fundi")) {
      session.activeAgent = "HumanTailorHandoff";
      return session.orchestrator.getAgent("HumanTailorHandoff").escalate(session, "customer_requested");
    }

    return `Karibu sana kwa *${session.config.business_name}*! 👗✂️\nMimi ni *${this.name}*, msaidizi wako wa kidijitali.\n\nNingependa kukusaidiaje leo?\n1️⃣ Nataka kushonewa nguo mpya\n2️⃣ Nataka marekebisho ya nguo\n3️⃣ Naomba bei/makadirio\n4️⃣ Nataka kuona mifano ya kazi (catalogue)\n5️⃣ Nafuatilia oda yangu\n6️⃣ Naomba kuzungumza na fundi moja kwa moja\n\nAndika namba (1-6) au niambie unahitaji nini kwa maneno yako mwenyewe.`;
  }
}

class StylistAgent {
  constructor() {
    this.name = "Neema Stylist";
    this.role = "Mshauri wa Mitindo & Vitambaa";
    this.avatar = "✨";
  }

  showCatalogue(session) {
    return `📸 *Catalogue & Portfolio (Mshauri Neema Stylist)*:\n\nTazama baadhi ya kazi zetu zilizopita:\n1️⃣ *Gauni la Harusi & Reception* (TZS 350,000)\n2️⃣ *Suti ya Kiofisi Professional* (TZS 120,000)\n3️⃣ *Gauni la Kitenge Modern Design* (TZS 65,000)\n4️⃣ *Buibui & Abaya la Nidha* (TZS 85,000)\n\nPia unaweza kututumia picha yoyote ya mtindo unaoutaka kutoka Instagram/Pinterest na tutakushonhea vizuri zaidi! 🎨\n\nUnapendelea mtindo gani? (Andika *1* kuweka oda)`;
  }
}

class MeasurementAgent {
  constructor() {
    this.name = "Beti Measurements";
    this.role = "Mtaalamu wa Upimaji wa Nguo";
    this.avatar = "📏";
  }

  promptOptions(session) {
    return `Safi sana! Mimi ni *${this.name}*, mtaalamu wa vipimo. 📏\nKwa vipimo sahihi vya nguo yako:\n📍 1: Kuja studio kupimwa moja kwa moja\n📞 2: Video Call na fundi akuelekeze kupima\n📏 3: Kutumia mwongozo wa kujipima nyumbani (Sentimita)\n\nUngependa njia ipi? (Andika 1, 2, au 3)`;
  }

  parseHomeMeasurements(rawText) {
    return {
      bust: rawText.match(/kifua|bust|\b(\d+)\b/i)?.[1] || "90",
      waist: rawText.match(/kiuno|waist|\b(\d+)\b/i)?.[1] || "72",
      hip: rawText.match(/nyonga|hip|\b(\d+)\b/i)?.[1] || "100",
      shoulder: rawText.match(/bega|shoulder|\b(\d+)\b/i)?.[1] || "40",
      sleeve_length: rawText.match(/mkono|sleeve|\b(\d+)\b/i)?.[1] || "55",
      garment_length: rawText.match(/urefu|length|\b(\d+)\b/i)?.[1] || "140"
    };
  }
}

class FinanceAgent {
  constructor() {
    this.name = "Baraka Payments";
    this.role = "Mhasibu & Uthibitisho wa Malipo";
    this.avatar = "💳";
  }

  formatPriceList(session) {
    return `💵 *Orodha ya Makadirio ya Bei za Ushonaji (Baraka Payments)*:\n\n👗 *Gauni za Kawaida / Kitenge*: TZS 40,000 – 60,000\n👑 *Gauni za Harusi & Party*: TZS 200,000 – 400,000\n👔 *Suti za Kiofisi (Koti & Sketi/Suruali)*: TZS 90,000 – 140,000\n👚 *Blauzi / Sketi Moja Moja*: TZS 25,000 – 40,000\n🧕 *Buibui & Abaya*: TZS 60,000 – 90,000\n✂️ *Marekebisho (Zip, Kiuno, Urefu)*: TZS 10,000 – 25,000\n\n*Muda wa Kazi*: siku 3–14.\nJe, ungependa kuweka oda ya vazi gani leo? (Andika *1* kuanza oda)`;
  }

  formatPaymentInstructions(session) {
    const b = session.config;
    const o = session.orderDraft;
    return `Vizuri sana! Mimi ni *${this.name}*. Oda yako Namba *#${o.order_id}* imetengenezwa. 📝\n\nIli kuanza ushonaji, tafadhali lipa advance ya *${o.deposit_req}* kupitia njia hizi:\n\n📱 *M-Pesa Lipa Namba*: ${b.payments?.mpesa_lipa}\n📱 *Tigo Pesa*: ${b.payments?.tigo_pesa}\n🏦 *Benki*: ${b.payments?.bank}\n\nBaada ya kulipa, tafadhali tuma *Screenshot au Ujumbe wa Muamala (Receipt)* hapa ili tuthibitishe na kuanza kukata kitambaa mara moja! ✂️`;
  }
}

class TrackingAgent {
  constructor() {
    this.name = "Furaha Tracking";
    this.role = "Mtaalamu wa Ufuatiliaji wa Oda";
    this.avatar = "📦";
  }

  handleTracking(session, text, existingOrders = []) {
    const cleanedId = text.trim().toUpperCase().replace('#', '');
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

      return `📍 *Taarifa za Oda #${foundOrder.order_id} (Furaha Tracking)*:\nMteja: *${foundOrder.customer_name}*\nNguo: *${foundOrder.garment_type}*\nHatua ya Sasa: *${statusMap[foundOrder.status] || foundOrder.status}*\nTarehe ya Kukamilika: *${foundOrder.deadline}*\nSalio Lililobaki: *${foundOrder.balance_due}*\n\nAsante kwa kuendelea kufuatilia na *${session.config.business_name}*! 🙏`;
    } else {
      return `❌ Samahani, hatukuweza kupata Oda Namba *${text}*. Tafadhali hakikisha namba yako au zungumza na fundi moja kwa moja kwa kuandika *6*.`;
    }
  }
}

class HumanTailorHandoff {
  constructor() {
    this.name = "Fundi Zawadi (Human Tailor)";
    this.role = "Mmiliki & Fundi Mkuu (Human Escalation)";
    this.avatar = "✂️";
  }

  escalate(session, reason) {
    session.step = "ESCALATED";
    session.activeAgent = "HumanTailorHandoff";
    const b = session.config;
    return ` Hili ni jambo ambalo fundi wetu *${b.owner_name}* anahitaji kulishughulikia moja kwa moja. Namtaarifu sasa hivi kupitia WhatsApp na atakujibu hivi karibuni.\n\nSimu ya Dharura: *${b.phone}*\nAsante sana kwa uvumilivu wako! 🙏`;
  }
}

class NodeMultiAgentOrchestrator {
  constructor(businessConfig = {}) {
    this.config = businessConfig;
    this.agents = {
      Receptionist: new ReceptionistAgent(businessConfig),
      StylistAgent: new StylistAgent(),
      MeasurementAgent: new MeasurementAgent(),
      FinanceAgent: new FinanceAgent(),
      TrackingAgent: new TrackingAgent(),
      HumanTailorHandoff: new HumanTailorHandoff()
    };
    this.sessions = new Map();
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.agents.Receptionist = new ReceptionistAgent(newConfig);
  }

  getAgent(agentKey) {
    return this.agents[agentKey] || this.agents.Receptionist;
  }

  getSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        step: "IDLE",
        activeAgent: "Receptionist",
        config: this.config,
        orchestrator: this,
        orderDraft: {
          garment_type: "",
          occasion: "",
          design_notes: "",
          fabric: "self-provided",
          color: "",
          measurements: {},
          deadline: "",
          estimated_price: "",
          deposit_paid: "0 TZS",
          balance_due: "",
          delivery_method: "pickup",
          delivery_address: "Studio",
          status: "received"
        }
      });
    }
    const s = this.sessions.get(sessionId);
    s.config = this.config;
    s.orchestrator = this;
    return s;
  }

  processMessage(sessionId, textMessage, existingOrders = []) {
    const session = this.getSession(sessionId);
    const text = textMessage.trim();
    const lower = text.toLowerCase();

    const escalationKeywords = ["pesa zangu", "urudishe pesa", "mzozo", "kesi", "sheria", "refund", "lawyer"];
    if (escalationKeywords.some(kw => lower.includes(kw))) {
      return this.agents.HumanTailorHandoff.escalate(session, "sensitive_complaint");
    }

    if (lower === "menu" || lower === "anza" || lower === "restart" || lower === "habari" || lower === "hi") {
      session.step = "IDLE";
      session.activeAgent = "Receptionist";
    }

    if (session.step === "IDLE") {
      return this.agents.Receptionist.handle(session, text, lower);
    }

    if (session.step === "ORDER_GARMENT_TYPE") {
      session.orderDraft.garment_type = text;
      session.step = "ORDER_OCCASION";
      return `Vizuri sana! Je, hii ${text} ni kwa ajili ya tukio gani? (Mfano: Harusi, Kitchen Party, Ofisi, Kawaida, n.k.)`;
    }

    if (session.step === "ORDER_OCCASION") {
      session.orderDraft.occasion = text;
      session.step = "ORDER_FABRIC";
      return `Nimeelewa! Kuhusu kitambaa:\n1️⃣ Nina kitambaa changu tayari\n2️⃣ Nahitaji ushauri / mnipatie kitambaa studio\n\nTafadhali andika namba 1 au 2.`;
    }

    if (session.step === "ORDER_FABRIC") {
      session.orderDraft.fabric = text === "1" ? "Ana kitambaa chake" : "Anahitaji ushauri wa kitambaa";
      session.step = "ORDER_DESIGN";
      return `Tafadhali nieleze mtindo/design unaoutaka au sema kama una picha ya mfano! 🎨`;
    }

    if (session.step === "ORDER_DESIGN") {
      session.orderDraft.design_notes = text;
      session.step = "ORDER_MEASUREMENTS";
      session.activeAgent = "MeasurementAgent";
      return this.agents.MeasurementAgent.promptOptions(session);
    }

    if (session.step === "ORDER_MEASUREMENTS") {
      session.orderDraft.measurements_raw = text;
      session.orderDraft.measurements = this.agents.MeasurementAgent.parseHomeMeasurements(text);
      session.step = "ORDER_DEADLINE";
      return `Vipimo vimepokelewa! ✅ Je, ni tarehe gani unahitaji nguo iwe tayari?`;
    }

    if (session.step === "ORDER_DEADLINE") {
      session.orderDraft.deadline = text;
      session.step = "ORDER_CONFIRMATION";
      session.activeAgent = "FinanceAgent";
      const est = 60000;
      session.orderDraft.estimated_price = `${est.toLocaleString()} TZS`;
      session.orderDraft.deposit_req = `${(est * 0.5).toLocaleString()} TZS`;
      session.orderDraft.balance_due = `${(est * 0.5).toLocaleString()} TZS`;

      return ` Asante! Oda yako ya *${session.orderDraft.garment_type}* (${session.orderDraft.occasion}):\n- Makadirio ya Bei: *${session.orderDraft.estimated_price}*\n- Advance ya kuanzia (50%): *${session.orderDraft.deposit_req}*\n\nJe, unathibitisha kuendelea? (Andika *1* kwa Ndiyo)`;
    }

    if (session.step === "ORDER_CONFIRMATION") {
      session.step = "ORDER_PAYMENT";
      session.orderDraft.order_id = `ZF2026-${Math.floor(100 + Math.random() * 900)}`;
      return this.agents.FinanceAgent.formatPaymentInstructions(session);
    }

    if (session.step === "ORDER_PAYMENT") {
      session.step = "COMPLETED";
      return `Asante sana kwa uthibitisho wa malipo! 📜 Oda yako *#${session.orderDraft.order_id}* imepokelewa na kuanza ushonaji mara moja!`;
    }

    if (session.step === "TRACKING_INPUT") {
      session.step = "IDLE";
      return this.agents.TrackingAgent.handleTracking(session, text, existingOrders);
    }

    return this.agents.Receptionist.handle(session, text, lower);
  }
}

module.exports = NodeMultiAgentOrchestrator;
