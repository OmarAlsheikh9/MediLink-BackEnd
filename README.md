<div align="center">

# 🏥 MediLink — Smart Clinic Management System

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" />
  <img src="https://img.shields.io/badge/ImageKit-009DFF?style=for-the-badge&logoColor=white" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" />
</p>

<p align="center">
  <strong>A full-featured RESTful API backend for managing medical clinics — built as an ITI Graduation Project.</strong>
</p>

<p align="center">
  <a href="https://medi-link-front-end.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Visit Now-brightgreen?style=for-the-badge" />
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-api-overview">API Overview</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-seed-demo-data">Seed Data</a> •
  <a href="#-team">Team</a>
</p>

</div>

---

## 📖 About The Project

**MediLink** is a comprehensive clinic management system designed to streamline the full workflow of a medical clinic — from patient registration and appointment booking, to doctor consultations, prescriptions, medical reports, and reviews.

> 🌐 **Live Production App:** [https://medi-link-front-end.vercel.app](https://medi-link-front-end.vercel.app)  
> 💻 **Backend Repository:** [github.com/mohamedkamelmetwally23/MediLink-BackEnd](https://github.com/mohamedkamelmetwally23/MediLink-BackEnd)

The system supports **4 distinct roles**:
- 🛡️ **Admin** — Full system control, manage staff and clinic settings
- 👨‍⚕️ **Doctor** — View schedule, manage appointments, write prescriptions & medical reports
- 🗂️ **Receptionist** — Book & manage appointments, handle patient check-in
- 🧑 **Patient** — Book appointments, view medical history, rate doctors

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with HttpOnly cookie support
- Role-Based Access Control (RBAC) with 4 roles
- Password hashing with bcrypt (salt rounds: 12)
- OTP verification via SMS (Twilio)
- Redis-based token blacklisting for secure logout
- Rate limiting, XSS protection, NoSQL injection prevention, Helmet headers

### 👤 User Management
- Full CRUD for all user types (Admin, Doctor, Receptionist, Patient)
- Profile photo upload & management via **ImageKit CDN**
- Soft delete with active/inactive status

### 📅 Appointment System
- Intelligent time-slot generation based on clinic schedule and doctor availability
- Appointment status lifecycle: `قيد الانتظار` → `مؤكد` → `مكتمل` / `ملغى`
- Cancellation tracking (who cancelled: patient / doctor / receptionist)
- Appointment filtering by date, status, doctor, and patient

### 👨‍⚕️ Doctor Management
- Doctor profiles with specialization, experience, working days & hours
- Auto-calculated ratings average & count from patient reviews
- Favorite doctors system for patients
- Available time-slot endpoint for real-time booking

### 💊 Prescriptions
- Multi-medicine prescriptions linked to appointments
- Each medicine has: name, dose, frequency, duration
- One prescription per appointment (enforced)

### 📋 Medical Reports
- Structured diagnosis + detailed clinical notes per appointment
- Full patient medical history tracking

### ⭐ Reviews & Ratings
- Patient reviews per completed appointment (one review per appointment)
- Auto-recalculation of doctor's average rating on every review add/delete

### 🏥 Clinic Management
- Single-clinic model with configurable schedule
- Working days, active hours, and appointment duration settings
- Full specialization management (12 medical specializations)

### 📊 Activity Logs
- Tracks user actions for audit trail

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js v18+ (ES Modules) |
| **Framework** | Express.js v5 |
| **Database** | MongoDB + Mongoose |
| **Caching / OTP Store** | Redis |
| **Authentication** | JSON Web Tokens (JWT) |
| **Image Storage** | ImageKit CDN |
| **File Upload** | Multer + Sharp (image processing) |
| **SMS / OTP** | Twilio |
| **Logging** | Pino + Pino-HTTP + Morgan |
| **Validation** | Zod + Validator.js |
| **Security** | Helmet, express-rate-limit, HPP, XSS sanitizer, Mongo sanitize |

---

## 🗺️ API Overview

> Base URL: `http://localhost:3000/api/v1`

### 🔑 Auth Endpoints (`/users`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/users/signup` | Public | Register as patient (OTP sent) |
| `POST` | `/users/verifyOTP` | Public | Verify OTP to complete registration |
| `POST` | `/users/login` | All | Login with phone + password |
| `POST` | `/users/logout` | All | Logout (blacklists token) |
| `POST` | `/users/forgetPassword` | All | Send OTP for password reset |
| `POST` | `/users/verifyPasswordOTP` | All | Verify reset OTP |
| `PATCH` | `/users/resetPassword` | All | Set new password |
| `PATCH` | `/users/updateMyPassword` | All | Change own password |
| `GET` | `/users/me` | All | Get own profile |
| `PATCH` | `/users/updateMe` | All | Update own profile |
| `PATCH` | `/users/updateMyPhoto` | All | Upload/update profile photo |
| `GET` | `/users` | Admin | List all users |

### 👨‍⚕️ Doctors (`/doctors`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/doctors` | Public | List all doctors |
| `GET` | `/doctors/:id` | Public | Get doctor details |
| `GET` | `/doctors/:id/available-slots` | Authenticated | Get available time slots |
| `POST` | `/doctors` | Admin | Create new doctor account |
| `PATCH` | `/doctors/:id` | Admin | Update doctor |
| `DELETE` | `/doctors/:id` | Admin | Delete doctor |

### 🧑 Patients (`/patient`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/patient/my-profile` | Patient | Get own medical profile |
| `GET` | `/patient/:id` | Admin, Receptionist, Doctor | Get patient details |

### 📅 Appointments (`/appointments`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/appointments` | Admin, Receptionist | List all appointments |
| `GET` | `/appointments/my-appointments` | Doctor | Get own appointments by date |
| `GET` | `/appointments/bookedAppointmentsForPatient` | Patient | Get own appointments |
| `GET` | `/appointments/getPatientsForDoctor` | Doctor | Get own patient list |
| `GET` | `/appointments/getCurrentPatientForDoctor/:id` | Doctor | Get current patient in session |
| `POST` | `/appointments/bookByPatient` | Patient | Book appointment |
| `POST` | `/appointments/bookByReceptionist` | Receptionist | Book appointment for patient |
| `PATCH` | `/appointments/:id/status` | Admin, Receptionist, Doctor | Update appointment status |
| `PATCH` | `/appointments/:id/cancel` | All | Cancel appointment |

### 💊 Prescriptions (`/prescriptions`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/prescriptions/my-prescriptions` | Patient | Own prescriptions |
| `GET` | `/prescriptions/:patientId` | Doctor, Admin | Get patient prescriptions |
| `POST` | `/prescriptions` | Doctor | Create prescription |
| `DELETE` | `/prescriptions/:id` | Doctor, Admin | Delete prescription |

### 📋 Medical Reports (`/medicalReports`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/medicalReports/:patientId` | Doctor, Patient, Admin | Get patient reports |
| `POST` | `/medicalReports` | Doctor | Create report |

### ⭐ Reviews (`/reviews`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/reviews/doctor/:id` | Public | Get doctor reviews |
| `POST` | `/reviews` | Patient | Create review |
| `DELETE` | `/reviews/:id` | Patient, Admin | Delete review |

### 🏥 Clinic (`/clinic`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/clinic/informations` | Public | Get clinic info |
| `PATCH` | `/clinic/informations` | Admin | Update clinic info |
| `PATCH` | `/clinic/schedule` | Admin | Update clinic schedule |

### 🗂️ Receptionist (`/receptionist`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/receptionist` | Admin | List all receptionists |
| `GET` | `/receptionist/:id` | Admin | Get receptionist by ID |
| `POST` | `/receptionist` | Admin | Create receptionist |
| `PATCH` | `/receptionist/:id` | Admin | Update receptionist |
| `DELETE` | `/receptionist/:id` | Admin | Delete receptionist |

### 🏷️ Specializations (`/specializations`)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/specializations` | Public | List specializations |
| `GET` | `/specializations/:id` | Public | Get doctors by specialization |
| `POST` | `/specializations` | Admin | Create specialization |
| `PUT` | `/specializations/:id` | Admin | Update specialization |
| `DELETE` | `/specializations/:id` | Admin | Delete specialization |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas) with Replica Set enabled
- **Redis** (local or cloud)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mohamedkamelmetwally23/MediLink-BackEnd.git
cd MediLink-BackEnd

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example config.env
# Fill in your values in config.env

# 4. Start the development server
npm run dev
```

### Environment Variables

Create a `config.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
LOCAL_DATABASE=mongodb://localhost:27017/medilink

JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRES_IN=7d

REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_HOST=localhost
REDIS_PORT=6379

TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1234567890

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

---

## 🌱 Seed Demo Data

To populate the database with realistic demo data for testing:

```bash
# Validate seed data first (no DB writes)
npm run test:pre-seed

# Then seed the database
npm run seed
```

This will create:

| Entity | Count |
|--------|-------|
| Specializations | 12 |
| Doctors | 24 |
| Receptionists | 5 |
| Patients | 30 |
| Appointments | 253 (completed, confirmed, pending, cancelled) |
| Prescriptions | 55 |
| Medical Reports | 55 |
| Reviews | 54 (with auto-updated doctor ratings) |

> 🔐 **All demo accounts use password:** `Test@1234`

### Demo Credentials

| Role | Phone | Name |
|------|-------|------|
| Admin | `01000000000` | توفيق عبدالله |
| Doctor (الباطنة) | `01011111111` | أحمد الألفي |
| Doctor (الجلدية) | `01022222222` | أماني العطار |
| Doctor (الأطفال) | `01033333333` | يمان علاء |
| Doctor (مخ وأعصاب) | `01034444444` | جلال عبدالله |
| Doctor (أنف وأذن) | `01035555555` | سارة سلامة |
| Receptionist | `01044444444` | نور طارق |
| Receptionist | `01055555555` | عمر يوسف |
| Patient | `01066666666` | محمد حسين |
| Patient | `01077777777` | مروة خالد |
| Patient | `01088888888` | نور باسم |
| Patient | `01099999999` | علي يوسف |
| Patient | `01111111111` | سلوى حمدي |

---

## 🧪 Testing

```bash
# 1. Pre-seed validation (before seeding — no DB changes)
npm run test:pre-seed

# 2. Full API integration tests (requires seeded DB + running server)
npm run test:routes
```

The integration test suite covers all routes end-to-end: auth, doctors, receptionists, appointments, prescriptions, medical reports, and reviews — including automatic OTP capture from console output.

---

## 📁 Project Structure

```
MediLink-BackEnd/
├── app.js                  # Express app setup & middleware
├── server.js               # Server entry point
├── seed.js                 # Database seeder (supports --dry-run)
├── config.env              # Environment variables
├── models/                 # Mongoose schemas
│   ├── userModel.js
│   ├── doctorProfileModel.js
│   ├── patientProfileModel.js
│   ├── receptionistModel.js
│   ├── clinicModel.js
│   ├── specializationModel.js
│   ├── appointmentModel.js
│   ├── prescriptionModel.js
│   ├── medicalReportModel.js
│   ├── reviewModel.js
│   └── activitiesModel.js
├── controllers/            # Route handlers & business logic
│   ├── authController.js
│   ├── doctorController.js
│   ├── patientController.js
│   ├── appointmentController.js
│   ├── prescriptionController.js
│   ├── medicalReportController.js
│   ├── reviewController.js
│   ├── handelerFactory.js  # Generic CRUD factory
│   └── globalErrorHandeler.js
├── routes/                 # Express routers
├── middlewares/            # Custom middleware
├── utils/                  # Helpers (AppError, ApiFeatures, etc.)
├── validationSchema/       # Zod validation schemas
├── test/                   # Test scripts
│   ├── preSeedValidation.js
│   └── testRoutes.js
└── config/                 # Configuration files (Redis, ImageKit)
```

---

## 🔒 Security Features

- ✅ **Helmet** — Secure HTTP headers
- ✅ **Rate Limiting** — 10,000 req/hour per IP
- ✅ **JWT Blacklisting** — Tokens invalidated on logout via Redis
- ✅ **bcrypt** — Passwords hashed with salt rounds of 12
- ✅ **OTP via SMS** — Phone verification with Twilio (6-digit, time-limited)
- ✅ **XSS Protection** — Sanitizes request body
- ✅ **NoSQL Injection** — MongoDB query sanitization
- ✅ **HPP** — HTTP parameter pollution prevention
- ✅ **CORS** — Cross-Origin Resource Sharing configured

---

## 👨‍💻 Team

<div align="center">

| Developer | Role |
|-----------|------|
| Omar Alsheikh | Backend Developer |
| Yousef Sheashia | Backend Developer |

> 🎓 **ITI Graduation Project — Information Technology Institute (ITI)**
>
> Intake: 45 | Track: Full-Stack Web Development (MERN)

</div>

---

## 📄 License

This project is developed for educational purposes as part of the ITI graduation program.

---

<div align="center">

Made with ❤️ by Omar Alsheikh & Yousef Sheashia using Node.js + MongoDB

**MediLink — Connecting Patients with Better Care**

🌐 [medi-link-front-end.vercel.app](https://medi-link-front-end.vercel.app)

</div>
