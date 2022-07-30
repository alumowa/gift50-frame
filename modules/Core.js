const EventGenerator = require("EventGenerator");
const Display = require("Display");
const Storage = require("Storage");
const Network = require("Network");
const Util = require("Util");

class Core {
  constructor(tickRateMs) {
    this.bootTime = Date.now();
    this.displays = {};
    this.network;

    E.setTimeZone(2); //Timezone set to CEET (+2)

    //Initialize event tick generator
    this.eventGenerator = new EventGenerator(tickRateMs);
    this.eventGenerator.on("tick", this.onTick.bind(this));

    //Wifi setup
    const credentials = Storage.readJSON("wifi_credentials.json");
    this.network = new Network(credentials.ssid, credentials.password);
  }

  //Configure pins for an i2c bus
  i2cSetup(i2cBus, scl, sda) {
    i2cBus.setup({ scl: scl, sda: sda });
  }

  //Associates a display to an i2c bus and sets address
  addDisplay(name, bus, address) {
    const display = new Display(bus, address);

    //This .connect call is async but we can go ahead with setup
    display.connect();
    this.displays[name] = display;
    return display;
  }

  //Connects to network to attempt a system time update and
  //starts the event generator
  start() {
    this.network.on("ready", () => {
      //Once network is connected, we can start our
      //event generator.
      this.eventGenerator.startTick();
    });
    this.network.start();
  }

  onTick(event) {
    // console.log(`Minutes since boot ${EventGenerator.DaysSinceBoot(BootTime)}`);
    const p = process.memory(false);
    const now = new Date();
    console.log(`${now.toString()}: ${JSON.stringify(p)}`);

    const events = this.eventGenerator;

    switch (event) {
      case events.TYPES.DAILY:
        this.renderDaily();
        break;

      case events.TYPES.RANDOM:
        this.renderRandom();
        break;

      case events.TYPES.HEARTS:
        this.renderHearts();
        break;

      case events.TYPES.QR:
        this.renderQr();
        break;
        qr;
    }
  }

  renderDaily() {
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
    this.displays.kristina.write(data.k);
    this.displays.phillip.write(data.p);
  }

  renderRandom() {
    const randomText = Storage.readJSON(`random.json`);
    this.displays.kristina.write(
      randomText[Math.floor(Math.random() * randomText.length)]
    );
    this.displays.phillip.write(
      randomText[Math.floor(Math.random() * randomText.length)]
    );
  }

  /**
   * Render a QR on one display while the other
   * displays a random quip.
   */
  renderQr() {
    const staticMsg = "Hatten wir den schon?";
    const qrCount = 20;
    const qrImage = Storage.readJSON(
      `qr${Util.randomIndexInRange(1, qrCount)}.json`
    );
    if (Math.round(Math.random())) {
      this.displays.kristina.drawQr(qrImage.data);
      this.displays.phillip.write(staticMsg);
    } else {
      this.displays.phillip.drawQr(qrImage.data);
      this.displays.kristina.write(staticMsg);
    }
  }

  renderHearts() {
    this.displays.kristina.startHearts();
    this.displays.phillip.startHearts();
  }
}

exports = Core;
