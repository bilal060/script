import fs from 'fs';
import path from 'path';

const filePath = path.resolve('/tmp', 'notifications.json');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('No notifications file found, returning empty array');
      return res.status(200).json({
        count: 0,
        notifications: [],
        message: 'No notifications found (file does not exist)'
      });
    }

    // Read and parse notifications
    const data = fs.readFileSync(filePath, 'utf8');
    let notifications = [];
    
    try {
      notifications = JSON.parse(data);
      if (!Array.isArray(notifications)) {
        notifications = [];
      }
    } catch (parseError) {
      console.error('Error parsing notifications file:', parseError);
      notifications = [];
    }

    // Handle query parameters
    const { limit, app, sort = 'desc' } = req.query;

    // Filter by app if specified
    if (app) {
      notifications = notifications.filter(n => 
        n.app && n.app.toLowerCase().includes(app.toLowerCase())
      );
    }

    // Sort notifications (newest first by default)
    notifications.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        notifications = notifications.slice(0, limitNum);
      }
    }

    res.status(200).json({
      count: notifications.length,
      notifications,
      message: notifications.length > 0 ? 'Notifications retrieved successfully' : 'No notifications found'
    });
  } catch (error) {
    console.error('Error reading notifications:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to read notifications',
      count: 0,
      notifications: []
    });
  }
}
