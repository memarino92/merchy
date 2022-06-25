require('dotenv').config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';

async function postSlackMessage() {
  let res = await fetch(SLACK_WEBHOOK_URL, {
    body: JSON.stringify({ text: 'More testing' }),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (res.ok) console.log('Success!');
  else console.log('Something went wrong');
}
