/*
 * SO-101 bill of materials + supplier directory.
 *
 * Parts, quantities and reference prices follow the official BOM in
 * TheRobotStudio/SO-ARM100 (README, "Sourcing Parts") and the joint/gear map in
 * the Hugging Face LeRobot SO-101 guide. Supplier links were checked in
 * October 2026 — stock and prices change, so always confirm the exact
 * variant (C001 / C044 / C046) on the product page before paying.
 *
 * Link kinds:
 *   "direct" – a specific product page for the exact part
 *   "search" – a store search for a commodity part (cables, clamps, PSU…)
 *   "kit"    – a bundle that covers several lines of the BOM
 */

/* ------------------------------------------------------------------ */
/* Regions                                                             */
/* ------------------------------------------------------------------ */
window.REGIONS = {
  us:     { name: "United States" },
  ca:     { name: "Canada" },
  mx:     { name: "Mexico" },
  br:     { name: "Brazil" },
  latam:  { name: "Latin America" },
  uk:     { name: "United Kingdom" },
  eu:     { name: "Europe" },
  in:     { name: "India" },
  cn:     { name: "China" },
  jp:     { name: "Japan" },
  kr:     { name: "South Korea" },
  sea:    { name: "Southeast Asia" },
  au:     { name: "Australia & NZ" },
  me:     { name: "Middle East" },
  af:     { name: "Africa" },
  global: { name: "Global" },
};

/* ------------------------------------------------------------------ */
/* Countries → region, local Amazon domain and local marketplace       */
/* ------------------------------------------------------------------ */
// [ISO code, name, flag, continent group, region, amazon TLD | null, marketplace key | null]
window.COUNTRIES = [
  // North America
  ["US", "United States", "🇺🇸", "North America", "us", "com", null],
  ["CA", "Canada", "🇨🇦", "North America", "ca", "ca", null],
  ["MX", "Mexico", "🇲🇽", "North America", "mx", "com.mx", "ml_mx"],
  // South America
  ["BR", "Brazil", "🇧🇷", "South America", "br", "com.br", "ml_br"],
  ["AR", "Argentina", "🇦🇷", "South America", "latam", null, "ml_ar"],
  ["CL", "Chile", "🇨🇱", "South America", "latam", null, "ml_cl"],
  ["CO", "Colombia", "🇨🇴", "South America", "latam", null, "ml_co"],
  ["PE", "Peru", "🇵🇪", "South America", "latam", null, "ml_pe"],
  ["UY", "Uruguay", "🇺🇾", "South America", "latam", null, "ml_uy"],
  ["EC", "Ecuador", "🇪🇨", "South America", "latam", null, "ml_ec"],
  // Europe
  ["GB", "United Kingdom", "🇬🇧", "Europe", "uk", "co.uk", null],
  ["IE", "Ireland", "🇮🇪", "Europe", "eu", "co.uk", null],
  ["DE", "Germany", "🇩🇪", "Europe", "eu", "de", null],
  ["FR", "France", "🇫🇷", "Europe", "eu", "fr", null],
  ["IT", "Italy", "🇮🇹", "Europe", "eu", "it", null],
  ["ES", "Spain", "🇪🇸", "Europe", "eu", "es", null],
  ["PT", "Portugal", "🇵🇹", "Europe", "eu", "es", null],
  ["NL", "Netherlands", "🇳🇱", "Europe", "eu", "nl", null],
  ["BE", "Belgium", "🇧🇪", "Europe", "eu", "com.be", null],
  ["AT", "Austria", "🇦🇹", "Europe", "eu", "de", null],
  ["CH", "Switzerland", "🇨🇭", "Europe", "eu", "de", null],
  ["PL", "Poland", "🇵🇱", "Europe", "eu", "pl", null],
  ["SE", "Sweden", "🇸🇪", "Europe", "eu", "se", null],
  ["DK", "Denmark", "🇩🇰", "Europe", "eu", "de", null],
  ["NO", "Norway", "🇳🇴", "Europe", "eu", "se", null],
  ["FI", "Finland", "🇫🇮", "Europe", "eu", "de", null],
  ["CZ", "Czechia", "🇨🇿", "Europe", "eu", "de", null],
  ["GR", "Greece", "🇬🇷", "Europe", "eu", "de", null],
  ["RO", "Romania", "🇷🇴", "Europe", "eu", "de", null],
  ["HU", "Hungary", "🇭🇺", "Europe", "eu", "de", null],
  ["UA", "Ukraine", "🇺🇦", "Europe", "eu", null, null],
  ["TR", "Türkiye", "🇹🇷", "Europe", "eu", "com.tr", null],
  // Asia
  ["IN", "India", "🇮🇳", "Asia", "in", "in", null],
  ["CN", "China", "🇨🇳", "Asia", "cn", null, "taobao"],
  ["HK", "Hong Kong", "🇭🇰", "Asia", "cn", null, "taobao"],
  ["TW", "Taiwan", "🇹🇼", "Asia", "cn", null, "shopee_tw"],
  ["JP", "Japan", "🇯🇵", "Asia", "jp", "co.jp", null],
  ["KR", "South Korea", "🇰🇷", "Asia", "kr", null, "coupang"],
  ["SG", "Singapore", "🇸🇬", "Asia", "sea", "sg", "shopee_sg"],
  ["MY", "Malaysia", "🇲🇾", "Asia", "sea", null, "shopee_my"],
  ["TH", "Thailand", "🇹🇭", "Asia", "sea", null, "shopee_th"],
  ["ID", "Indonesia", "🇮🇩", "Asia", "sea", null, "shopee_id"],
  ["PH", "Philippines", "🇵🇭", "Asia", "sea", null, "shopee_ph"],
  ["VN", "Vietnam", "🇻🇳", "Asia", "sea", null, "shopee_vn"],
  ["PK", "Pakistan", "🇵🇰", "Asia", "global", null, null],
  ["BD", "Bangladesh", "🇧🇩", "Asia", "global", null, null],
  ["LK", "Sri Lanka", "🇱🇰", "Asia", "global", null, null],
  ["NP", "Nepal", "🇳🇵", "Asia", "global", null, null],
  // Middle East
  ["AE", "United Arab Emirates", "🇦🇪", "Middle East", "me", "ae", null],
  ["SA", "Saudi Arabia", "🇸🇦", "Middle East", "me", "sa", null],
  ["IL", "Israel", "🇮🇱", "Middle East", "me", null, null],
  ["QA", "Qatar", "🇶🇦", "Middle East", "me", "ae", null],
  // Oceania
  ["AU", "Australia", "🇦🇺", "Oceania", "au", "com.au", null],
  ["NZ", "New Zealand", "🇳🇿", "Oceania", "au", "com.au", null],
  // Africa
  ["ZA", "South Africa", "🇿🇦", "Africa", "af", "co.za", "takealot"],
  ["EG", "Egypt", "🇪🇬", "Africa", "af", "eg", null],
  ["NG", "Nigeria", "🇳🇬", "Africa", "af", null, "jumia_ng"],
  ["KE", "Kenya", "🇰🇪", "Africa", "af", null, "jumia_ke"],
  ["MA", "Morocco", "🇲🇦", "Africa", "af", null, "jumia_ma"],
];

/* Local marketplaces used for commodity searches when there's no Amazon. */
window.MARKETPLACES = {
  ml_mx:     { name: "Mercado Libre MX", search: (q) => `https://listado.mercadolibre.com.mx/${slug(q)}` },
  ml_br:     { name: "Mercado Livre",    search: (q) => `https://lista.mercadolivre.com.br/${slug(q)}` },
  ml_ar:     { name: "Mercado Libre AR", search: (q) => `https://listado.mercadolibre.com.ar/${slug(q)}` },
  ml_cl:     { name: "Mercado Libre CL", search: (q) => `https://listado.mercadolibre.cl/${slug(q)}` },
  ml_co:     { name: "Mercado Libre CO", search: (q) => `https://listado.mercadolibre.com.co/${slug(q)}` },
  ml_pe:     { name: "Mercado Libre PE", search: (q) => `https://listado.mercadolibre.com.pe/${slug(q)}` },
  ml_uy:     { name: "Mercado Libre UY", search: (q) => `https://listado.mercadolibre.com.uy/${slug(q)}` },
  ml_ec:     { name: "Mercado Libre EC", search: (q) => `https://listado.mercadolibre.com.ec/${slug(q)}` },
  taobao:    { name: "Taobao",           search: (q) => `https://s.taobao.com/search?q=${enc(q)}` },
  shopee_tw: { name: "Shopee TW",        search: (q) => `https://shopee.tw/search?keyword=${enc(q)}` },
  shopee_sg: { name: "Shopee SG",        search: (q) => `https://shopee.sg/search?keyword=${enc(q)}` },
  shopee_my: { name: "Shopee MY",        search: (q) => `https://shopee.com.my/search?keyword=${enc(q)}` },
  shopee_th: { name: "Shopee TH",        search: (q) => `https://shopee.co.th/search?keyword=${enc(q)}` },
  shopee_id: { name: "Shopee ID",        search: (q) => `https://shopee.co.id/search?keyword=${enc(q)}` },
  shopee_ph: { name: "Shopee PH",        search: (q) => `https://shopee.ph/search?keyword=${enc(q)}` },
  shopee_vn: { name: "Shopee VN",        search: (q) => `https://shopee.vn/search?keyword=${enc(q)}` },
  coupang:   { name: "Coupang",          search: (q) => `https://www.coupang.com/np/search?q=${enc(q)}` },
  takealot:  { name: "Takealot",         search: (q) => `https://www.takealot.com/all?qsearch=${enc(q)}` },
  jumia_ng:  { name: "Jumia NG",         search: (q) => `https://www.jumia.com.ng/catalog/?q=${enc(q)}` },
  jumia_ke:  { name: "Jumia KE",         search: (q) => `https://www.jumia.co.ke/catalog/?q=${enc(q)}` },
  jumia_ma:  { name: "Jumia MA",         search: (q) => `https://www.jumia.ma/catalog/?q=${enc(q)}` },
};

function enc(q) { return encodeURIComponent(q); }
function slug(q) { return q.trim().toLowerCase().replace(/\s+/g, "-"); }

/* ------------------------------------------------------------------ */
/* Bill of materials                                                   */
/* ------------------------------------------------------------------ */
// qty.follower / qty.leader are per arm. refUSD is a reference unit price in
// USD (official US BOM where listed, otherwise a typical retail price).
window.PARTS = [
  {
    id: "c018",
    group: "Motors",
    name: "Feetech STS3215 servo — 12 V, 1/345 gear",
    code: "C018 · follower arm",
    qty: { follower: 6, leader: 0 },
    refUSD: 16,
    specs: ["12 V", "1:345", "~30 kg·cm stall", "Follower only"],
    note: "All six follower joints use this servo. It's the recommended high-torque version. Check that the listing says C018 or 12 V / 30 kg, and power this arm from the 12 V supply below.",
    search: "Feetech STS3215 C018 12V",
    buy: {
      us: [
        { store: "RobotShop", url: "https://www.robotshop.com/products/feetech-12v-30kgcm-magnetic-encoding-servo-sts3215", kind: "direct" },
      ],
      uk: [
        { store: "RobotShop UK", url: "https://uk.robotshop.com/products/feetech-12v-30kgcm-magnetic-encoding-servo-sts3215", kind: "direct" },
      ],
      eu: [
        { store: "OpenELAB", url: "https://openelab.io/products/feetech-sts3215-c018-servo-12v", kind: "direct" },
      ],
      in: [
        { store: "Evelta (Mumbai)", url: "https://evelta.com/st3215-c018-12v-30kg-cm-dual-shaft-ttl-serial-servo-metal-gears-magnetic-encoder/", kind: "direct" },
      ],
      mx: [
        { store: "Mercado Libre MX", url: "https://articulo.mercadolibre.com.mx/MLM-3582679048-servos-sts3215-de-12-v-para-brazo-robotico-so-arm100-de-30-k-_JM", kind: "direct" },
      ],
      br: [
        { store: "Mercado Livre", url: "https://lista.mercadolivre.com.br/sts3215-12v", kind: "search" },
      ],
      global: [
        { store: "Alibaba · 6-pack (official BOM link)", url: "https://www.alibaba.com/product-detail/6PCS-12V-30KG-STS3215-High-Torque_1601216757543.html", kind: "direct" },
        { store: "WowRobo", url: "https://shop.wowrobo.com/products/feetech-sts3215-servo-12v-30kg-high-torque-servo-for-so-arm100", kind: "direct" },
      ],
    },
  },
  {
    id: "c001",
    group: "Motors",
    name: "Feetech STS3215 servo — 7.4 V, 1/345 gear",
    code: "C001 · leader arm",
    leaderOnly: true,
    qty: { follower: 0, leader: 1 },
    refUSD: 13.89,
    specs: ["7.4 V", "1:345", "~19.5 kg·cm stall", "Leader only"],
    note: "The leader uses one of these, on Shoulder Lift (joint 2). Check that the listing says C001 or 7.4 V 1/345.",
    search: "Feetech STS3215 C001 7.4V",
    buy: {
      us: [
        { store: "Seeed Studio", url: "https://www.seeedstudio.com/STS3215-19kg-cm-7-4V-Serial-Servo-p-6338.html", kind: "direct" },
        { store: "Amazon US", url: "https://www.amazon.com/SO-ARM101-Debugging-Reduction-345-Compatible/dp/B0FLW54PJB", kind: "direct" },
      ],
      eu: [
        { store: "OpenELAB", url: "https://openelab.com/products/feetech-sts3215-c001-servo-7", kind: "direct" },
      ],
      in: [
        { store: "Evelta (Mumbai)", url: "https://evelta.com/sts3215-7-4v-19kg-dual-axis-ttl-string-servo-motor/", kind: "direct" },
      ],
      cn: [
        { store: "Taobao", url: "https://item.taobao.com/item.htm?id=712179366565&skuId=5268252241438", kind: "direct" },
      ],
      jp: [
        { store: "Akizuki Denshi", url: "https://akizukidenshi.com/catalog/g/g116312/", kind: "direct" },
      ],
      au: [
        { store: "Core Electronics", url: "https://core-electronics.com.au/feetech-sts3215-smart-servo.html", kind: "direct" },
      ],
      mx: [
        { store: "Mercado Libre MX", url: "https://listado.mercadolibre.com.mx/sts3215", kind: "search" },
      ],
      br: [
        { store: "Mercado Livre", url: "https://lista.mercadolivre.com.br/sts3215", kind: "search" },
      ],
      global: [
        { store: "Alibaba · official BOM link", url: "https://www.alibaba.com/product-detail/Top-Seller-Low-Cost-Feetech-STS3215_1600999461525.html", kind: "direct" },
        { store: "Seeed Studio", url: "https://www.seeedstudio.com/STS3215-19kg-cm-7-4V-Serial-Servo-p-6338.html", kind: "direct" },
      ],
    },
  },
  {
    id: "c044",
    group: "Motors",
    name: "Feetech STS3215 servo — 7.4 V, 1/191 gear",
    code: "C044 · leader arm",
    leaderOnly: true,
    qty: { follower: 0, leader: 2 },
    refUSD: 13.89,
    specs: ["7.4 V", "1:191", "~27 kg·cm stall", "Leader only"],
    note: "Leader arm only, on Base / Shoulder Pan (joint 1) and Elbow Flex (joint 3).",
    search: "Feetech STS3215 C044",
    buy: {
      us: [
        { store: "Seeed Studio", url: "https://www.seeedstudio.com/Feetech-ST-3215-C044-Heavy-Duty-Servo-7-4V-1-191-Gear-Reduction-p-6460.html", kind: "direct" },
      ],
      eu: [
        { store: "OpenELAB", url: "https://openelab.io/products/feetech-sts3215-c044-servo-7", kind: "direct" },
      ],
      in: [
        { store: "Evelta (Mumbai)", url: "https://evelta.com/sts3215-c044-7-4v-1-191-86rpm-metal-gear-dual-axis-ttl-serial-bus-servo-motor/", kind: "direct" },
      ],
      jp: [
        { store: "Akizuki Denshi", url: "https://akizukidenshi.com/catalog/g/g131131/", kind: "direct" },
      ],
      global: [
        { store: "Alibaba · official BOM link", url: "https://www.alibaba.com/product-detail/Feetech-STS3215-SO-ARM101-Servo-7_1601430747897.html", kind: "direct" },
        { store: "WowRobo", url: "https://shop.wowrobo.com/products/feetech-sts3215-c044-servo-7-4v-27-4kg-1-191-servo-for-so-arm101", kind: "direct" },
        { store: "Seeed Studio", url: "https://www.seeedstudio.com/Feetech-ST-3215-C044-Heavy-Duty-Servo-7-4V-1-191-Gear-Reduction-p-6460.html", kind: "direct" },
      ],
    },
  },
  {
    id: "c046",
    group: "Motors",
    name: "Feetech STS3215 servo — 7.4 V, 1/147 gear",
    code: "C046 · leader arm",
    leaderOnly: true,
    qty: { follower: 0, leader: 3 },
    refUSD: 13.89,
    specs: ["7.4 V", "1:147", "~14.4 kg·cm stall", "Leader only"],
    note: "Leader arm only, on Wrist Flex (4), Wrist Roll (5) and the Gripper/trigger (6). The low gearing keeps the leader easy to move by hand.",
    search: "Feetech STS3215 C046",
    buy: {
      us: [
        { store: "Seeed Studio", url: "https://www.seeedstudio.com/Feetech-ST-3215-C046-Standard-Torque-Servo-7-4V-1-147-Gear-Reduction-p-6461.html", kind: "direct" },
      ],
      eu: [
        { store: "OpenELAB", url: "https://openelab.io/products/feetech-sts3215-c046-servo", kind: "direct" },
      ],
      in: [
        { store: "Evelta (Mumbai)", url: "https://evelta.com/sts3215-c046-7-4v-1-147-magnetic-encoding-metal-gear-dual-axis-ttl-serial-bus-servo-motor/", kind: "direct" },
      ],
      jp: [
        { store: "Akizuki Denshi", url: "https://akizukidenshi.com/catalog/g/g131132/", kind: "direct" },
      ],
      global: [
        { store: "Alibaba · official BOM link", url: "https://www.alibaba.com/product-detail/Feetech-STS3215-SO-ARM101-Servo-7_1601430760797.html", kind: "direct" },
        { store: "WowRobo", url: "https://shop.wowrobo.com/products/feetech-sts3215-c046-servo-7-4v-14-4kg-1-147-servo-for-so-arm101", kind: "direct" },
        { store: "Seeed Studio", url: "https://www.seeedstudio.com/Feetech-ST-3215-C046-Standard-Torque-Servo-7-4V-1-147-Gear-Reduction-p-6461.html", kind: "direct" },
      ],
    },
  },
  {
    id: "board",
    group: "Electronics",
    name: "Serial bus servo driver board",
    code: "Waveshare Bus Servo Adapter (A)",
    qty: { follower: 1, leader: 1 },
    refUSD: 10.6,
    specs: ["USB-C to UART", "5.5 × 2.1 mm DC jack", "ST/SC series"],
    note: "You need one per arm. Set both jumpers to the B (USB) channel. A Seeed Studio board also works; print the matching mounting plate if you use one.",
    search: "Waveshare bus servo adapter",
    buy: {
      us: [{ store: "Amazon US", url: "https://www.amazon.com/Waveshare-Integrates-Control-Circuit-Supports/dp/B0CTMM4LWK/", kind: "direct" }],
      eu: [
        { store: "Amazon FR", url: "https://www.amazon.fr/-/en/dp/B0CJ6TP3TP/", kind: "direct" },
        { store: "Botland", url: "https://botland.store/drivers-for-servos/24907-bus-servo-adapter-a-controller-for-stsc-series-serial-bus-servos-uart-waveshare-25514-5904422385736.html", kind: "direct" },
      ],
      in: [
        { store: "Zbotic", url: "https://zbotic.in/product/waveshare-serial-bus-servo-driver-board-integrates-servo-power-supply-and-control-circuit-applicable-for-st-sc-series-serial-bus-servos/", kind: "direct" },
        { store: "Sharvi Electronics", url: "https://sharvielectronics.com/product/serial-bus-servo-driver-board-integrates-servo-power-supply-and-control-circuit-applicable-for-st-sc-series-serial-bus-servos-waveshare/", kind: "direct" },
      ],
      cn: [{ store: "Tmall", url: "https://detail.tmall.com/item.htm?id=738817173460&skuId=5096283384143", kind: "direct" }],
      jp: [{ store: "Akizuki Denshi", url: "https://akizukidenshi.com/catalog/g/g131227/", kind: "direct" }],
      global: [{ store: "Waveshare (official)", url: "https://www.waveshare.com/bus-servo-adapter-a.htm", kind: "direct" }],
    },
  },
  {
    id: "psu12",
    group: "Electronics",
    name: "12 V DC power supply · follower arm",
    code: "12 V · 5 A or more · 5.5 × 2.1 mm barrel",
    qty: { follower: 1, leader: 0 },
    refUSD: 12,
    specs: ["12 V", "≥ 5 A (60 W)", "5.5 × 2.1 mm plug", "Follower only"],
    note: "Powers the follower's 12 V C018 servos. Plug it into the follower's driver board only.",
    search: "12V 5A power supply 5.5x2.1mm",
    buy: {
      us: [{ store: "Amazon US · ALITOVE 12 V 5 A", url: "https://www.amazon.com/ALITOVE-Adapter-Converter-100-240V-5-5x2-1mm/dp/B01GEA8PQA", kind: "direct" }],
    },
  },
  {
    id: "psu5",
    group: "Electronics",
    name: "5 V DC power supply · leader arm",
    code: "5 V · 4 A or more · 5.5 × 2.1 mm barrel",
    leaderOnly: true,
    qty: { follower: 0, leader: 1 },
    refUSD: 10,
    specs: ["5 V", "≥ 4 A", "5.5 × 2.1 mm plug", "Leader only"],
    note: "Powers the leader's 7.4 V servos. Never plug the 12 V supply into the leader, because it will damage its servos. Label the two adapters so you don't mix them up.",
    search: "5V 4A power supply 5.5x2.1mm",
    buy: {
      us: [{ store: "Amazon US", url: "https://www.amazon.com/Facmogu-Switching-Transformer-Compatible-5-5x2-1mm/dp/B087LY41PV/", kind: "direct" }],
      ca: [{ store: "Amazon CA", url: "https://www.amazon.ca/Facmogu-Power-Supply-Adapter-100-240V/dp/B087LY41PV", kind: "direct" }],
      eu: [{ store: "Amazon FR", url: "https://www.amazon.fr/-/en/dp/B01HRR9GY4/", kind: "direct" }],
      cn: [{ store: "Taobao", url: "https://item.taobao.com/item.htm?id=544824248494&skuId=4974994129990", kind: "direct" }],
      jp: [{ store: "Akizuki Denshi", url: "https://akizukidenshi.com/catalog/g/g106238/", kind: "direct" }],
    },
  },
  {
    id: "usbc",
    group: "Electronics",
    name: "USB-C data cable",
    code: "USB-A or USB-C to USB-C",
    qty: { follower: 1, leader: 1 },
    refUSD: 3.5,
    specs: ["Data-capable", "~1 m"],
    note: "Connects each driver board to your computer. Choose the plug that matches your laptop. Charge-only cables won't work.",
    search: "USB C data cable 2 pack",
    buy: {
      us: [{ store: "Amazon US · 2-pack", url: "https://www.amazon.com/Charging-etguuds-Charger-Braided-Compatible/dp/B0B8NWLLW2/?th=1", kind: "direct" }],
      eu: [{ store: "Amazon FR", url: "https://www.amazon.fr/dp/B07BNF842T/", kind: "direct" }],
      cn: [{ store: "Tmall", url: "https://detail.tmall.com/item.htm?id=44425281296&skuId=5611379016222", kind: "direct" }],
      jp: [{ store: "Amazon JP", url: "https://www.amazon.co.jp/dp/B0C3H9L6KZ", kind: "direct" }],
    },
  },
  {
    id: "clamp",
    group: "Tools & hardware",
    name: "Table clamps",
    code: "Small quick-grip / ratchet clamps",
    qty: { follower: 2, leader: 2 },
    refUSD: 2.25,
    specs: ["2 per arm", "~6 in / 150 mm"],
    note: "These hold each base to the desk. Any small bar clamp works.",
    search: "small quick grip bar clamp 6 inch",
    buy: {
      us: [{ store: "Amazon US · 4-pack", url: "https://www.amazon.com/TAODAN-Trigger-Ratchet-Woodworking-Processes/dp/B0DJNXF8WH", kind: "direct" }],
      eu: [{ store: "Amazon FR", url: "https://www.amazon.fr/Connex-COXT865210-Lot-Serre-joints-bricolage/dp/B00NA3T2CQ", kind: "direct" }],
      cn: [{ store: "Tmall", url: "https://detail.tmall.com/item.htm?id=801399113134&skuId=5633627126649", kind: "direct" }],
      jp: [{ store: "Amazon JP", url: "https://www.amazon.co.jp/dp/B0DJNXF8WH", kind: "direct" }],
    },
  },
  {
    id: "driver",
    group: "Tools & hardware",
    name: "Precision screwdriver set",
    code: "Phillips #0 and #1",
    qty: { follower: 1, leader: 0 },
    shared: true,
    refUSD: 6,
    specs: ["PH0", "PH1", "One set covers both arms"],
    note: "Any set with Phillips #0 and #1 works. The M2×6 and M3×6 screws come in the bag with each servo.",
    search: "precision screwdriver set phillips PH0 PH1",
    buy: {
      us: [{ store: "Amazon US", url: "https://www.amazon.com/Precision-Phillips-Screwdriver-Electronics-Computer/dp/B0DB227RTH", kind: "direct" }],
      eu: [{ store: "Amazon FR", url: "https://www.amazon.fr/Vinabo-Magn%C3%A9tique-Electronique-R%C3%A9paration-Informatique/dp/B0BNQBNFFJ", kind: "direct" }],
      cn: [{ store: "Tmall", url: "https://detail.tmall.com/item.htm?id=675684600845&skuId=4856851392176", kind: "direct" }],
      jp: [{ store: "Amazon JP", url: "https://www.amazon.co.jp/dp/B01MDNJVMN", kind: "direct" }],
    },
  },
  {
    id: "pla",
    group: "3D printing",
    name: "PLA+ filament (or printed parts)",
    code: "1.75 mm PLA+, ~1 kg spool",
    qty: { follower: 1, leader: 0 },
    shared: true,
    refUSD: null,
    specs: ["PLA+", "15% infill", "0.2 mm layers"],
    note: "Only needed if you print the parts yourself. One spool comfortably covers a leader and a follower. No printer? See the printing services in section 04.",
    search: "PLA+ filament 1.75mm 1kg",
    buy: {},
  },
];

/* Optional upgrade (shown separately, not counted in totals). */
window.OPTIONAL_PARTS = [
  {
    name: "Leader servo bundle: 1× C001 + 2× C044 + 3× C046",
    note: "The official BOM's single listing for all six leader servos, so you don't have to buy three variants separately.",
    links: [
      { store: "Alibaba · 6-pack (official BOM)", url: "https://www.alibaba.com/product-detail/6PCS-7-4V-STS3215-Servos-for_1601428584027.html" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Leader joint → motor map (LeRobot SO-101 guide)                     */
/* ------------------------------------------------------------------ */
window.JOINTS = [
  { n: 1, joint: "Base / Shoulder Pan", leader: "C044", follower: "C018" },
  { n: 2, joint: "Shoulder Lift",       leader: "C001", follower: "C018" },
  { n: 3, joint: "Elbow Flex",          leader: "C044", follower: "C018" },
  { n: 4, joint: "Wrist Flex",          leader: "C046", follower: "C018" },
  { n: 5, joint: "Wrist Roll",          leader: "C046", follower: "C018" },
  { n: 6, joint: "Gripper / Trigger",   leader: "C046", follower: "C018" },
];

/* ------------------------------------------------------------------ */
/* Complete kits                                                       */
/* ------------------------------------------------------------------ */
// regions: where the seller is based / ships locally. "global" = ships worldwide.
window.KITS = [
  { name: "SO-101 Kit Pro (motors + electronics)", seller: "Seeed Studio", url: "https://www.seeedstudio.com/SO-101-Low-Cost-AI-Arm-Kit-Pro-p-6427.html", regions: ["global", "us"], includes: ["Servos", "Boards", "PSU", "Cables"], official: true },
  { name: "SO-101 3D-printed frame", seller: "Seeed Studio", url: "https://www.seeedstudio.com/SO-101-Assembled-Kit-Pro-p-6691.html", regions: ["global", "us"], includes: ["Printed parts"], official: true },
  { name: "SO-ARM101 DIY kit / assembled", seller: "WowRobo", url: "https://shop.wowrobo.com/products/so-arm101-diy-kit-assembled-version-1", regions: ["global"], includes: ["Servos", "Electronics", "Printed parts", "Assembled option"], official: true },
  { name: "SO-ARM101 kits", seller: "Hiwonder", url: "https://www.hiwonder.com/products/lerobot-so-101", regions: ["global", "us", "ca", "sea", "me"], includes: ["Servos", "Electronics", "Assembled option"] },
  { name: "SO-101 parts kits", seller: "Robonine", url: "https://robonine.com/", regions: ["global", "eu"], includes: ["Parts kits"], official: true },
  { name: "SO-ARM100 3D-printed parts (resin)", seller: "Waveshare", url: "https://www.waveshare.com/so-arm100-3dp-parts-kit.htm", regions: ["global", "cn"], includes: ["Printed parts"] },
  { name: "SO-ARM101 (assembled)", seller: "PartaBot", url: "https://partabot.com/products/so-arm101", regions: ["us"], includes: ["Assembled arms"], official: true },
  { name: "Frame / electronics / complete kits", seller: "ForgeMotion Labs", url: "https://forgemotionlabs.com/products", regions: ["us"], includes: ["Printed parts", "Electronics", "Complete"], official: true },
  { name: "SO-101 robot arm kit", seller: "RobotEd (Switzerland)", url: "https://roboted.ch/en/shop/so-101-robot-arm-kit", regions: ["eu", "uk"], includes: ["Frame", "Electronics", "Complete"], official: true },
  { name: "LeRobot SO-101 starter kit", seller: "Autodiscovery (EU)", url: "https://autodiscovery.eu/en/products/so-101-kit", regions: ["eu", "uk"], includes: ["Complete kit"], official: true },
  { name: "SO-ARM101 DIY kit", seller: "Camp Tecnológico (Spain)", url: "https://tienda.camptecnologico.com/producto/so-arm101-diy-kit-orange/", regions: ["eu"], includes: ["Servos", "Electronics", "Printed parts"] },
  { name: "SO-ARM101 DIY kit (EU stock)", seller: "OpenELAB", url: "https://openelab.io/products/wowrobo-robotics-so-arm101-diy", regions: ["eu", "uk"], includes: ["Servos", "Electronics", "Printed parts"] },
  { name: "LeRobot SO-101 DIY kit", seller: "ThinkRobotics", url: "https://thinkrobotics.com/products/so-arm101-hugging-face-lerobot", regions: ["in"], includes: ["Servos", "Electronics", "Printed parts"] },
  { name: "SO-ARM101 DIY & assembled", seller: "MGSL (WowRobo India)", url: "https://mgsl.in/products/so-arm101-diy-kit-assembled-version", regions: ["in"], includes: ["DIY", "Assembled"] },
  { name: "SO-101 leader + follower, 12 V, assembled", seller: "GetSetRobotics", url: "https://getsetrobotics.com/product/so-101-leader-follower-robotic-arm-12v-assembled/", regions: ["in"], includes: ["Assembled arms"] },
  { name: "SO-ARM100/101 kit", seller: "Seeed (Taobao)", url: "https://item.taobao.com/item.htm?id=878010637397&skuId=5915703371829", regions: ["cn"], includes: ["Printed parts kit"], official: true },
  { name: "SO-ARM101 kit", seller: "WowRobo (Taobao)", url: "https://item.taobao.com/item.htm?ft=t&id=860171734711", regions: ["cn"], includes: ["Assembled option"], official: true },
  { name: "SO-101 kit", seller: "NeoBot (Taobao)", url: "https://item.taobao.com/item.htm?ft=t&id=957685951340", regions: ["cn"], includes: ["Kit"], official: true },
  { name: "SO-ARM101 kit (Seeed)", seller: "Akizuki Denshi", url: "https://akizukidenshi.com/catalog/g/g131169/", regions: ["jp"], includes: ["Kit"], official: true },
  { name: "SO-ARM kits + Korean guides", seller: "RoboSEasy", url: "https://smartstore.naver.com/roboseasy", regions: ["kr"], includes: ["Kits", "Korean docs"], official: true },
  { name: "SO-ARM100 kit", seller: "Seeed (AliExpress)", url: "https://www.aliexpress.com/item/3256808696884714.html", regions: ["global", "br", "latam", "af", "me", "sea", "au", "mx"], includes: ["Printed parts kit"], official: true },
];

/* ------------------------------------------------------------------ */
/* 3D printing services                                                */
/* ------------------------------------------------------------------ */
window.PRINT_SERVICES = [
  { name: "Craftcloud", url: "https://craftcloud3d.com/upload", regions: ["us", "ca", "eu", "uk", "au", "global"], note: "A marketplace that sends your order to a local print shop. Upload the files from individual/, choose PLA+ at 20% infill, and set the shared parts to quantity 2.", official: true },
  { name: "PCBWay", url: "https://www.pcbway.com/rapid-prototyping/manufacture/?type=2", regions: ["cn", "global"], note: "Upload the two Ender plate files. Material: custom, PLA+; add the note \"FDM, 20% infill\". The official guide reports about $95 for both arms. Outside China you also pay import duty.", official: true },
  { name: "JLC3DP", url: "https://jlc3dp.com/", regions: ["cn", "global", "in", "sea"], note: "Low-cost FDM/MJF printing from China with worldwide shipping." },
  { name: "Seeed printed frame", url: "https://www.seeedstudio.com/SO-101-Assembled-Kit-Pro-p-6691.html", regions: ["global", "us"], note: "Ready-printed SO-101 parts. You don't upload anything." },
];

/* ------------------------------------------------------------------ */
/* STL files                                                           */
/* ------------------------------------------------------------------ */
window.STL_PLATES = [
  { label: "Prusa / Up · 205 × 250 mm bed", follower: "Prusa_Follower_SO101.stl", leader: "Prusa_Leader_SO101.stl", size: "4.8 MB" },
  { label: "Bambu Lab A1 mini · 180 × 180 mm bed", follower: "BambuLabA1mini_Follower_SO101.stl", leader: "BambuLabA1mini_Leader_SO101.stl", size: "4.8 MB" },
  { label: "Ender · 220 × 220 mm bed", follower: "Ender_Follower_SO101.stl", leader: "Ender_Leader_SO101.stl", size: "25 MB" },
];

window.STL_PARTS = [
  { file: "Base_SO101.stl", use: "common" },
  { file: "Base_motor_holder_SO101.stl", use: "common" },
  { file: "Motor_holder_SO101_Base.stl", use: "common" },
  { file: "Motor_holder_SO101_Wrist.stl", use: "common" },
  { file: "Rotation_Pitch_SO101.stl", use: "common" },
  { file: "Upper_arm_SO101.stl", use: "common" },
  { file: "Under_arm_SO101.stl", use: "common" },
  { file: "Wrist_Roll_Pitch_SO101.stl", use: "common" },
  { file: "WaveShare_Mounting_Plate_SO101.stl", use: "common", hint: "Use this or the Seeed plate, whichever matches your board" },
  { file: "Seeedstudio_Mounting_Plate_SO101.stl", use: "common", hint: "Alternative plate for the Seeed driver board" },
  { file: "Moving_Jaw_SO101.stl", use: "follower" },
  { file: "Wrist_Roll_Follower_SO101.stl", use: "follower" },
  { file: "Handle_SO101.stl", use: "leader" },
  { file: "Trigger_SO101.stl", use: "leader" },
  { file: "Wrist_Roll_SO101.stl", use: "leader" },
];

window.STL_GAUGES = [
  { file: "Gauge_0.STL", label: "Servo gauge: zero" },
  { file: "Gauge_tight_1.STL", label: "Servo gauge: tight" },
  { file: "Lego_Size_Test_02_zero.STL", label: "LEGO gauge: zero" },
  { file: "Lego_Size_Test_02_minuspoint1.STL", label: "LEGO gauge: −0.1" },
];
