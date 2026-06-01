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
<img width="1909" height="992" alt="image" src="https://github.com/user-attachments/assets/ca1af319-d1b7-408d-ac10-2de5a3486731" />

Restaurant Search & Filters
<img width="1919" height="991" alt="image" src="https://github.com/user-attachments/assets/aa0f01a1-9eec-499c-a91a-be9f48e501e4" />

Restaurant Detail Page
<img width="1914" height="1002" alt="image" src="https://github.com/user-attachments/assets/f6a04b25-89de-485b-9139-3e62db3f1334" />

Review & Rating System
<img width="668" height="558" alt="image" src="https://github.com/user-attachments/assets/d34df8a6-acd6-4fc7-90f8-87c21bee4c9a" />
<img width="1120" height="516" alt="image" src="https://github.com/user-attachments/assets/8c0f0d86-f0fa-46a2-9be5-6797c2c53270" />


User Dashboard / My Account
<img width="1919" height="988" alt="image" src="https://github.com/user-attachments/assets/547b2336-e14a-4403-9f0d-a3cc3108f09f" />

Admin Panel (CRUD Operations)
<img width="1600" height="766" alt="WhatsApp Image 2026-06-01 at 10 51 57 PM" src="https://github.com/user-attachments/assets/397e9de2-0b58-45ab-9405-b21905170b83" />

Coupon Generation & Download
<img width="1600" height="763" alt="image" src="https://github.com/user-attachments/assets/615148f3-5acd-40e2-82bb-56b3ed4f0d2f" />


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
