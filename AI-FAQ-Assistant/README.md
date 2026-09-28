# AI FAQ Assistant API

AI-powered FAQ and customer support automation backend, built with Node.js, Express, MongoDB/Mongoose, JWT auth, and Google Gemini AI.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
3. Start MongoDB locally, or point `MONGO_URI` at an Atlas cluster.
4. Run in dev mode:
   ```bash
   npm run dev
   ```

## Endpoints

| Method | Route                  | Access  | Description                          |
|--------|-------------------------|---------|---------------------------------------|
| POST   | /api/auth/register      | Public  | Register a new user                   |
| POST   | /api/auth/login         | Public  | Log in, receive a JWT                 |
| GET    | /api/auth/profile       | Private | Get logged-in user's profile          |
| GET    | /api/faqs               | Public  | List all FAQs                         |
| GET    | /api/faqs/search?q=     | Public  | Keyword search across FAQs            |
| GET    | /api/faqs/:id           | Public  | Get a single FAQ                      |
| POST   | /api/faqs                | Private | Create a new FAQ                      |
| PUT    | /api/faqs/:id           | Private | Update an FAQ (author or admin only)  |
| DELETE | /api/faqs/:id           | Private | Delete an FAQ (author or admin only)  |
| POST   | /api/ai/answer          | Private | Generate an AI answer to a question   |
| POST   | /api/ai/generate-faq    | Private | Generate a full FAQ from a topic      |

Private routes require an `Authorization: Bearer <token>` header.
