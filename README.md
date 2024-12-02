# Budget Tracker API

A RESTful API built with Node.js, Express, and MongoDB for tracking personal expenses with user authentication and profile management.

## 📋 Features

- User authentication with JWT tokens
- Profile management with customizable fields
- Complete CRUD operations for expenses
- Advanced filtering and pagination
- Data validation using Joi
- Error handling and logging
- TypeScript implementation
- Compression for better performance
- CORS enabled

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **Logging**: Morgan
- **Security**: CORS, Compression

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm/yarn

## Environment Variables

Create a `.env` file in the root directory:

```env
SERVER=localhost
PORT=3200
MONGODB_URL=mongodb://127.0.0.1:27017/budget-tracker
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
```

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📍 API Endpoints

### Authentication Routes

```
POST /auth/register
- Register a new user
- Body: { firstName, lastName, email, password }

POST /auth/login
- Login user
- Body: { email, password }
- Returns: { token, refreshToken }

POST /auth/refresh-token
- Refresh access token
- Body: { token }
- Returns: { token }
```

### Profile Routes (Protected)

```
GET /profile
- Get user profile
- Header: Authorization: Bearer <token>

PATCH /profile
- Update user profile
- Header: Authorization: Bearer <token>
- Body: {
    phoneNumber?,
    fatherName?,
    gender?,
    zipCode?,
    address?,
    dateOfBirth?,
    photo?,
    aboutMe?
  }
```

### Expense Routes (Protected)

```
GET /expenses
- Get all expenses with pagination
- Header: Authorization: Bearer <token>
- Query params: {
    page?: number,
    limit?: number,
    search?: string,
    startDate?: DD/MM/YYYY,
    endDate?: DD/MM/YYYY,
    sortBy?: "price" | "date",
    sortOrder?: "asc" | "desc"
  }

GET /expenses/:id
- Get single expense
- Header: Authorization: Bearer <token>

GET /expenses/budget-status
- Get current month's budget status
- Header: Authorization: Bearer <token>

POST /expenses
- Create new expense
- Header: Authorization: Bearer <token>
- Body: { title, price, date }

PATCH /expenses/:id
- Partially update expense
- Header: Authorization: Bearer <token>
- Body: { title?, price?, date? }

PUT /expenses/:id
- Fully update expense
- Header: Authorization: Bearer <token>
- Body: { title, price, date }

DELETE /expenses/:id
- Delete expense
- Header: Authorization: Bearer <token>
```

## 📦 Response Formats

### Success Response

```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error message"
}
```

### Pagination Response

```json
{
  "status": "success",
  "data": {
    "expenses": [...],
    "pagination": {
      "total": 100,
      "totalPages": 10,
      "currentPage": 1,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## 🚀 Development

```bash
# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── common/
│   ├── helpers/     # Utility functions
│   ├── interfaces/  # TypeScript interfaces
│   └── validators/  # Joi validation schemas
├── config/
│   ├── app.ts      # Express configuration
│   └── db.ts       # Database configuration
├── controllers/     # Request handlers
├── middlewares/     # Custom middlewares
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
└── index.ts       # Application entry point
```

## 🔐 Authentication

The API uses JWT for authentication:

1. User registers/logs in and receives tokens
2. Access token used in Authorization header
3. Refresh token used to get new access token
4. Protected routes require valid access token

## 📄 License

ISC

## 👤 Author

[Ahsan Nazeef](https://github.com/AhsanNazeef/)

---

Made with ❤️ using Node.js and TypeScript
