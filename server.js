const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "feyo_verify_token";
const ACCESS_TOKEN = "EAASwZAWnZBfLoBQ8ZAFO2SZBUjECtqEkJPuVQX2aeco3ifnFgAzvoFbyLhBZAuy2ERVJbRMOVWlt5eFxPMXejcMzhIBeZCZBLan32IB0nZAmP4nrhZAXfCqp4riZAqtWGsXVKfEKhBpFhTCNojA5LA9q7dnVY7F2t7XWqQs9bkZBIhBZCx9QS20Yq2t4h0KevWnrb36HMWoNfPtQWZBq2oBdw2zgIsZBf73AySXuyuWpCd7o0Xg1Ih3L1NxZAkv9POLYCqsGfZBV9vz7BoRC76Pqr3RLZB0EZC";
const PHONE_NUMBER_ID = "YOUR_PHONE_NUMBER_ID";

// ===== MENU MESSAGE =====
const menu = `Moni 👋 Takulandirani ku Daron Driving School.

Sankhani nambala:

1. Courses
2. Fees
3. Deposit
4. Locations
5. Requirements
6. Course Duration
7. Lesson Duration
8. Registration
0. Talk to Office`;

// ===== RESPONSES =====
function getResponse(msg) {
  switch (msg) {
    case "1":
      return `We offer:
Code B (Light Motor Vehicle)
Code C1 (Medium goods vehicle)
Refresher Course`;

    case "2":
      return `Code B License:
30 days – MWK 470,000
20 days – MWK 440,000
15 days – MWK 390,000
10 days – MWK 360,000

Code C1 License:
30 days – MWK 570,000
20 days – MWK 530,000
15 days – MWK 500,000
10 days – MWK 460,000`;

    case "3":
      return `Minimum deposit is MWK 300,000
2–3 Installments Allowed`;

    case "4":
      return `Lilongwe Area 49 – Baghdad Market
+265 998 835 248

Lilongwe Town – Chilambula Road
+265 991 987 466

Lilongwe City Centre – Near Old Mutual
+265 995 304 180

Mzuzu – Near Kazuni Filling Station
+265 991 343 888

Blantyre – Trade Fair Building
+265 994 233 195`;

    case "5":
      return `Requirements:
• National ID
• Valid Daron documents

Includes TRN, Biometrics, Eye test, Highway Code exam`;

    case "6":
      return `Full process: 40–60 days
10 days theory
30 days practical
Exams + Road test`;

    case "7":
      return `Each lesson is 30 minutes per day`;

    case "8":
      return `Visit any office
Bring National ID
Pay deposit MWK 300,000`;

    case "0":
      return `Contact:
Lilongwe: +265 998 835 248
Mzuzu: +265 991 343 888
Blantyre: +265 994 233 195`;

    default:
      return menu;
  }
}

// ===== WEBHOOK VERIFY =====
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// ===== RECEIVE MESSAGE =====
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry[0].changes[0].value.messages[0];
    const from = message.from;
    const text = message.text.body.trim();

    const reply = getResponse(text);

    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// ===== START SERVER =====
app.listen(3000, () => {
  console.log("Daron Bot running on port 3000");
});