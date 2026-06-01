# 🍽️ FitHae - Restaurant Discovery Platform for Pakistan

**A Yelp-inspired full-stack web application** for discovering restaurants, cafes, and food places across Pakistan, with focus on major cities like Islamabad, Lahore, Karachi, and Rawalpindi.

**Course:** Web Technologies — Semester Project  
**Deadline:** June 01, 2026

---

## 📋 Project Description

**FitHae** ek modern aur user-friendly platform hai jahan users:
- Apne city ke best restaurants ko easily search aur browse kar sakte hain
- Authentic reviews likh aur padh sakte hain
- Discount coupons generate aur redeem kar sakte hain
- New restaurants submit kar sakte hain (Admin approval ke baad live hote hain)
- Leaderboard dekh sakte hain aur apna profile manage kar sakte hain

---

## 👥 Team Members

| Name                  | Roll Number     | Contribution                          |
|-----------------------|-----------------|---------------------------------------|
| Sinan M. Shoaib       | 2504600         | Backend Development                   |
| Abdul Rafay           | 2502093         | Frontend Development                  |
| Abdul Sattar          | 2504605         | Database & Integration                |

---

## 🛠️ Tech Stack

### **Frontend (Mandatory)**
- **Angular 21** + **TypeScript** + HTML + CSS
- Standalone Components, Reactive Forms, Angular Router
- HTTP Client, Auth Interceptor, Responsive Design (Flexbox + Grid)

### **Backend**
- **Node.js + Express.js** (Current)
- **Planned Migration:** ASP.NET Core Web API (C#) — Final submission se pehle complete kar diya jayega

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

🚀 Setup Instructions
1. Clone the Repository
Bashgit clone https://github.com/SinanMShoaib/YELP-for-Pakistan.git
cd YELP-for-PakistanCloning into 'YELP-for-Pakistan'...
fatal: unable to access 'https://github.com/SinanMShoaib/YELP-for-Pakistan.git/': Failed to connect to github.com port 443 after 5 ms: Couldn't connect to server
temp.sh: line 2: cd: YELP-for-Pakistan: No such file or directory

2. Backend Setup (Node.js)
Bashnpm install
npm start
→ Backend runs on http://localhost:3000
3. Frontend Setup
Bashcd frontend
npm install --legacy-peer-deps
npm start
→ Frontend runs on http://localhost:4200
4. Environment Variables
Root folder mein .env file create karen aur yeh content daalen:
envMONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_very_strong_secret_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=3000
5. Create Admin Account (One Time)
Bashnode seed-admin.js
Default Admin Credentials:

Email: admin@fithae.com
Password: Admin@123


🌐 Live Demo

Live URL: https://yelp-for-pakistan.vercel.app
Video Demo: [UPDATE HERE - Video Link Daalen]


📸 Screenshots

Home Page (with beautiful 3D Animation)
Restaurant Search & Filters
Restaurant Detail Page
Review & Rating System
User Dashboard / My Account
Admin Panel (CRUD Operations)
Coupon Generation & Download

[UPDATE HERE] — Actual screenshots yahan add kar den (images upload karke link daalen)

✅ Key Features

6+ Fully Dynamic & Interactive Pages
Reactive Forms with Validation
JWT Authentication (Login & Signup)
Admin Panel with Full CRUD Operations
Real Database Integration
Responsive UI with Vanilla JS DOM Manipulation


📄 Deliverables

Project Report: /report/Report.pdf
Database Schema Diagram: Report mein mojood
API Documentation: Report mein mojood
Deployment: Frontend on Vercel
