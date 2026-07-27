// CommonJS Tailor Bot Engine for Node.js Backend

class NodeTailorBotEngine {
  constructor(config = {}) {
    this.config = {
      business_name: "Zawadi Fashion House",
      owner_name: "Fundi Zawadi",
      bot_name: "Amina Assistant",
      phone: "+255 712 345 678",
      payments: {
        mpesa_lipa: "554433 (Zawadi Fashion)",
        tigo_pesa: "887766",
        airtel_money: "112233",
        bank: "CRDB Bank - 0152349988700"
      },
      ...config
    };
    this.sessions = new Map();
  }

  getSession(phone) {
    if (!this.sessions.has(phone)) {
      this.sessions.set(phone, {
        step: "IDLE",
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
    return this.sessions.get(phone);
  }

  resetSession(phone) {
    this.sessions.delete(phone);
  }

  processMessage(phone, textMessage) {
    const session = this.getSession(phone);
    const text = textMessage.trim();
    const lowerText = text.toLowerCase();

    // Check for direct reset keywords
    if (lowerText === "menu" || lowerText === "anza" || lowerText === "habari" || lowerText === "hi") {
      session.step = "IDLE";
    }

    // Check for escalation keywords
    const escalationKeywords = ["pesa zangu", "urudishe pesa", "mzozo", "kesi", "sheria", "refund", "lawyer"];
    if (escalationKeywords.some(kw => lowerText.includes(kw))) {
      session.step = "ESCALATED";
      return ` Hili ni jambo ambalo fundi wetu *${this.config.owner_name}* anahitaji kulishughulikia moja kwa moja. Namtaarifu sasa hivi na atakujibu hivi karibuni. Simu: *${this.config.phone}*. Asante kwa uvumilivu wako! 🙏`;
    }

    switch (session.step) {
      case "IDLE":
        if (text === "1" || lowerText.includes("shonewa nguo")) {
          session.step = "ORDER_GARMENT_TYPE";
          return `Hongera! Karibu tuweke oda yako mpya ya ushonaji. 👗\nJe, unataka kushonewa aina gani ya nguo? (Mfano: Gauni la jioni, Mavazi ya harusi, Suti ya kiofisi, Sketi na Blauzi, Kitenge design, Buibui)`;
        }
        if (text === "2" || lowerText.includes("marekebisho")) {
          session.step = "ORDER_GARMENT_TYPE";
          session.orderDraft.garment_type = "Marekebisho (Alteration)";
          return `Unahitaji marekebisho gani kwenye nguo yako? (Mfano: Kupunguza/kuongeza kiuno, kufupisha urefu, kubadilisha zip, kurekebisha mabega)`;
        }
        if (text === "3" || lowerText.includes("bei")) {
          return `💵 *Makadirio ya Bei za Ushonaji*:\n👗 Gauni za Kawaida: TZS 40,000–60,000\n👑 Gauni za Harusi: TZS 200,000–400,000\n👔 Suti za Kiofisi: TZS 90,000–140,000\n✂️ Marekebisho: TZS 10,000–25,000\n\nAndika *1* kuweka oda sasa!`;
        }
        if (text === "4" || lowerText.includes("catalogue")) {
          return `📸 *Portfolio ya ${this.config.business_name}*:\n1️⃣ Gauni la Harusi & Reception (TZS 350,000)\n2️⃣ Suti ya Kiofisi (TZS 120,000)\n3️⃣ Gauni la Kitenge Modern (TZS 65,000)\n\nAndika *1* kuanza oda yako!`;
        }
        if (text === "5" || lowerText.includes("fuatilia")) {
          session.step = "TRACKING";
          return `Tafadhali ingiza Namba ya Oda yako (Mfano: #ZF2026-014):`;
        }
        if (text === "6" || lowerText.includes("fundi")) {
          session.step = "ESCALATED";
          return ` Hili ni jambo ambalo fundi wetu *${this.config.owner_name}* anahitaji kulishughulikia moja kwa moja. Namtaarifu sasa hivi na atakujibu hivi karibuni. Simu: *${this.config.phone}*. Asante! 🙏`;
        }

        return `Karibu sana kwa *${this.config.business_name}*! 👗✂️\nMimi ni *${this.config.bot_name}*, msaidizi wako wa kidijitali.\n\nNingependa kukusaidiaje leo?\n1️⃣ Nataka kushonewa nguo mpya\n2️⃣ Nataka marekebisho ya nguo\n3️⃣ Naomba bei/makadirio\n4️⃣ Nataka kuona mifano ya kazi (catalogue)\n5️⃣ Nafuatilia oda yangu\n6️⃣ Naomba kuzungumza na fundi moja kwa moja\n\nAndika namba (1-6) au niambie unahitaji nini kwa maneno yako mwenyewe.`;

      case "ORDER_GARMENT_TYPE":
        session.orderDraft.garment_type = text;
        session.step = "ORDER_OCCASION";
        return `Vizuri sana! Je, hii ${text} ni kwa ajili ya tukio gani? (Harusi, Kitchen Party, Ofisi, Kawaida, n.k.)`;

      case "ORDER_OCCASION":
        session.orderDraft.occasion = text;
        session.step = "ORDER_FABRIC";
        return `Nimeelewa! Kuhusu kitambaa:\n1️⃣ Nina kitambaa changu tayari\n2️⃣ Nahitaji ushauri / mnipatie kitambaa studio\n\nTafadhali andika namba 1 au 2.`;

      case "ORDER_FABRIC":
        session.orderDraft.fabric = text === "1" ? "Ana kitambaa chake" : "Anahitaji kitambaa studio";
        session.step = "ORDER_DESIGN";
        return `Tafadhali nieleze mtindo/design unaoutaka au sema kama una picha ya mfano! 🎨`;

      case "ORDER_DESIGN":
        session.orderDraft.design_notes = text;
        session.step = "ORDER_MEASUREMENTS";
        return `Safi! Kwa vipimo sahihi:\n📍 1: Kuja studio kupimwa moja kwa moja\n📞 2: Video Call na fundi akuelekeze kupima\n📏 3: Kujipima nyumbani (Kifua, Kiuno, Nyonga, Bega, Mkono, Urefu kwa cm)\n\nUngependa njia ipi? (Andika 1, 2, au 3)`;

      case "ORDER_MEASUREMENTS":
        session.orderDraft.measurements_raw = text;
        session.step = "ORDER_DEADLINE";
        return `Vipimo vimepokelewa! ✅ Je, ni tarehe gani unahitaji nguo iwe tayari?`;

      case "ORDER_DEADLINE":
        session.orderDraft.deadline = text;
        session.step = "ORDER_CONFIRMATION";
        const estimated = 60000;
        session.orderDraft.estimated_price = `${estimated.toLocaleString()} TZS`;
        session.orderDraft.deposit_req = `${(estimated * 0.5).toLocaleString()} TZS`;
        return ` Asante! Oda yako ya *${session.orderDraft.garment_type}* (${session.orderDraft.occasion}):\n- Makadirio ya Bei: *${session.orderDraft.estimated_price}*\n- Advance ya kuanzia (50%): *${session.orderDraft.deposit_req}*\n\nJe, unathibitisha kuendelea? (Andika *1* kwa Ndiyo)`;

      case "ORDER_CONFIRMATION":
        session.step = "ORDER_PAYMENT";
        session.orderDraft.order_id = `ZF2026-${Math.floor(100 + Math.random() * 900)}`;
        return `Vizuri! Oda Namba *#${session.orderDraft.order_id}* imetengenezwa. 📝\nLipa advance ya *${session.orderDraft.deposit_req}* kupitia M-Pesa Lipa Namba: *${this.config.payments.mpesa_lipa}*\n\nTuma screenshot au risiti hapa kwa uthibitisho!`;

      case "ORDER_PAYMENT":
        session.step = "COMPLETED";
        return `Asante sana kwa uthibitisho wa malipo! 📜 Oda yako *#${session.orderDraft.order_id}* imepokelewa na kuanza ushonaji mara moja!`;

      case "TRACKING":
        session.step = "IDLE";
        return `📍 Oda Namba *${text}* iko hatua ya: 🧵 *Inashonwa (Sewing in progress)*.\nTarehe ya kukamilika: *2026-08-05*. Asante!`;

      default:
        session.step = "IDLE";
        return `Karibu tena kwa *${this.config.business_name}*! Andika *1* kuweka oda mpya.`;
    }
  }
}

module.exports = NodeTailorBotEngine;
