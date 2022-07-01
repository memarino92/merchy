require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const orderDetected = require('./orderDetected');
const BandcampClient = require('./bandcamp');

const bandcampClientId = process.env.BANDCAMP_CLIENT_ID;
const bandcampClientSecret = process.env.BANDCAMP_CLIENT_SECRET;
const bandcampBandId = process.env.BANDCAMP_BAND_ID;

const minutes = process.env.INTERVAL_IN_MINUTES || 1;
const interval = minutes * 60 * 1000;

const client = new BandcampClient(bandcampClientId, bandcampClientSecret);

const db = new PrismaClient();

const checkForOrders = async (client) => {
  const orders = await client.getOrders(bandcampBandId);
  if (orders?.success === true) {
    console.log(
      `${new Date().toISOString()} Successfully retrieved order list, ${
        orders.items.length
      } order(s) found`
    );
    if (orders.items.length === 0 || orders.items === undefined) return;
    orderDetected(orders.items)
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await db.$disconnect();
      });
  } else {
    console.log(
      `${new Date().toISOString()} Something went wrong retrieving order list`
    );
  }
};

const main = async () => {
  console.log(
    `${new Date().toISOString()} Checking Bandcamp API for new orders...`
  );
  await checkForOrders(client);
  setInterval(() => {
    console.log(
      `${new Date().toISOString()} Checking Bandcamp API for new orders...`
    );
    checkForOrders(client);
  }, interval);
};

main();
