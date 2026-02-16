// Short Polling 

// -> UI calls the server multiple times in an interval to get the latest data.
// -> It is a simple and easy to implement.


// Long Polling

// -> UI calls the server and waits for the server to respond.
// -> If the server has no data, it will wait for the server to respond.
// -> server will hold the connection open until there is new data.
// -> server send the data at once and then close the connection.


// Server Sent Events (SSE)

// -> UI calls the server and waits for the server to respond.
// -> server can send the data multiple time with single HTTP connection.
// -> Long Live Unidirectional Communication.
// -> Example: Notifications, Feeds, Stock Price Updates, News Updates, monitoring dashboard etc.

// Challanges: Browser Support, No of Connections, Connection timeout, Background Tab behavior , Resource Intensive, Load Balancing, Sticky Connections, Proxy Firewall, Brodcasting.


// WebSockets

// -> Full Duplex Communication.
// -> Long Live Bidirectional Communication.
// -> Example: Chat, Live Updates, etc.

// WebRTC

// -> Full Duplex Communication.
// -> Long Live Bidirectional Communication.
// -> Example: Video Calling, Screen Sharing, etc.


// Webhooks

//-> Real Time Communication.
//-> Event Driven Communication.
//-> Post Rest API Call to the server. Get's trigger on event
//-> Authorization is done using a secret Key.
//=> Verification/Acknowledgment

// Real-life examples:
// - Payment: Stripe/Gateway sends "payment.succeeded" or "charge.refunded" to your URL
// - Orders: Shopify sends "orders/create", "orders/paid" to your backend
// - Git: GitHub sends "push", "pull_request", "issues" for CI/CD, Slack bots
// - Slack/Discord: Incoming webhooks to post messages to a channel
// - CRM: Salesforce/HubSpot notify your app when a lead is created/updated
// - Email: SendGrid/Mailgun send "delivered", "bounced", "opened" events
// - SMS: Twilio sends "message received" or "status callback" to your endpoint

// ========== 1. RECEIVING webhooks (your server is the target) ==========
// External service (e.g. Stripe, GitHub) POSTs to your URL when an event occurs.

/*
// Express example: receive webhook from payment provider
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } })); // need raw body for signature

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.post('/webhooks/stripe', (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case 'payment_intent.succeeded':
      // update order, send confirmation email
      break;
    case 'charge.refunded':
      // update refund in DB
      break;
  }
  res.json({ received: true }); // acknowledgment
});
*/

// ========== 2. SENDING webhooks (your app notifies another system) ==========
// Your server POSTs to a URL provided by another service when something happens in your app.

/*
// Notify external system when order is created (e.g. CRM, analytics, Slack)
const https = require('https');

function sendWebhook(url, payload, secret) {
  const data = JSON.stringify(payload);
  const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'X-Webhook-Signature': hash  // so receiver can verify it's from you
    }
  };
  const req = https.request(url, options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('Webhook delivered:', res.statusCode);
      } else {
        console.warn('Webhook failed:', res.statusCode, body);
      }
    });
  });
  req.on('error', (e) => console.error('Webhook request error:', e.message));
  req.write(data);
  req.end();
}

// Usage: when order is created in your app
// sendWebhook('https://their-server.com/webhook/orders', { event: 'order.created', orderId: 123 }, process.env.WEBHOOK_SECRET);
*/
