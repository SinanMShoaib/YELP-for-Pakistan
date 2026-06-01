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
<img width="1909" height="992" alt="Screenshot 2026-06-01 224146" src="https://github.com/user-attachments/assets/9c80208f-fb9f-4d17-a471-04e99dcf5ac4" />

#### 🔍 Restaurant Search & Filters
<img width="1919" height="991" alt="Screenshot 2026-06-01 224651" src="https://github.com/user-attachments/assets/7572b410-b98e-4b9e-a160-7c1e8aa64a54" />

#### 📄 Restaurant Detail Page
<img width="1914" height="1002" alt="Screenshot 2026-06-01 224730" src="https://github.com/user-attachments/assets/99173ff3-c337-4396-9732-aedfbceae3df" />

#### ⭐ Review & Rating System
<img width="668" height="558" alt="Screenshot 2026-06-01 224836" src="https://github.com/user-attachments/assets/e235078d-5953-456a-bc6c-715f160a9316" />

<img width="1120" height="516" alt="Screenshot 2026-06-01 224859" src="https://github.com/user-attachments/assets/74aa6a5a-6178-46ab-8bb6-f3168eb58f52" />

#### 👤 User Dashboard / My Account
<img width="1919" height="988" alt="Screenshot 2026-06-01 224923" src="https://github.com/user-attachments/assets/86d20985-4646-4402-88b5-5d5714c76bfa" />

#### ⚙️ Admin Panel (CRUD Operations)
<img width="1600" height="766" alt="admin pannel" src="https://github.com/user-attachments/assets/85e18ad5-d687-4655-9281-af4e9dab798e" />

#### 🎫 Coupon Generation & Download
<img width="1600" height="763" alt="coupon code" src="https://github.com/user-attachments/assets/00eea4b2-5873-4ba7-860e-c508f22b4db9" />

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
