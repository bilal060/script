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
      return res.status(200).json([]);
    }

    // Read and parse notifications
    const data = fs.readFileSync(filePath, 'utf8');
    let notifications = JSON.parse(data);

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
      notifications
    });
  } catch (error) {
    console.error('Error reading notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
