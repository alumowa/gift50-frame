const Wifi = require("Wifi");

class Network {
  constructor(ssid, password) {
    this.ssid = ssid;
    this.options = {
      authMode: "wpa2",
      password: password,
      channel: 11,
    };
  }

  start() {
    return Wifi.startAP(this.ssid, this.options, this.onConnect);
  }

  onConnect(err) {
    if (err) {
      console.log(`Got error: ` + err);
      return;
    }

    console.log("Access point started");
  }
}

exports = Network;
