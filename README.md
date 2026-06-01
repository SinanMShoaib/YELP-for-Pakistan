# 🍽️ FitHae - Restaurant Discovery Platform for Pakistan

**A Yelp-inspired full-stack web application** for discovering restaurants, cafes, and food places across Pakistan, with a focus on major cities like Islamabad, Lahore, Karachi, and Rawalpindi.

**Course:** Web Technologies — Semester Project  
**Deadline:** June 01, 2026

---

## 📋 Project Description

**FitHae** ek modern aur user-friendly platform hai jahan users:
- Apne city ke best restaurants ko easily search aur browse kar sakte hain.
- Authentic reviews likh aur padh sakte hain.
- Discount coupons generate aur redeem kar sakte hain.
- New restaurants submit kar sakte hain (Admin approval ke baad live hote hain).
- Leaderboard dekh sakte hain aur apna profile manage kar sakte hain.

---

## 👥 Team Members


| Name                  | Roll Number     | Contribution                          |
|-----------------------|-----------------|---------------------------------------|
| Sinan M. Shoaib       | 2504600         | Backend Development                   |
| Abdul Rafay           | 2502093         | Frontend Development                  |
| Abdul Sattar          | 2504605         | Database & Integration                |

---

## 🛠️ Tech Stack

### **Frontend**
- **Angular 21** + **TypeScript** + HTML + CSS
- Standalone Components, Reactive Forms, Angular Router
- HTTP Client, Auth Interceptor, Responsive Design (Flexbox + Grid)

### **Backend**
- **Node.js + Express.js** (Current)
- **Planned Migration:** ASP.NET Core Web API (C#) — Final submission se pehle complete kar diya jayega.

### **Database**
- **MongoDB Atlas**

---

## 📁 Repository Structure

```bash
FitHae/
├── frontend/           # Angular Application
├── backend/            # ASP.NET Core Backend (Under Development)
├── database/           # Schema & Seed Data
├── report/             # Project Report.pdf
├── demo/               # Video Demo & Screenshots
├── models/             # Mongoose Models
├── routes/             # API Routes
├── middleware/         # Authentication Middleware
├── server.js           # Current Backend Entry Point
├── vercel.json
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/SinanMShoaib/YELP-for-Pakistan.git
cd YELP-for-Pakistan
```

### 2. Backend Setup (Node.js)
```bash
npm install
npm start
```
*→ Backend runs on `http://localhost:3000`*

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```
*→ Frontend runs on `http://localhost:4200`*

### 4. Environment Variables
Root folder mein `.env` file create karen aur yeh content daalen:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_very_strong_secret_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=3000
```

### 5. Create Admin Account (One Time)
```bash
node seed-admin.js
```

**Default Admin Credentials:**
- **Email:** `admin@fithae.com`
- **Password:** `Admin@123`

---

## 🌐 Live Demo

- **Live URL:** [https://yelp-for-pakistan.vercel.app](https://yelp-for-pakistan.vercel.app)
- **Video Demo:** *[UPDATE HERE - Video Link Daalen]*

---

## 📸 Screenshots

#### 🏠 Home Page (with beautiful 3D Animation)
![Home Page](https://github.com)

#### 🔍 Restaurant Search & Filters
![Restaurant Search](https://github.com)

#### 📄 Restaurant Detail Page
![Restaurant Detail](https://github.com)

#### ⭐ Review & Rating System
![Review 1](https://github.com)
![Review 2](https://github.com)

#### 👤 User Dashboard / My Account
![User Dashboard](https://github.com)

#### ⚙️ Admin Panel (CRUD Operations)
![Admin Panel](https://github.com)

#### 🎫 Coupon Generation & Download
![Coupon](https://github.com)

---

## ✅ Key Features

- **6+ Fully Dynamic & Interactive Pages**
- **Reactive Forms** with strict validation
- **JWT Authentication** (Secure Login & Signup)
- **Admin Panel** with full CRUD Operations
- **Real Database Integration** with MongoDB Atlas
- **Responsive UI** working smoothly across all devices

---

## 📄 Deliverables

- **Project Report:** `/report/Report.pdf`
- **Database Schema Diagram:** Report mein mojood hai
- **API Documentation:** Report mein mojood hai
- **Deployment:** Frontend hosted on Vercel
