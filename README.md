# Mobile Notifications Server

A simple server to save and retrieve mobile notifications with a real-time web interface.

## Features

- ✅ Save mobile notifications with persistent storage
- ✅ Fetch notifications with filtering and sorting
- ✅ Real-time web interface with auto-refresh
- ✅ Modern, responsive UI
- ✅ Query parameters for filtering and limiting results
- ✅ Error handling and validation

## Quick Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

### Option 2: Deploy from Local Directory

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? `[Select your account]`
   - Link to existing project? `N`
   - What's your project's name? `[Enter name or press Enter for default]`
   - In which directory is your code located? `./` (or press Enter)
   - Want to override the settings? `N`

5. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Option 3: One-Command Deploy

```bash
# Install Vercel CLI and deploy in one go
npm install -g vercel && vercel --yes
```

## API Endpoints

### POST `/api/notify`
Save a new notification.

**Request Body:**
```json
{
  "app": "WhatsApp",
  "title": "New Message",
  "content": "John Doe: Hey, how are you doing?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification saved",
  "notification": {
    "id": "1703123456789",
    "app": "WhatsApp",
    "title": "New Message",
    "content": "John Doe: Hey, how are you doing?",
    "timestamp": "2023-12-21T10:30:56.789Z"
  }
}
```

### GET `/api/notifications`
Fetch all notifications with optional filtering.

**Query Parameters:**
- `app` - Filter by app name (partial match)
- `sort` - Sort order: `desc` (newest first) or `asc` (oldest first)
- `limit` - Limit number of results

**Examples:**
```
GET /api/notifications
GET /api/notifications?app=WhatsApp
GET /api/notifications?sort=asc&limit=10
GET /api/notifications?app=Gmail&sort=desc&limit=5
```

**Response:**
```json
{
  "count": 3,
  "notifications": [
    {
      "id": "1703123456789",
      "app": "WhatsApp",
      "title": "New Message",
      "content": "John Doe: Hey, how are you doing?",
      "timestamp": "2023-12-21T10:30:56.789Z"
    }
  ]
}
```

## Web Interface

Visit `/view.html` to see a real-time interface that:
- Auto-refreshes every 3 seconds
- Allows filtering by app name
- Supports sorting (newest/oldest first)
- Limits results
- Shows notification count
- Has a modern, mobile-friendly design

## Setup

### Local Development

1. **Install dependencies (if needed):**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   vercel dev
   ```

3. **Access your app:**
   - API: `http://localhost:3000/api/notify`
   - Web Interface: `http://localhost:3000/view.html`

### Production Deployment

After deploying to Vercel, you'll get URLs like:
- `https://your-project.vercel.app/api/notify`
- `https://your-project.vercel.app/view.html`

## Testing

### Test with the included script:

1. **Update the BASE_URL in test-notifications.js:**
   ```javascript
   const BASE_URL = 'https://your-project.vercel.app'; // Your Vercel URL
   ```

2. **Run the test:**
   ```bash
   node test-notifications.js
   ```

### Test manually with curl:

```bash
# Send a notification
curl -X POST https://your-project.vercel.app/api/notify \
  -H "Content-Type: application/json" \
  -d '{"app":"Test","title":"Hello","content":"World"}'

# Fetch notifications
curl https://your-project.vercel.app/api/notifications

# Fetch with filters
curl "https://your-project.vercel.app/api/notifications?app=Test&limit=5"
```

## Mobile Integration

To integrate with mobile apps, send POST requests to `/api/notify` with the notification data. The system accepts:

- `app` (required) - The app name
- `title` (required) - Notification title
- `content` (optional) - Notification content/body
- Any additional fields will be preserved

## Vercel Configuration

The `vercel.json` file is already configured with:
- API routes for `/api/notify` and `/api/notifications`
- Node.js runtime for the API functions
- Proper routing configuration

## Storage

Notifications are stored in a JSON file at `/tmp/notifications.json` on Vercel's serverless functions. This provides:
- Persistence across function invocations
- Simple, human-readable format
- No database setup required

**Note:** Vercel's `/tmp` directory is ephemeral and may be cleared between deployments. For production use, consider using a database.

## Useful Vercel Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# List deployments
vercel ls

# View deployment logs
vercel logs

# Remove deployment
vercel remove

# Update environment variables
vercel env add

# View project info
vercel info
```

## Limitations

- Storage is limited to Vercel's `/tmp` directory (ephemeral)
- No authentication/authorization
- No notification deletion (yet)
- File-based storage (not suitable for high-volume production)

## Future Enhancements

- [ ] Add authentication
- [ ] Add notification deletion
- [ ] Add database storage option (Vercel Postgres, MongoDB, etc.)
- [ ] Add notification categories
- [ ] Add push notifications
- [ ] Add notification search
- [ ] Add notification statistics

## License

MIT 