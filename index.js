require('dotenv').config();
const { postSlackMessage } = require('./slack');
const BandcampClient = require('./bandcamp');

const main = async () => {
  let client = new BandcampClient();
  console.log(await client.getOrders(process.env.BANDCAMP_BAND_ID));
};
main();
