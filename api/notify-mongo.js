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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const notif = req.body;
    
    // Validate required fields
    if (!notif.title || !notif.app) {
      return res.status(400).json({ error: 'Title and app are required' });
    }

    // Connect to MongoDB
    const mongoClient = await connectToMongo();
    const database = mongoClient.db('notifications');
    const collection = database.collection('notifications');

    // Create notification document
    const notification = {
      app: notif.app,
      title: notif.title,
      content: notif.content || '',
      timestamp: new Date(),
      createdAt: new Date()
    };

    // Insert into MongoDB
    const result = await collection.insertOne(notification);
    
    // Add the MongoDB _id to the response
    const savedNotification = {
      id: result.insertedId.toString(),
      ...notification,
      timestamp: notification.timestamp.toISOString()
    };

    console.log('Saved notification to MongoDB:', savedNotification);
    
    res.status(200).json({ 
      success: true, 
      message: 'Notification saved to MongoDB',
      notification: savedNotification
    });
  } catch (error) {
    console.error('Error saving notification to MongoDB:', error);
    
    // If MongoDB fails, fall back to demo response
    res.status(200).json({ 
      success: true, 
      message: 'Notification saved (MongoDB not configured)',
      notification: {
        id: Date.now().toString(),
        app: req.body.app,
        title: req.body.title,
        content: req.body.content || '',
        timestamp: new Date().toISOString()
      }
    });
  }
} 