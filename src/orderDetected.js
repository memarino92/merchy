const { PrismaClient } = require('@prisma/client');
const { postSlackMessage } = require('./slack');

const db = new PrismaClient();

async function orderDetected(data) {
  let idsArray = data.map((a) => a.sale_item_id);

  for (let i = 0; i < idsArray.length; i++) {
    const item = await db.item.findUnique({
      where: {
        sale_item_id: `${idsArray[i]}`,
      },
    });
    if (item === null) {
      const message =
        `New Merch Order!\n\n` +
        `Item:\n${data[i]['item_name']}\n\n` +
        (data[i]['option'] ? `Option:\n${data[i]['option']}\n\n` : '') +
        `Address:\n\n` +
        `${data[i]['ship_to_name']}\n` +
        `${data[i]['ship_to_street']}\n` +
        (data[i]['ship_to_street_2']
          ? `${data[i]['ship_to_street_2']}\n`
          : '') +
        `${data[i]['ship_to_city']}, ${data[i]['ship_to_state']} ${data[i]['ship_to_zip']}\n` +
        `${data[i]['ship_to_country_code']}\n` +
        (data[i]['ship_notes']
          ? `Shipping Notes:\n${data[i]['ship_notes']}`
          : '');
      console.log(message);
      postSlackMessage(message);
      await db.item.create({
        data: {
          ...data[i],
          package_id: `${data[i]['package_id']}`,
          payment_id: `${data[i]['payment_id']}`,
          sale_item_id: `${data[i]['sale_item_id']}`,
          option_id: `${data[i]['option_id']}`,
          order_date: new Date(data[i]['order_date']),
          ship_date: data[i]['ship_date']
            ? new Date(data[i]['ship_date'])
            : null,
        },
      });
    }
  }
}

module.exports = orderDetected;
