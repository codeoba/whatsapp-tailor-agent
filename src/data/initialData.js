export const DEFAULT_BUSINESS_INFO = {
  business_name: "Zawadi Fashion House",
  owner_name: "Fundi Zawadi",
  bot_name: "Amina Assistant",
  location: "Kinondoni Studio, Mwaikibaki Road, Dar es Salaam",
  working_hours: "Jumatatu–Jumamosi, 8:00 AM – 6:00 PM (Jumapili Likizo)",
  phone: "+255 712 345 678",
  whatsapp_number: "+255 712 345 678",
  payments: {
    mpesa_lipa: "554433 (Zawadi Fashion)",
    tigo_pesa: "887766",
    airtel_money: "112233",
    bank: "CRDB Bank - 0152349988700 (Zawadi Fashion)"
  },
  completion_time: "Siku 3–14 (kutegemea aina ya nguo)",
  delivery_info: "Ndani ya jiji — Bodaboda/Sendy (TZS 5,000); Nje ya jiji — Basi/Courier (TZS 10,000-15,000)",
  base_prices: {
    "gauni_kawaida": 40000,
    "gauni_harusi": 250000,
    "suti_kiofisi": 90000,
    "sketi_blauzi": 45000,
    "kitenge_design": 50000,
    "marekebisho": 15000
  }
};

export const INITIAL_CATALOGUE = [
  {
    id: "CAT-01",
    title: "Gauni la Harusi & Reception",
    category: "Harusi & Sherehe",
    description: "Gauni la kifahari lenye nakshi ya shanga na lace maalum. Inakuja na veil na muundo unaopendeza sana.",
    price: 350000,
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80",
    tags: ["Harusi", "Gown", "Premium"]
  },
  {
    id: "CAT-02",
    title: "Suti ya Kiofisi (Official Women Suit)",
    category: "Kiofisi",
    description: "Suti ya kisasa ya koti na suruali au sketi. Kitambaa bora kinachostahimili kufua bila kupoteza rangi.",
    price: 120000,
    image: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=600&q=80",
    tags: ["Ofisi", "Suit", "Professional"]
  },
  {
    id: "CAT-03",
    title: "Gauni la Kitenge Modern Design",
    category: "Kitenge & Batiki",
    description: "Design ya kisasa ya Kitenge yenye mchanganyiko wa plain fabric kifuani na ruffles za mikononi.",
    price: 65000,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
    tags: ["Kitenge", "Casual", "African Wear"]
  },
  {
    id: "CAT-04",
    title: "Buibui & Abaya la Kisasa",
    category: "Mavazi ya Kitamaduni",
    description: "Buibui ya muundo wa kipekee yenye nakshi za mikononi na mbele. Inatumia kitambaa laini cha Nidha.",
    price: 85000,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    tags: ["Buibui", "Abaya", "Modest"]
  },
  {
    id: "CAT-05",
    title: "Marekebisho (Alterations & Resizing)",
    category: "Marekebisho",
    description: "Kupunguza/kuongeza kiuno, kufupisha urefu, kubadilisha zip za shaba, na kurekebisha mabega.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    tags: ["Marekebisho", "Zip", "Resizing"]
  }
];

export const INITIAL_ORDERS = [
  {
    order_id: "ZF2026-014",
    customer_name: "Aisha Mohamed",
    customer_phone: "+255 784 112 233",
    garment_type: "Gauni la Harusi / Kitchen Party",
    design_notes: "Mermaid dress na nakshi ya gold lace kifuani",
    fabric: "Anayo kitambaa (Velvet & Lace)",
    color: "Gold & Royal Blue",
    measurements: {
      bust: "92",
      waist: "74",
      hip: "102",
      shoulder: "40",
      sleeve_length: "60",
      garment_length: "145"
    },
    deadline: "2026-08-10",
    estimated_price: "280,000 TZS",
    deposit_paid: "140,000 TZS",
    balance_due: "140,000 TZS",
    delivery_method: "delivery",
    delivery_address: "Mbezi Beach, House No. 44, Dar es Salaam",
    status: "sewing",
    notes: "Ameomba ikamilike siku 2 kabla ya Kitchen Party"
  },
  {
    order_id: "ZF2026-015",
    customer_name: "Grace Karia",
    customer_phone: "+255 715 889 900",
    garment_type: "Suti ya Kiofisi",
    design_notes: "Koti la milia nyembamba na sketi fupi ya penseli",
    fabric: "Duka linunue (Cotton blend)",
    color: "Navy Blue",
    measurements: {
      bust: "88",
      waist: "68",
      hip: "96",
      shoulder: "38",
      sleeve_length: "56",
      garment_length: "65"
    },
    deadline: "2026-08-02",
    estimated_price: "110,000 TZS",
    deposit_paid: "60,000 TZS",
    balance_due: "50,000 TZS",
    delivery_method: "pickup",
    delivery_address: "Kuchukua Studio",
    status: "cutting",
    notes: "Bado hajaleta vipimo vya mwisho vya mabega"
  },
  {
    order_id: "ZF2026-016",
    customer_name: "Neema Masawe",
    customer_phone: "+255 768 443 322",
    garment_type: "Gauni la Kitenge",
    design_notes: "Design ya off-shoulder yenye ruffles za Kitenge cha Ankara",
    fabric: "Ana kitambaa tayari",
    color: "Yellow & Green Ankara",
    measurements: {
      bust: "96",
      waist: "78",
      hip: "106",
      shoulder: "42",
      sleeve_length: "25",
      garment_length: "110"
    },
    deadline: "2026-07-30",
    estimated_price: "55,000 TZS",
    deposit_paid: "55,000 TZS",
    balance_due: "0 TZS",
    delivery_method: "pickup",
    delivery_address: "Kuchukua Studio",
    status: "ready",
    notes: "Imekamilika na kupigwa pasi. Tayari kumpigia simu achukue."
  }
];
