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
<img width="1909" height="992" alt="Screenshot 2026-06-01 224146" src="https://github.com/user-attachments/assets/425ead5d-e33f-47f4-bd40-aeaf252551e4" />

Restaurant Search & Filters
<img width="1919" height="991" alt="Screenshot 2026-06-01 224651" src="https://github.com/user-attachments/assets/141ce4d9-a7fa-4912-be8a-73e411351cd0" />

Restaurant Detail Page
<img width="1914" height="1002" alt="Screenshot 2026-06-01 224730" src="https://github.com/user-attachments/assets/3332c1db-2757-4f5f-8960-78385f3a1f2e" />

Review & Rating System
<img width="668" height="558" alt="Screenshot 2026-06-01 224836" src="https://github.com/user-attachments/assets/e8010dc0-b20e-4cd3-be9d-1e6c27766fb2" />
<img width="1120" height="516" alt="Screenshot 2026-06-01 224859" src="https://github.com/user-attachments/assets/cf7b79ad-86d3-4eb4-855c-2d1acc4edc4e" />


User Dashboard / My Account
<img width="1919" height="988" alt="Screenshot 2026-06-01 224923" src="https://github.com/user-attachments/assets/1f2d473c-c75e-4943-9de2-eb0a3fb6394d" />

Admin Panel (CRUD Operations)
<img width="1600" height="766" alt="admin pannel" src="https://github.com/user-attachments/assets/97e72370-1290-4dc2-8564-c582d44aba91" />

Coupon Generation & Download
<img width="1600" height="763" alt="coupon code" src="https://github.com/user-attachments/assets/81a3eb59-fb6f-4071-b546-52ce9b316b45" />


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
