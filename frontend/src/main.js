// src/main.js
// Make sure your HTML has a button with id="loginBtn"

const loginBtn = document.getElementById("loginBtn");

async function getNonce(address) {
  const res = await fetch(`http://localhost:5000/nonce/${address}`);
  const data = await res.json();
  console.log("Received nonce:", data.nonce);
  return data.nonce;
}

async function verifySignature(address, signature) {
  const res = await fetch("http://localhost:5000/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature }),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

async function loginWithMetaMask() {
  if (!window.ethereum) {
    alert("MetaMask not detected! Please install it.");
    return;
  }

  // 1️⃣ Ask for wallet connection
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const address = accounts[0];
  console.log("Connected wallet:", address);

  // 2️⃣ Get nonce from backend
  const nonce = await getNonce(address);

  // 3️⃣ Ask user to sign the nonce
  const message = `Login nonce: ${nonce}`;
  const signature = await ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });

  // 4️⃣ Send signature to backend for verification
  const result = await verifySignature(address, signature);

  // 5️⃣ Show result
  if (result.success) {
    alert("✅ Login successful!");
    window.location.href = "dashboard.html"; // redirect
  } else {
    alert("❌ Invalid signature!");
  }
}

loginBtn.addEventListener("click", loginWithMetaMask);

