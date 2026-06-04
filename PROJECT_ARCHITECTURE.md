# FitHae - Project Architecture & Layout

## 📋 Project Overview

**FitHae** is a full-stack web application that functions as a restaurant discovery and review platform focused on Pakistan (Primary cities: Islamabad, Lahore, Karachi, Rawalpindi). It allows users to browse restaurants, leave reviews, redeem coupons, and includes administrative functionality for managing restaurant submissions.

**Tech Stack:**
- **Frontend:** Angular 21 (Standalone Components)
- **Backend:** Express.js 5 + Node.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Vercel

---

## 🏗️ Project Structure

```
WEB Tech Final project/
├── frontend/                 # Angular frontend application
├── middleware/              # Express middleware functions
├── models/                  # MongoDB Mongoose schemas
├── routes/                  # API route handlers
├── server.js               # Express server entry point
├── seed-admin.js          # Script to create admin user
├── package.json           # Backend dependencies
├── .env                   # Environment variables (secrets)
├── vercel.json           # Vercel deployment config
└── assets/               # Static assets folder
```

---

## 🖨️ FRONTEND STRUCTURE (`/frontend`)

### Purpose
Provides the user interface for browsing restaurants, writing reviews, managing accounts, and admin functions using Angular's modern standalone component architecture.

```
frontend/
├── src/
│   ├── main.ts              # Angular bootstrap file
│   ├── index.html           # Root HTML template
│   ├── styles.css           # Global styles
│   ├── app/
│   │   ├── app.ts           # Root component (App Component) - contains navbar, routing outlet
│   │   ├── app.html         # Root template
│   │   ├── app.css          # Root component styles
│   │   ├── app.config.ts    # Angular standalone config (providers, interceptors)
│   │   ├── app.routes.ts    # Route definitions for all pages
│   │   ├── auth.interceptor.ts   # Automatically adds JWT token to requests
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/           # Login/Register page
│   │   │   ├── home/           # Landing page with 3D background
│   │   │   ├── about-us/       # About page
│   │   │   ├── admin-panel/    # Admin dashboard
│   │   │   ├── add-restaurant/ # Submit new restaurant form
│   │   │   ├── search-results/ # Search results page
│   │   │   ├── restaurant-details/ # Individual restaurant page
│   │   │   ├── leaderboard/    # Top-rated restaurants
│   │   │   ├── my-account/     # User profile page
│   │   │   ├── verify-coupon/  # Coupon verification
│   │   │   ├── three-js-popup/ # 3D model popup component
│   │   │   ├── toast/          # Notification component
│   │   │   └── other UI components
│   │   └── services/       # Business logic & API calls
│   │       ├── api.ts          # HTTP requests to backend
│   │       ├── auth.ts         # Authentication logic
│   │       └── toast.ts        # Toast notification service
│   └── assets/        # Images and static resources
├── package.json        # Frontend dependencies (Angular, Three.js, GSAP, etc.)
├── angular.json        # Angular CLI configuration
├── tsconfig.json       # TypeScript compiler options
├── proxy.conf.json     # Development proxy (routes /api to localhost:3000)
└── .prettierrc/.editorconfig  # Code formatting rules
```

### Key Components Explained

| Component | Purpose |
|-----------|---------|
| **app.ts** | Root component that manages navigation, theme, and weather display |
| **auth/** | Login/Register forms with form validation |
| **home/** | Landing page with Three.js 3D background animation |
| **admin-panel/** | View pending restaurant submissions, approve/reject them |
| **add-restaurant/** | Form for users to submit new restaurants with details |
| **search-results/** | Display restaurants based on search/filter criteria |
| **restaurant-details/** | Shows full restaurant info, reviews, ratings, map location |
| **my-account/** | User profile, edit bio/image, view bookmarks, see coupons |
| **leaderboard/** | Top-rated restaurants ranked by average rating |
| **verify-coupon/** | Scan/enter coupon code to verify and download coupon |

### Frontend Services

**api.ts** - Handles all HTTP communication with backend:
- Authentication endpoints (`/api/auth`)
- Restaurant endpoints (`/api/restaurants`)
- Review endpoints (`/api/reviews`)
- Coupon endpoints (`/api/coupons`)

**auth.ts** - Manages JWT tokens:
- Stores/retrieves auth token from localStorage
- Provides current user info
- Handles logout

**toast.ts** - Notification system:
- Shows success/error/info messages
- Auto-dismisses after timeout

---

## 🔌 BACKEND STRUCTURE

### Purpose
REST API that handles all business logic, database operations, authentication, and serves the frontend.

### Entry Point: `server.js`

```javascript
// Initializes Express app
// Connects to MongoDB
// Registers all route handlers
// Serves on PORT 3000 (localhost:3000)
```

### API Routes

```
/api/auth          → Authentication (Login, Register, Profile)
/api/restaurants   → Restaurant CRUD & search
/api/reviews       → Review operations
/api/coupons       → Coupon generation & verification
```

---

## 📦 DATABASE MODELS (`/models`)

### 1. **User.js** - User Account Schema

```
Fields:
├── name              → User's full name
├── username          → Unique username
├── email             → Unique email address
├── password          → Hashed with bcrypt (10 salt rounds)
├── role              → 'user' or 'admin'
├── bio               → User biography
├── profileImage      → URL to profile picture
├── fitHaeTokens      → Reward points/balance
├── bookmarks[]       → Array of bookmarked restaurants
└── timestamps        → createdAt & updatedAt

Key Features:
- Pre-save hook: Auto-hashes password before storing
- Email & username must be unique
```

### 2. **Restaurants.js** - Restaurant Listing Schema

```
Fields:
├── name                → Restaurant name
├── city                → One of: Islamabad, Lahore, Karachi, Rawalpindi
├── location            → Street address
├── description         → Restaurant details
├── imageUrl            → Photo URL
├── googlePlaceId       → Google Maps integration
├── addedBy
│   ├── userId          → User who submitted restaurant
│   └── userName        → Submitter's name
├── averageRating       → Calculated from all reviews
├── reviewCount         → Total number of reviews
├── totalStars          → Sum of all ratings (for averaging)
├── categories[]        → Types: ['Biryani', 'Café', 'Fast Food', etc.]
├── priceRange          → '$', '$$', '$$$', or '$$$$'
├── amenities[]         → ['WiFi', 'Parking', 'Delivery', etc.]
├── hours               → Open/close times for each day
│   └── monday/tuesday/... → { open: '10:00', close: '22:00' }
├── status              → 'Pending Review', 'Approved', 'Rejected'
└── timestamps          → createdAt & updatedAt

Purpose: Core data for restaurant listings and search
```

### 3. **Review.js** - User Reviews Schema

```
Fields:
├── restaurantId        → References Restaurant document
├── userId              → References User who wrote review
├── userName            → Reviewer's name (cached for display)
├── comment             → Review text (required)
├── rating              → 1-5 stars (required)
└── timestamps          → createdAt (auto-added)

Relationships:
- Linked to specific restaurant
- Each user can write multiple reviews
- Used to calculate restaurant averageRating
```

### 4. **Coupon.js** - Discount Coupon Schema

```
Fields:
├── couponId            → Unique coupon code (generated with crypto)
├── userId              → User who generated/redeemed coupon
├── restaurantId        → Optional: specific restaurant coupon
├── status              → 'Active', 'Redeemed', or 'Expired'
├── expiryDate          → When coupon expires
├── discountValue       → Display text: '15% OFF' format
└── timestamps          → createdAt & updatedAt

Purpose: Track generated coupons and redemption status
```

---

## 🛣️ API ROUTES (`/routes`)

### **authRoutes.js**
Handles user authentication and profile management

```
POST   /api/auth/signup          → Register new user
POST   /api/auth/login           → Login user (returns JWT token)
GET    /api/auth/me              → Get current user profile (protected)
PUT    /api/auth/profile         → Update user profile (protected)
```

**Key Features:**
- Strong password validation
- JWT token generation on successful login
- Password hashing with bcrypt
- Protected routes using auth middleware

---

### **restaurantRoutes.js**
Restaurant management and search functionality

```
GET    /api/restaurants/search           → Search/filter restaurants
GET    /api/restaurants/leaderboard      → Top-rated restaurants
GET    /api/restaurants/:id              → Get restaurant details
POST   /api/restaurants/add              → Submit new restaurant (protected)
GET    /api/restaurants/user/submissions → View user's submissions (protected)
GET    /api/restaurants/admin/all        → Get pending submissions (admin)
PUT    /api/restaurants/admin/:id        → Approve/reject submission (admin)
```

**Features:**
- City-based filtering (auto-detects from address)
- Integration with Google Maps API
- Rating calculation
- QR code generation
- Admin approval workflow

---

### **reviewRoutes.js**
User reviews and ratings management

```
POST   /api/reviews/add          → Create new review (protected)
GET    /api/reviews/recent/all   → Get recent global reviews
GET    /api/reviews/:restaurantId → Get reviews for specific restaurant
GET    /api/reviews/user/me      → Get current user's reviews (protected)
```

**Key Features:**
- 1-5 star rating system
- Automatic restaurant rating calculation
- Comment text field for detailed feedback
- User tracking with timestamps

---

### **couponRoutes.js**
Coupon generation and redemption

```
POST   /api/coupons/redeem       → Generate coupon for user (protected)
GET    /api/coupons/download/:couponId → Generate downloadable coupon image
GET    /api/coupons/verify/:couponId   → Verify coupon validity
GET    /api/coupons/admin/all    → View all coupons (admin)
```

**Features:**
- Unique coupon code generation
- Professional boarding-pass style coupon design (canvas)
- PDF download capability
- Coupon status tracking
- Expiry date management

---

## 🔐 MIDDLEWARE (`/middleware`)

### **auth.js** - JWT Authentication Middleware

**Purpose:** Protects routes that require user login

**Flow:**
1. Checks for `Authorization: Bearer <TOKEN>` header
2. Extracts JWT token
3. Verifies token signature using `JWT_SECRET`
4. Attaches user data to `req.user`
5. Passes control to route handler (or rejects with 401/400)

**Used on:** All protected routes (logout, profile, reviews, coupons, etc.)

---

## 🔧 CONFIGURATION FILES

### **.env** - Environment Variables (Secrets)
```
MONGO_URI=mongodb+srv://...     # MongoDB connection string
PORT=3000                        # Server port
GOOGLE_MAPS_API_KEY=...         # Google Maps API key
JWT_SECRET=ChooseAStrongRandomString123!  # Signing key for JWT tokens
```

### **proxy.conf.json** - Development Proxy
Routes `/api` requests from frontend (port 4200) to backend (port 3000) during development:
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

### **vercel.json** - Production Deployment
Configures Vercel to:
- Build backend as Node.js function
- Build frontend as static export
- Route `/api/*` to server.js
- Serve static files from frontend dist
- Enable SPA routing fallback

---

## 📊 Data Flow Diagrams

### Authentication Flow
```
User Login (Frontend)
    ↓
POST /api/auth/login
    ↓
Backend validates credentials
    ↓
Generate JWT token
    ↓
Return token to frontend
    ↓
Frontend stores token in localStorage
    ↓
auth.interceptor adds token to subsequent requests
```

### Restaurant Submission Flow
```
User submits restaurant (Add Restaurant page)
    ↓
POST /api/restaurants/add (with JWT)
    ↓
Backend validates data + Google Maps API
    ↓
Create restaurant doc with status: 'Pending Review'
    ↓
Admin reviews in Admin Panel
    ↓
Admin approves/rejects
    ↓
Status updated → Visible in search results (if approved)
```

### Review & Rating Flow
```
User writes review on restaurant details page
    ↓
POST /api/reviews/add (with JWT)
    ↓
Backend stores review
    ↓
Recalculate restaurant averageRating
    ↓
Update reviewCount & totalStars
    ↓
Frontend refreshes to show updated rating
```

### Coupon Flow
```
User clicks "Redeem Coupon"
    ↓
POST /api/coupons/redeem (with JWT)
    ↓
Backend generates unique couponId
    ↓
Stores coupon with status: 'Active'
    ↓
User can download as image or enter code at restaurant
    ↓
GET /api/coupons/verify/:couponId
    ↓
Restaurant staff verifies coupon validity
```

---

## 🎨 Frontend Component Hierarchy

```
App (Root Component)
├── Navigation Bar (shared across all routes)
├── Router Outlet (displays active component based on route)
│   └── Active Route Component
│       ├── auth (Login/Register)
│       ├── home (Landing page)
│       ├── search-results (Results page)
│       ├── restaurant-details (Single restaurant)
│       ├── my-account (User profile)
│       ├── admin-panel (Admin dashboard)
│       ├── add-restaurant (Submission form)
│       ├── leaderboard (Top restaurants)
│       ├── verify-coupon (Coupon verification)
│       └── about-us (About page)
├── Toast Component (appears globally for notifications)
└── Footer/Additional UI
```

---

## 🚀 How to Run

### **Backend Setup**
```bash
# Install dependencies
npm install

# Start server
npm start
# Server runs on http://localhost:3000

# Or with nodemon (auto-reload):
npx nodemon server.js
```

### **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
# Frontend runs on http://localhost:4200
# API requests proxy to http://localhost:3000
```

### **Admin Account**
```bash
# Seed admin account (run once):
node seed-admin.js

# Login with:
# Email: admin@fithae.com
# Password: Admin@123
```

---

## 🔑 Key Features Summary

| Feature | Location | Details |
|---------|----------|---------|
| **User Authentication** | authRoutes.js, auth.ts | JWT-based auth, password hashing |
| **Restaurant Search** | restaurantRoutes.js, search component | Filter by city, price, amenities |
| **Reviews & Ratings** | reviewRoutes.js, restaurant-details | 1-5 star system, user comments |
| **Admin Panel** | admin-panel component, restaurantRoutes | Approve/reject restaurant submissions |
| **Coupon System** | couponRoutes.js, verify-coupon | Generate, download, verify coupons |
| **User Profiles** | my-account component, authRoutes | Edit bio, profile image, bookmarks |
| **Leaderboard** | leaderboard component | Top-rated restaurants |
| **3D Visualization** | home component, three-bg component | Three.js 3D animations |
| **Responsive UI** | All components | Mobile & desktop optimized |

---

## 🛡️ Security Features

1. **JWT Authentication** - Tokens expire, validated on backend
2. **Password Hashing** - bcryptjs with 10 salt rounds
3. **Protected Routes** - Auth middleware validates requests
4. **Environment Variables** - Secrets stored in .env (not in git)
5. **CORS** - Prevents unauthorized cross-origin requests
6. **Email/Username Validation** - Unique constraints on database

---

## 📱 Integration Points

- **Google Maps API** - Restaurant location detection and maps
- **MongoDB Atlas** - Cloud database
- **JWT Tokens** - Stateless authentication
- **Canvas Library** - Generate professional coupon images
- **Three.js** - 3D graphics for UI enhancements
- **Vercel** - Production deployment platform

---

## 🎯 Development Notes for AI

- **Standalone Components** - Angular uses standalone components (not NgModules)
- **Reactive Forms** - FormsModule used for form handling
- **Signals** - Angular reactive primitives for state management
- **Services** - Dependency injection for shared logic
- **Type Safety** - Strict TypeScript configuration
- **Pre-commit Hooks** - Prettier formatting enforced (see .prettierrc)
- **Testing** - Vitest configured but not fully implemented in components

---

**Last Updated:** June 1, 2026  
**Project Name:** FitHae - Restaurant Discovery Platform  
**Status:** Full-stack application in development
