require('dotenv').config();
const { postSlackMessage } = require('./slack');
const BandcampClient = require('./bandcamp');

let client = new BandcampClient();

const main = async (client) => {
  console.log(await client.getOrders(process.env.BANDCAMP_BAND_ID));
};

let minutes = 0.25;

let interval = minutes * 60 * 1000;

setInterval(() => {
  console.log('Checking...');
  main(client);
}, interval);
