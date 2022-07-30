const EventGenerator = require("EventGenerator");
const Display = require("Display");
const Storage = require("Storage");
const Network = require("Network");
const Util = require("Util");

const TickRateMS = 5 * 1000;
const BootTime = Date.now();

E.setTimeZone(2);
//Init i2c buses
I2C1.setup({ scl: D32, sda: D33 });
I2C2.setup({ scl: D26, sda: D27 });

//Initialize displays
const kristina = new Display(I2C1, 0x3c);
kristina.connect();

const phillip = new Display(I2C2, 0x3c);
phillip.connect();

const credentials = Storage.readJSON("wifi_credentials.json");
const network = new Network(credentials.ssid, credentials.password);
network.start();

function renderDaily() {
  //Calculate days to wedding and pull fetch matching data
  const weddingTime = 1664488800000;
  const daysUntil = Math.ceil((weddingTime - Date.now()) / (86400 * 1000));
  let prefix;
  if (daysUntil >= 50) {
    prefix = 1;
  } else {
    prefix = 51 - daysUntil;
  }

  const data = Storage.readJSON(`${prefix}.json`);
  kristina.write(data.k);
  phillip.write(data.p);
}

function renderRandom() {
  const randomText = Storage.readJSON(`random.json`);
  kristina.write(randomText[Math.floor(Math.random() * randomText.length)]);
  phillip.write(randomText[Math.floor(Math.random() * randomText.length)]);
}

/**
 * Render a QR on one display while the other
 * displays a random quip.
 */
function renderQr() {
  const staticMsg = "Hatten wir den schon?";
  const qrCount = 20;
  const qrImage = Storage.readJSON(
    `qr${Util.randomIndexInRange(1, qrCount)}.json`
  );
  if (Math.round(Math.random())) {
    kristina.drawQr(qrImage.data);
    phillip.write(staticMsg);
  } else {
    phillip.drawQr(qrImage.data);
    kristina.write(staticMsg);
  }
}

//Initialize clock & configure event probabilities
const events = new EventGenerator(TickRateMS);
events.on("tick", (event) => {
  // console.log(`Minutes since boot ${EventGenerator.DaysSinceBoot(BootTime)}`);
  const p = process.memory(false);
  const now = new Date();
  console.log(`${now.toString()}: ${JSON.stringify(p)}`);

  switch (event) {
    case events.TYPES.DAILY:
      renderDaily();
      break;

    case events.TYPES.RANDOM:
      renderRandom();
      break;

    case events.TYPES.HEARTS:
      [kristina, phillip].forEach((display) => display.startHearts());
      break;

    case events.TYPES.QR:
      renderQr();
      break;
      qr;
  }
});
