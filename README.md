# Product List Backend

Express.js backend with SQLite database for managing products and comments.

## Features

- **Products Management**: CRUD operations for products with size and weight information
- **Comments System**: CRUD operations for comments linked to products
- **SQLite Database**: Lightweight, file-based database
- **TypeScript**: Full TypeScript support with type safety
- **RESTful API**: Clean REST endpoints for all operations

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imageUrl TEXT NOT NULL,
  name TEXT NOT NULL,
  count INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  weight TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Comments Table

```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
);
```

## API Endpoints

### Products

- `GET /api/products` - Get all products with comments
- `GET /api/products/:id` - Get product by ID with comments
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Comments

- `GET /api/comments` - Get all comments
- `GET /api/comments/:id` - Get comment by ID
- `GET /api/comments/product/:productId` - Get comments by product ID
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## Setup

1. Install dependencies:

```bash
npm install
```

2. Initialize the database:

```bash
npm run init-db
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Start production server:

```bash
npm start
```

## Data Models

### Product

```typescript
interface Product {
  id: number;
  imageUrl: string;
  name: string;
  count: number;
  size: {
    width: number;
    height: number;
  };
  weight: string;
  comments?: Comment[];
}
```

### Comment

```typescript
interface Comment {
  id: number;
  productId: number;
  description: string;
  date: string;
}
```

## Environment Variables

- `PORT` - Server port (default: 3001)

## Development

The project uses TypeScript with the following scripts:

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run init-db` - Initialize database with sample data
