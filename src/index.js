require('dotenv').config();
const BandcampClient = require('./bandcamp');

let client = new BandcampClient();

const checkForOrders = async (client) => {
  let orders = await client.getOrders(process.env.BANDCAMP_BAND_ID);
  if (orders?.success === true) {
    if (orders.items.length === 0) return;
    orderDetected(orders.items);
  } else {
    console.log('Something went wrong');
  }
};

let minutes = 0.5;
let interval = minutes * 60 * 1000;

setInterval(() => {
  console.log('Checking...');
  checkForOrders(client);
}, interval);
