var googlehome = require('google-home-notifier');
var language = 'us'; // if not set 'us' language will be used
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

// googlehome.device('Google-Home-88169b235ce2dc0dbf3969b9afcc16ee', language); // Change to your Google Home name
// or if you know your Google Home IP
googlehome.ip('172.20.10.9', language);

// googlehome.notify('Hey Foo', function(res) {
//    console.log(res);
// });

client.subscribe('chatmessage/#');
client.on('message', function (topic, message) {
	// message is Buffer
	console.log(message.toString());
	googlehome.notify(message.toString(), function(res) {
		console.log(res);
	});
});

app.get('/', function (req, res) {
  client.publish('chatmessage/1', 'Hello world!!', function(err) {
  	if (err) {
  		console.log(JSON.stringify(err.toString()));
  	}
  });
  res.send('Published to mqtt')
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
});
