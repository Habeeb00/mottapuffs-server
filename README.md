# Mottapuffs Server

Admin API server for the Mottapuffs application.

## Features

- Admin authentication with token
- Update global puff counts (chicken, motta, meat)
- Health check endpoint
- CORS enabled for frontend integration

## Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `ADMIN_TOKEN` - Custom admin token for authentication
- `PORT` - Server port (default: 4000)

## Endpoints

- `GET /` - Server info and available endpoints
- `GET /health` - Health check
- `POST /api/stats/set` - Update puff counts (requires admin token)

## Deployment

### Vercel

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Railway

1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Local Development

```bash
npm install
npm run dev
```

## Usage

Send POST request to `/api/stats/set` with:

- Header: `Authorization: Bearer your_admin_token`
- Body: `{"chicken": 10, "motta": 20, "meat": 15}`
