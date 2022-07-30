const Wifi = require("Wifi");
const Http = require("http");

class Network {
  constructor(ssid, password) {
    this.ssid = ssid;
    this.password = password;

    //Log interesting events
    ["associated", "dhcp_timeout", "disconnected"].forEach((event) => {
      Wifi.on(event, this.logGenericWifiEvent.bind(this, event));
    });

    Wifi.on("connected", this.onConnect.bind(this));
  }

  start() {
    const options = {
      password: this.password,
      dnsServers: ["8.8.8.8", "1.1.1.1"], //Use GOOG & NET Dns
    };

    //Not using connect callback in the connect call
    //because we have a listener for Wifi.connected
    return Wifi.connect(this.ssid, options);
  }

  stop(callback) {
    return Wifi.disconnect(callback);
  }

  /**
   * Wifi.connect callback
   */
  onConnect(details) {
    console.log(`Wifi connected: ${JSON.stringify(details)}`);
    this.updateTime((error, time) => {
      if (error) {
        console.log(error);
        return;
      }

      if (time > 0) {
        console.log("Setting system time to: " + new Date(time).toString());
        setTime(time / 1000);
      }

      //Stop Wifi upon time refresh, essentially this only happens
      //on boot up.
      this.stop();
    });
  }

  /**
   * Grab current time from network and use it
   * to update system time.
   */
  updateTime(callback) {
    //Start NTP server - it's okay to just have this
    //on in the background. tz_offset for DE is +2.
    //Wifi.setSNTP("pool.ntp.org", "+2");

    //Okay... no go on NTP because upon time sync it does not
    //update JS engine time value which causes all intervals/timers
    //to try and "catch up" (http://forum.espruino.com/conversations/330214/).
    //Implementing a work around by grabbing current time
    //from an HTTP response header, using google here because their
    //response size is pretty small (< 7kb). Lack of https is not
    //a factory here.
    const endpoint = "http://www.google.com";
    Http.get(endpoint, (response) => {
      //GOOG always has this Date key in response headers? ;)
      if ("Date" in response.headers) {
        const now = new Date(response.headers.Date);
        const month = now.getMonth();
        const time = now.getTime();

        //Accomodate DST between march & oct by adding an extra hour
        // if (month > 2 && month <= 9) time += 1000 * 3600;
        if (time > 0) {
          return callback(null, time);
        } else {
          return callback("Invalid date received");
        }
      }

      return callback("No valid date in header response");
    });
  }

  logGenericWifiEvent(event, details) {
    console.log(`Wifi ${event}: ${JSON.stringify(details)}`);
  }
}

exports = Network;
