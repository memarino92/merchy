const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';

async function postSlackMessage(messageText) {
  let res = await fetch(SLACK_WEBHOOK_URL, {
    body: JSON.stringify({ text: messageText }),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (res.ok) console.log('Slack message sent!');
  else console.log('Something went wrong - slack message not sent');
}

module.exports = { postSlackMessage };
