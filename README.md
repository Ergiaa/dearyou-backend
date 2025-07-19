# DearYou Backend

A secure and scalable backend for DearYou - A platform for writing and sharing emotional letters. Built with Express.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **User Authentication**
  - Secure registration and login
  - JWT-based authentication
  - Password hashing with bcrypt
  - Protected routes with middleware

- **Letter Management**
  - Create, read, update, and delete letters
  - Public/private visibility control
  - Unique slugs for sharing
  - Owner-only modifications

- **Security**
  - UUIDv7 for time-sortable IDs
  - JWT token authentication
  - Password hashing
  - Protected routes
  - Input validation

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, bcrypt
- **Development**: Docker (for local database)

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (via Docker)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dearyou-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```
   # Database Configuration
   DB_USER=dearyou
   DB_PASSWORD=your_password
   DB_NAME=dearyou
   DB_PORT=5432
   DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ```

4. **Start the database**

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication

#### Register a new user

\`\`\`
POST /api/auth/register
Content-Type: application/json

{
"email": "user@example.com",
"password": "secure_password",
"name": "John Doe" // optional
}
\`\`\`

#### Login

\`\`\`
POST /api/auth/login
Content-Type: application/json

{
"email": "user@example.com",
"password": "secure_password"
}
\`\`\`

#### Get user profile

\`\`\`
GET /api/auth/profile
Authorization: Bearer <token>
\`\`\`

#### Update password

\`\`\`
POST /api/auth/update-password
Authorization: Bearer <token>
Content-Type: application/json

{
"oldPassword": "current_password",
"newPassword": "new_password"
}
\`\`\`

## 📁 Project Structure

```
src/
├── controllers/        # Request handlers
├── services/          # Business logic
├── routes/            # API routes
├── middlewares/       # Express middlewares
├── utils/            # Helper functions
├── types/            # TypeScript types
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔨 Development

- **Run in development mode**

  ```bash
  npm run dev
  ```

- **Build for production**

  ```bash
  npm run build
  ```

- **Run in production**

  ```bash
  npm start
  ```

- **Database commands**

  ```bash
  # Generate Prisma client
  npm run prisma:generate

  # Run migrations
  npm run prisma:migrate
  ```

## 🧪 Testing

(Coming soon)

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ✨ Future Improvements

- [ ] Add rate limiting
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add request validation
- [ ] Add unit tests
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Add logging system
