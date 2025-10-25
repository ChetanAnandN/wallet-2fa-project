import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ethers } from "ethers";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let nonces = {}; // temporary store

// ✅ Generate nonce
app.get("/nonce/:address", (req, res) => {
  const { address } = req.params;
  const nonce = Math.floor(Math.random() * 1000000).toString();
  nonces[address.toLowerCase()] = nonce;
  res.json({ nonce });
});

// ✅ Verify signature
app.post("/verify", (req, res) => {
  const { address, signature } = req.body;
  const nonce = nonces[address.toLowerCase()];
  if (!nonce) return res.status(400).json({ success: false, message: "Nonce not found" });

  const message = `Login nonce: ${nonce}`;
  try {
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() === address.toLowerCase()) {
      delete nonces[address.toLowerCase()];
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
