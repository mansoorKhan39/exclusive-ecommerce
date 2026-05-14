# 🛍️ Exclusive — Full-Stack E-Commerce App (MERN)

A complete, production-ready e-commerce web application built with the MERN stack, faithfully recreating the **Exclusive** Figma design with all 13 pages.

---

## 📸 Pages Implemented

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero slider, flash sales, categories, best sellers, new arrivals |
| Shop | `/shop` | Product grid with filters, search, sort & pagination |
| Product Detail | `/product/:id` | Images, variants, reviews, add to cart |
| Cart | `/cart` | Cart table, quantity control, coupon, totals |
| Checkout | `/checkout` | Billing form, order summary, payment methods |
| Wishlist | `/wishlist` | Saved items, move all to bag |
| Account | `/account` | Profile, orders, cancellations, returns, wishlist tabs |
| Login | `/login` | Email/password auth |
| Sign Up | `/signup` | Registration with Google option |
| About | `/about` | Story, stats, team, features |
| Contact | `/contact` | Phone/email info + contact form |
| 404 | `*` | Not found page |
| Order Success | `/order-success/:id` | Confirmation with order details |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** with React Router v6
- **Context API** — Auth, Cart, Wishlist
- **Lucide React** icons
- **React Hot Toast** notifications
- **Google Fonts** — Poppins + Inter
- Custom CSS with CSS variables design system

### Backend
- **Node.js + Express** REST API
- **MongoDB + Mongoose** with relationships
- **JWT** authentication (30-day tokens)
- **bcryptjs** password hashing
- Role-based access control (user / admin)

### DevOps
- **Docker + Docker Compose** for one-command startup
- MongoDB volume persistence

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
git clone <https://github.com/mansoorKhan39/exclusive-ecommerce>
cd exclusive
docker-compose up --build
```

Then seed the database:
```bash
docker exec exclusive_backend node seed.js
```

Visit: http://localhost:3000

---

### Option 2: Manual Setup

**Prerequisites:** Node.js 18+, MongoDB running locally

#### 1. Backend
```bash
cd backend
cp .env.example .env          # edit if needed
npm install
node seed.js                   # seed database with sample data
npm run dev                    # starts on port 5000
```

#### 2. Frontend
```bash
cd frontend
npm install
npm start                      # starts on port 3000
```

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@exclusive.com | admin123 |
| User | user@exclusive.com | user123 |

---

## 📁 Project Structure

```
exclusive/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with bcrypt
│   │   ├── Product.js       # Product with reviews & variants
│   │   └── Order.js         # Order with items & shipping
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me
│   │   ├── products.js      # CRUD + reviews + filters
│   │   ├── orders.js        # Place & track orders
│   │   └── users.js         # Profile + wishlist
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly
│   ├── server.js
│   ├── seed.js              # 20 sample products + 2 users
│   └── Dockerfile
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js        # Sticky nav, search, dropdowns
│       │   ├── Footer.js        # Links, subscribe, socials
│       │   ├── AnnouncementBar.js
│       │   └── ProductCard.js   # Card with hover actions
│       ├── context/
│       │   ├── AuthContext.js   # User state + login/logout
│       │   ├── CartContext.js   # localStorage cart
│       │   └── WishlistContext.js
│       ├── pages/
│       │   ├── HomePage.js      # Full landing page
│       │   ├── ShopPage.js      # Filtered product listing
│       │   ├── ProductDetailPage.js
│       │   ├── CartPage.js
│       │   ├── CheckoutPage.js
│       │   ├── WishlistPage.js
│       │   ├── AccountPage.js   # Multi-tab dashboard
│       │   ├── LoginPage.js
│       │   ├── SignUpPage.js
│       │   ├── AboutPage.js
│       │   ├── ContactPage.js
│       │   ├── OrderSuccessPage.js
│       │   └── NotFoundPage.js
│       ├── services/
│       │   └── api.js           # Axios instance + all endpoints
│       ├── App.js               # Routes + providers
│       └── index.css            # Design system + global styles
│
└── docker-compose.yml
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List with filters (`category`, `search`, `sort`, `page`, `limit`, `flash`, `featured`) |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create (admin) |
| PUT | `/api/products/:id` | Update (admin) |
| DELETE | `/api/products/:id` | Delete (admin) |
| POST | `/api/products/:id/reviews` | Add review |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | My orders |
| GET | `/api/orders/:id` | Order detail |
| GET | `/api/orders` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/wishlist` | Get wishlist |
| POST | `/api/users/wishlist/:productId` | Toggle wishlist |
| GET | `/api/users` | All users (admin) |

---

## ✨ Features

- ✅ Responsive design (mobile-first)
- ✅ JWT authentication with protected routes
- ✅ Persistent cart (localStorage)
- ✅ Wishlist synced to backend
- ✅ Flash sales countdown timer
- ✅ Hero image carousel
- ✅ Product filtering by category, search & sort
- ✅ Pagination
- ✅ Coupon code (`EXCLUSIVE10` for 10% off)
- ✅ Order placement & tracking
- ✅ Profile editing with password change
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ 404 page
- ✅ Admin role support
- ✅ Docker ready

---

## 🎨 Design System

All colors and typography live in CSS variables (`src/index.css`):

```css
--primary: #DB4444       /* Exclusive red */
--secondary: #00b517     /* Success green */
--accent: #f5a623        /* Star/warning gold */
--font-main: 'Poppins'   /* Headings */
--font-body: 'Inter'     /* Body text */
```

---

## 📝 License

MIT — free to use for personal and commercial projects.
