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
      // client.publish("vehicledata", "123456789");
    }
  });
});

function mchain_create_stream(message) {
//var message = JSON.parse(mess)
console.log("IN CREATE STREAM: ",message.VIN)
  multichain.create(
    {
      type: "stream",
      name: message.VIN,
      open: false,
      details: {}
    },
    (err, tx) => {
      if (err) {
        console.log("in creation error: ",err);
      }
      console.log(tx);
    }
  );
}
function mchain_publish(message) {
//	mchain_create_stream(message);

var d = JSON.parse(message)

  multichain.publish(
    { stream: d.VIN, key: "test", data:new Buffer( message).toString("hex") },
    (err, tx) => {
      if (err) {
        console.log(err);
        console.log(typeof err.code);
        if (err.code == -705 || err.code == -708) {
          mchain_create_stream(d);
          mchain_publish(d);
        }else{
		console.log("in else")
	}
      }
      console.log(tx);
    }
  );
}

client.on("message", function(topic, message) {
  // message is Buffer
  console.log(typeof message);
  console.log(message.toString("utf8"));
mchain_publish(message.toString("utf8"));
 // mchain_publish(JSON.parse(message.toString("utf8")));
});

multichain.getInfo((err, info) => {
  if (err) {
    console.log(err);
  }

  console.log(info);
});

multichain.listStreams(
  {
    stream: "1234567890",
    verbose: false,
    count: 500,
    start: 0
  },
  (err, tx) => {
    if (err) {
      console.log("list:",err);
    }
    console.log("list :",tx);
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
