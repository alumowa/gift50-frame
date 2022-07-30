const Network = require("Network");
const Storage = require("Storage");

// setTime(0);

const credentials = Storage.readJSON("wifi_credentials.json");
const network = new Network(credentials.ssid, credentials.password);
network.stop();

//wait & start network
setTimeout(() => {
  network.start();
}, 2000);

//Check if NTP syncs
setInterval(() => {
  const now = new Date();
  console.log(`Date: ${now.toString()}`);
}, 1000);
