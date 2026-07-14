const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input

async function login() {
  console.log("==========================================");
  console.log("🔑 Telegram Userbot Login");
  console.log("==========================================");
  
  const apiIdStr = await input.text("Enter your API_ID from my.telegram.org: ");
  const apiId = parseInt(apiIdStr, 10);
  const apiHash = await input.text("Enter your API_HASH from my.telegram.org: ");

  // Create an empty session
  const stringSession = new StringSession("");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Enter your phone number (with +): "),
    password: async () => await input.text("Enter your 2FA password (if enabled, else leave blank): "),
    phoneCode: async () => await input.text("Enter the code sent to your Telegram app: "),
    onError: (err) => console.log(err),
  });

  console.log("\n✅ You are now connected!");
  
  const sessionString = client.session.save();
  console.log("\n==========================================");
  console.log("🚨 SAVE THIS SESSION STRING SOMEWHERE SAFE! 🚨");
  console.log("==========================================");
  console.log(sessionString);
  console.log("==========================================");
  console.log("Copy the string above and put it in your .env file as TG_SESSION_STRING=...");

  await client.sendMessage("me", { message: "✅ Kordon Userbot session successfully created!" });
  console.log("A confirmation message was sent to your 'Saved Messages'.");

  process.exit(0);
}

login();
