require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const orderDetected = require('./orderDetected');
const BandcampClient = require('./bandcamp');

let client = new BandcampClient();

const db = new PrismaClient();

const checkForOrders = async (client) => {
  let orders = await client.getOrders(process.env.BANDCAMP_BAND_ID);
  if (orders?.success === true) {
    if (orders.items.length === 0 || orders.items === undefined) return;
    orderDetected(orders.items)
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await db.$disconnect();
      });
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
