const { PrismaClient } = require('@prisma/client');
const data = require('./data');

const db = new PrismaClient();

async function main() {
  //   await db.item.create({ data: item });
  //   let items = await db.item.findMany();
  //   console.log(items);
  //   const foundItem = await db.item.findUnique({
  //     where: {
  //       sale_item_id: item.sale_item_id,
  //     },
  //   });
  //   console.log(foundItem);

  let idsArray = data.map((a) => a.sale_item_id);

  for (let i = 0; i < idsArray.length; i++) {
    const item = await db.item.findUnique({
      where: {
        sale_item_id: `${idsArray[i]}`,
      },
    });
    if (item === null) {
      console.log(
        `New Merch Order!\nOrder Details:\n` +
          `Item:\n${data[i]['item_name']}\n` +
          (data[i]['option'] ? `Option: ${data[i]['option']}\n` : '') +
          `Address:\n` +
          `${data[i]['ship_to_name']}\n` +
          `${data[i]['ship_to_street']}\n` +
          (data[i]['ship_to_street_2']
            ? `${data[i]['ship_to_street_2']}\n`
            : '') +
          `${data[i]['ship_to_city']}, ${data[i]['ship_to_state']} ${data[i]['ship_to_zip']}\n` +
          `${data[i]['ship_to_country_code']}\n` +
          (data[i]['ship_notes']
            ? `Shipping Notes:\n${data[i]['ship_notes']}`
            : '')
      );
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
    } else {
      //console.log(`Found Sale item id ${idsArray[i]}`);
    }
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await db.$disconnect();
  });
