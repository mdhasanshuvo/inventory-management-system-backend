# Smart Inventory & Order Management System - Backend

Production-focused backend API for inventory, orders, stock workflows, restock queue, dashboard insights, and activity logs.

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- express-validator
- Swagger (swagger-jsdoc + swagger-ui-express)

## Features
- Email/password signup and login with bcrypt hashing
- JWT protected APIs
- Category management (unique category names)
- Product management with stock and status rules
- Order management with stock deduction and conflict detection
- Restock queue auto-sync with priority levels
- Dashboard metrics (orders, revenue, low stock)
- Activity log tracking (latest actions)

## Architecture
Simple MVC + Services:
- `src/routes` for endpoint mapping
- `src/controllers` for request/response flow
- `src/services` for business logic
- `src/models` for schema + validation
- `src/middlewares` for auth, validation, and error handling

## Setup
1. Install dependencies:
   - `npm install`
2. Configure environment:
   - copy `.env.example` to `.env`
3. Run development server:
   - `npm run dev`
4. Run production server:
   - `npm start`

## Environment Variables
- `PORT`
- `MONGO_URI`
- `DB_NAME`
- `JWT_SECRET`
- `SERVER_URL`

## API Base URL
- Local: `http://localhost:5000/api`

## Swagger Documentation
- Local Swagger UI: `http://localhost:5000/api-docs`

## Deployment (Vercel)
1. Push repository to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.example`
4. Deploy
5. `vercel.json` routes all requests through `api/index.js`

## API Modules
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/categories`
- `GET /api/categories`
- `POST /api/products`
- `PUT /api/products/:id`
- `GET /api/products`
- `POST /api/orders`
- `GET /api/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/restock`
- `POST /api/restock/restock`
- `DELETE /api/restock/:id`
- `GET /api/dashboard`
- `GET /api/activity`

## Notes
- Keep `.env` private and never commit credentials.
- Use secure JWT secret in production.
