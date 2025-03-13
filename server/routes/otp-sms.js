const express = require("express");
const twilio = require("twilio");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const accountSid = "";
const authToken = "";
const verifySid = "";
const client = twilio(accountSid, authToken);

// Envoyer OTP
app.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const otpResponse = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ success: true, sid: otpResponse.sid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Vérifier OTP
app.post("/verify-otp", async (req, res) => {
  try {
    const { phone, code } = req.body;
    const verification = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code });

    if (verification.status === "approved") {
      res.json({ success: true, message: "OTP validé !" });
    } else {
      res.status(400).json({ success: false, message: "OTP invalide." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(5000, () => console.log("Serveur OTP en cours d'exécution sur le port 5000"));
