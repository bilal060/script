// Test script for the notification API
// Run with: node test-notifications.js

const BASE_URL = 'http://localhost:3000'; // Change this to your server URL

const sampleNotifications = [
  {
    app: "WhatsApp",
    title: "New Message",
    content: "John Doe: Hey, how are you doing?"
  },
  {
    app: "Gmail",
    title: "New Email",
    content: "Meeting reminder for tomorrow at 2 PM"
  },
  {
    app: "Instagram",
    title: "New Follow",
    content: "jane_smith started following you"
  },
  {
    app: "Twitter",
    title: "New Tweet",
    content: "Breaking news: Major announcement coming soon!"
  },
  {
    app: "Slack",
    title: "New Message in #general",
    content: "Team meeting in 5 minutes"
  }
];

async function sendNotification(notification) {
  try {
    const response = await fetch(`${BASE_URL}/api/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification)
    });

    const result = await response.json();
    console.log(`✅ Sent notification from ${notification.app}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send notification from ${notification.app}:`, error.message);
    return null;
  }
}

async function fetchAllNotifications() {
  try {
    const response = await fetch(`${BASE_URL}/api/notifications`);
    const data = await response.json();
    console.log(`📱 Total notifications: ${data.count}`);
    return data.notifications;
  } catch (error) {
    console.error('❌ Failed to fetch notifications:', error.message);
    return [];
  }
}

async function testNotifications() {
  console.log('🚀 Starting notification test...\n');

  // Send sample notifications
  console.log('📤 Sending sample notifications...');
  for (const notification of sampleNotifications) {
    await sendNotification(notification);
    // Wait a bit between notifications
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📥 Fetching all notifications...');
  const notifications = await fetchAllNotifications();
  
  if (notifications.length > 0) {
    console.log('\n📋 Recent notifications:');
    notifications.slice(0, 3).forEach((n, i) => {
      console.log(`${i + 1}. [${n.app}] ${n.title}: ${n.content}`);
    });
  }

  console.log('\n✅ Test completed!');
}

// Run the test
testNotifications().catch(console.error); 