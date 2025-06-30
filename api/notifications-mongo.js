import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

// Sample notifications for fallback
const sampleNotifications = [
  {
    id: 'demo-1',
    app: 'WhatsApp',
    title: 'Welcome to Your Notification System!',
    content: 'This is a demo notification. Send real notifications using the API.',
    timestamp: new Date().toISOString()
  },
  {
    id: 'demo-2',
    app: 'Gmail',
    title: 'System Status',
    content: 'Your notification server is running perfectly!',
    timestamp: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: 'demo-3',
    app: 'Instagram',
    title: 'Getting Started',
    content: 'Use curl or the test scripts to send real notifications.',
    timestamp: new Date(Date.now() - 120000).toISOString()
  }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Connect to MongoDB
    const mongoClient = await connectToMongo();
    const database = mongoClient.db('notifications');
    const collection = database.collection('notifications');

    // Handle query parameters
    const { limit, app, sort = 'desc' } = req.query;

    // Build query
    let query = {};
    if (app) {
      query.app = { $regex: app, $options: 'i' }; // Case-insensitive search
    }

    // Build sort
    const sortOrder = sort === 'asc' ? 1 : -1;
    const sortQuery = { timestamp: sortOrder };

    // Build options
    const options = { sort: sortQuery };
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        options.limit = limitNum;
      }
    }

    // Fetch notifications from MongoDB
    const cursor = collection.find(query, options);
    const notifications = await cursor.toArray();

    // Transform MongoDB documents to match our API format
    const transformedNotifications = notifications.map(doc => ({
      id: doc._id.toString(),
      app: doc.app,
      title: doc.title,
      content: doc.content,
      timestamp: doc.timestamp.toISOString()
    }));

    res.status(200).json({
      count: transformedNotifications.length,
      notifications: transformedNotifications,
      message: transformedNotifications.length > 0 
        ? 'Notifications retrieved from MongoDB' 
        : 'No notifications found in MongoDB'
    });

  } catch (error) {
    console.error('Error reading notifications from MongoDB:', error);
    
    // Fallback to demo notifications if MongoDB fails
    res.status(200).json({
      count: sampleNotifications.length,
      notifications: sampleNotifications,
      message: 'Demo notifications (MongoDB not configured)'
    });
  }
} 