var Service, Characteristic;


module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-twilio", "Twilio", TwilioSwitch);
}


function TwilioSwitch(log, config) {
    this.log = log;

    // account info
    this.accountSid = config["accountSid"];
    this.authToken = config["authToken"];
    this.xmlUrl = config["xmlUrl"];
    this.toNumber = config["toNumber"];
    this.twilioNumber = config["twilioNumber"];
    this.repeatCall = config["repeatCall"];
    this.name = config["name"];
    this.client = require('twilio')(this.accountSid, this.authToken);
}

TwilioSwitch.prototype = {
    
    getServices: function () {
        var informationService = new Service.AccessoryInformation();

        informationService
                .setCharacteristic(Characteristic.Manufacturer, "Twilio")
                .setCharacteristic(Characteristic.Model, "Make a Call")
                .setCharacteristic(Characteristic.SerialNumber, "api");

        this.switchService = new Service.Switch(this.name);
        this.switchService
                .getCharacteristic(Characteristic.On)
                .on('get', this.getPowerState.bind(this))
                .on('set', this.setPowerState.bind(this));

    
        return [this.switchService, informationService];
    },

    getPowerState: function (callback) {
        callback(null, false);
    },

    setPowerState: function(powerOn, callback) {
        var self = this;
        if (powerOn){
            self.client.calls.create({
                url: self.xmlUrl,
                to: self.toNumber,
                from: self.twilioNumber,
            }, function(err, call) {
                if (err){
                    self.log("Could not make the call to " + self.toNumber + " !  - with Error:")
                    self.log(err);
                    self.switchService.setCharacteristic(Characteristic.On, false);
                } else{
                    console.log("Call to " + self.toNumber + " Succeeded!");
                    self.switchService.setCharacteristic(Characteristic.On, false);
                    if (self.repeatCall){
                        var repeat = setInterval(function(){
                            self.client.calls(call.sid)
                                .fetch()
                                .then((callDetails) => {
                                    switch (callDetails.status){
                                        case "queued":
                                            break;
                                        case "ringing":
                                            break;
                                        case "in-progress":
                                            clearInterval(repeat);
                                            break;
                                        case "completed":
                                            clearInterval(repeat);
                                            break;
                                        default:
                                            clearInterval(repeat);
                                            self.log("No answer from " + self.toNumber + " - trying one more time...");
                                            self.client.calls.create({
                                                url: self.xmlUrl,
                                                to: self.toNumber,
                                                from: self.twilioNumber,
                                            }, function(err, call) {
                                                if (err){
                                                    self.log("Could not make the call to " + self.toNumber + " !  - with Error:")
                                                    self.log(err);
                                                } else{
                                                    console.log("Call to " + self.toNumber + " Succeeded!");
                                                }
                                            })
                                            break;
                                    }
                                });
                        }, 3000)
                    }
                    
                    
                }
            });

        }
        callback();
    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    }

    
};
