# AI-Powered Product Identification Platform

An advanced AI-powered product identification platform that transforms visual product recognition through cutting-edge OCR and machine learning technologies.

## Features

- AI-powered product recognition
- Guest user functionality
- User authentication and account management
- Product database with search capabilities
- Demographic data visualization
- Responsive UI with dark/light mode

## Docker Setup

This application can be run using Docker, which makes it easy to deploy in any environment without worrying about dependencies.

### Prerequisites

- Docker and Docker Compose installed on your system
- OpenAI API key (for AI-powered identification)

### Running with Docker

1. Clone this repository
2. Create a `.env` file in the root directory with your environment variables:

```
# Required
DATABASE_URL=postgres://postgres:postgres@db:5432/postgres
SESSION_SECRET=your_session_secret
OPENAI_API_KEY=your_openai_api_key

# Optional - for email functionality
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@example.com
```

3. Build and start the containers:

```bash
docker-compose up -d
```

4. Access the application at http://localhost:4060

### Database Migration

The first time you run the application, you'll need to run the migrations:

```bash
docker-compose exec app npm run db:push
```

## Development

### Requirements

- Node.js 20+
- PostgreSQL

### Setup

1. Install dependencies: `npm install`
2. Create `.env` file with required environment variables
3. Run migrations: `npm run db:push`
4. Start the dev server: `npm run dev`

## License

MIT