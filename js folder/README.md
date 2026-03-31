# 🎨 Kaal Connect — Artist Marketplace

> *Where Art Finds Its Keeper.*

A full-stack eCommerce platform connecting independent artists (sellers) with collectors (buyers). Built with a dark, editorial "gallery noir" aesthetic using React, Node.js, Express, and MongoDB.

---

## ✨ Features

### Buyer Features
- 🏠 Home page with featured artworks & category browsing
- 🔍 Search & filter products (by category, price range, sort)
- 🛍️ Product detail pages with image gallery & seller info
- 🛒 Shopping cart with quantity management
- 💳 Mock checkout with shipping address & payment methods
- 📦 Order history & order tracking
- 🤍 Wishlist management
- ⭐ Product reviews & star ratings

### Seller (Artist) Features
- 🎨 Seller dashboard with revenue & order stats
- ➕ Add new artworks (with up to 5 images, tags, dimensions)
- ✏️ Edit & delete existing products
- 👁️ Toggle product visibility
- 📬 View & manage incoming orders
- 📊 Public artist profile page

### Platform Features
- 🔐 JWT-based authentication (register/login/logout)
- 👥 Role-based access (Buyer / Seller)
- 🔒 Protected routes & API endpoints
- 📱 Fully responsive (mobile + desktop)
- 🌑 Dark mode editorial UI with gold accents

---

## 🗂️ Project Structure

```
kaal-connect/
├── client/                     # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.js
│   │   │   │   └── Footer.js
│   │   │   └── ProductCard.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── seller/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Products.js
│   │   │   │   ├── AddProduct.js
│   │   │   │   ├── EditProduct.js
│   │   │   │   ├── ProductForm.js
│   │   │   │   └── Orders.js
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── OrderSuccess.js
│   │   │   ├── OrderHistory.js
│   │   │   ├── OrderDetail.js
│   │   │   ├── Wishlist.js
│   │   │   ├── Profile.js
│   │   │   ├── SellerProfile.js
│   │   │   └── NotFound.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                     # Express backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + role guards
│   │   └── upload.js           # Multer config
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── reviews.js
│   │   └── wishlist.js
│   ├── uploads/                # Local image storage (auto-created)
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── package.json                # Root with concurrently
├── .env.example
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repo
git clone <your-repo-url>
cd kaal-connect

# Install all dependencies (root + server + client)
npm run install-all
```

### 2. Configure Environment Variables

```bash
# Copy the example env file
cp server/.env.example server/.env

# Edit server/.env and set:
MONGO_URI=mongodb://localhost:27017/kaal-connect
JWT_SECRET=your_super_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Run the App

```bash
# Run both frontend and backend simultaneously
npm run dev
```

This starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

---

## 📡 API Endpoints

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register buyer or seller |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update profile |
| GET | `/api/auth/seller/:id` | Public | Get seller public profile |

### Product Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List all products (with filters) |
| GET | `/api/products/featured` | Public | Get featured products |
| GET | `/api/products/my-products` | Seller | Seller's own products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Seller | Create product |
| PUT | `/api/products/:id` | Seller | Update product |
| DELETE | `/api/products/:id` | Seller | Delete product |

### Cart Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/cart` | Private | Get cart |
| POST | `/api/cart/add` | Private | Add item |
| PUT | `/api/cart/update` | Private | Update quantity |
| DELETE | `/api/cart/remove/:id` | Private | Remove item |
| DELETE | `/api/cart/clear` | Private | Clear cart |

### Order Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Private | Place order |
| GET | `/api/orders` | Private | Buyer's orders |
| GET | `/api/orders/seller` | Seller | Seller's received orders |
| GET | `/api/orders/:id` | Private | Single order |
| PUT | `/api/orders/:id/status` | Seller | Update order status |

### Review Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/reviews/:productId` | Public | Product reviews |
| POST | `/api/reviews/:productId` | Buyer | Submit review |
| DELETE | `/api/reviews/:reviewId` | Buyer | Delete own review |

### Wishlist Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/wishlist` | Private | Get wishlist |
| POST | `/api/wishlist/toggle/:id` | Private | Toggle product in wishlist |

---

## 🗄️ Database Models

### User
```
name, email, password (bcrypt hashed), role (buyer/seller),
avatar, bio, location, website, totalSales, wishlist[]
```

### Product
```
title, description, price, category, images[], sellerId,
stock, isAvailable, tags[], averageRating, numReviews,
totalSold, isFeatured, dimensions, medium
```

### Order
```
buyerId, items[{ product, quantity, price, title, image, sellerId }],
totalAmount, status, shippingAddress, paymentMethod, paymentStatus, paymentId
```

### Cart
```
userId, items[{ product, quantity }]
```

### Review
```
product, buyer, rating, title, body
```

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- **JWT** tokens (30 day expiry)
- Role-based middleware (`protect`, `sellerOnly`, `buyerOnly`)
- Input validation with **express-validator**
- File type & size validation for uploads

---

## 🎨 Design System

**Theme:** Gallery Noir — dark editorial with warm gold accents

| Token | Value |
|-------|-------|
| Background | `#110e0a` (ink-900) |
| Surface | `#1a1510` (ink-800) |
| Gold accent | `#d4a843` (gold-500) |
| Text primary | `#fdf8ef` (parchment-50) |
| Display font | Playfair Display |
| Body font | Lora |
| UI font | DM Sans |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Styling | Tailwind CSS 3 |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 7 |
| Auth | JWT, bcryptjs |
| File Uploads | Multer |
| Validation | express-validator |
| Dev Tools | Nodemon, Concurrently |

---

## 📝 Notes

- **Image uploads** are stored locally in `server/uploads/`. For production, switch to Cloudinary or AWS S3.
- **Payment integration** is mocked — no real charges are made. Integrate Razorpay or Stripe for production.
- The app runs with **MongoDB locally** by default. Use a MongoDB Atlas URI in production.
- The `uploads/` folder is auto-created by the server on first run.

---

*Built with ❤️ for artists and art lovers everywhere.*
