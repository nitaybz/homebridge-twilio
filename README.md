# homebridge-twilio

Homebridge plugin to make phone calls from a server using a static message.
This plugin uses Twilio api, which is a paid service at a fair price - [www.Twilio.com](https://www.twilio.com).

Very good use for homekit alarms and sensor, you can set an automation to call your phone if your alarm is triggered, there is a water leak or smoke detected.

# Twilio configuraions
To use this plugin, you need to signup to their website and get a phone number from their service it will use you in the config as **twilioNumber**.

Then, create a 'TwiML' from the Runtime menu under 'TwiML Bin', this is an xml format file which include the content of the call you want to make. more information can be found here: [https://www.twilio.com/docs/api/twiml](https://www.twilio.com/docs/api/twiml).
Another option is to store the xml file on your own servers with external access.

XML example:
```
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  	<Say voice="alice" loop="0" language="en-gb"> The Alarm is Triggered!
  	</Say>
</Response>
```

The link to your TwilML will be used in the config as **xmlUrl**.

the **accountSid** and **authToken** can be retrieved from [https://www.twilio.com/console/account/settings](https://www.twilio.com/console/account/settings)

After you set all of those, you can move forward to installing the plugin on homebridge.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-twilio
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

#### Please read carefully Twilio configurations first

Config.json sample:

 ```
"accessories": [
        {
            "accessory": "Twilio",
            "name": "Call David",
            "accountSid": "4352435f45f423456d652643dxre",
            "authToken": "RVGH54CG45G5TG354GRT45T45G4G", 
            "xmlUrl": "https://handler.twilio.com/twiml/32JKN23ljknl23rl23",
            "toNumber": "+445287563029",
            "twilioNumber": "+445287562349",
            "repeatCall": false
        }
    ]

```

* `"repeatCall": true` will make a second call if there was no answer from the recipient (voice machines will be marked as "answerd")
