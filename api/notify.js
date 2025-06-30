let notifications = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  const notif = req.body;
  notifications.push({ ...notif, timestamp: new Date().toISOString() });
  console.log('Received:', notif);
  res.status(200).send('Notification received');
}

export { notifications };
