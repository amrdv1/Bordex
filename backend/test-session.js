const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

async function testSession() {
  const sessionStr = "1AgAOMTQ5LjE1NC4xNjcuNTEBu6JQ8W0afj1+Vtmyf2iD/XrPV4yja5pubhqE+6VMEDxt+K9I2NASrksmZM2J2If9yZZHSf4UTIw3mky7W1LeoTJxU/AHPknvkZAcIYeqXnbocER0rWNOIWPDFT3q/+OiPRidzA78KJsR4csfChvaGJPZBO/BhLxECIBjoRbNovoP4Ny9GIqmpVKYnMmOa2s72tJapZ1+zfDs5J+RdJWfFSvPTwOM705dRSBUyFNIBxmUMAfrmc9RZPDCiGd1CMSInH7jWlYoxLpNXEUsss+ntFlTT81iRrWHpxYea73GLFsxWYs2ua+j8HnCUr4uGrEYSkBeW9uJEug4t6W6LesV8ZQ=";
  
  // Try with generic ones or dummy if it works
  const apiId = 2040;
  const apiHash = "b18441a1ff607e10a989891a5462e627"; // common dummy ones
  
  const client = new TelegramClient(new StringSession(sessionStr), apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    await client.connect();
    console.log("Connected successfully!");
    
    // Test getting messages from nakordonieu
    const messages = await client.getMessages("@nakordonieu", { limit: 1 });
    if (messages.length > 0) {
      console.log("Last message text:");
      console.log(messages[0].text);
    } else {
      console.log("No messages found.");
    }
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.disconnect();
  }
}

testSession();
