var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://18.220.57.224");

var multichain = require("multichain-node")({
  port: 7178,
  host: "127.0.0.1",
  user: "multichainrpc",
  pass: "HKMWUdoPMQq5RLDiKRgpdXQSpwxGr5Z7oaLcMthEty5t"
});

client.on("connect", function() {
  client.subscribe("vehicledata", function(err) {
    if (!err) {
      client.publish("vehicledata", "123456789");
    }
  });
});

client.on("message", function(topic, message) {
  // message is Buffer
	console.log(typeof(message))
  	console.log(message.toString("utf8"));
  multichain.publish(
    { stream: message.VIN, key: "test", data:message.toString("hex")},

 (err, tx) => {
      if (err) {
        console.log(err);
	if(err.code == -705){
		multichain.create(
  {
    type: "stream",
    name: "test_stream",
    open: false,
    details: {}
  },
  (err, tx) => {
    if (err) {
      console.log(err);
    }
    console.log(tx);
  }
);

	}
      }
      console.log(tx);
    }
  );
  //   client.end();
});

multichain.getInfo((err, info) => {
  if (err) {
    console.log(err);
  }

  console.log(info);
});
multichain.create(
  {
    type: "stream",
    name: "test_stream",
    open: false,
    details: {}
  },
  (err, tx) => {
    if (err) {
      console.log(err);
    }
    console.log(tx);
  }
);

multichain.listStreams(
  {
    stream: "*",
    verbose: false,
    count: 5,
    start: 0
  },
  (err, tx) => {
    if (err) {
      console.log(err);
    }
    console.log(tx);
  }
);

// multichain.publish(
//   { stream: "test_stream", key: "test", data: "abcd" },
//   (err, tx) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(tx);
//   }
// );
