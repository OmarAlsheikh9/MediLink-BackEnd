import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import User from "./models/userModel.js";
import DoctorProfile from "./models/doctorProfileModel.js";
import PatientProfile from "./models/patientProfileModel.js";
import Receptionist from "./models/receptionistModel.js";
import Specialization from "./models/specializationModel.js";
import Clinic from "./models/clinicModel.js";
import Appointment from "./models/appointmentModel.js";
import Prescription from "./models/prescriptionModel.js";
import MedicalReport from "./models/medicalReportModel.js";
import Review from "./models/reviewModel.js";

const HASHED_PASSWORD = await bcrypt.hash("Test@1234", 12);

const seed = async () => {
  await mongoose.connect(process.env.LOCAL_DATABASE);
  console.log("✅ DB connected");

  // ── 1. CLEAN ──────────────────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany(),
    DoctorProfile.deleteMany(),
    PatientProfile.deleteMany(),
    Receptionist.deleteMany(),
    Specialization.deleteMany(),
    Clinic.deleteMany(),
    Appointment.deleteMany(),
    Prescription.deleteMany(),
    MedicalReport.deleteMany(),
    Review.deleteMany(),
  ]);
  console.log("🧹 Collections cleared");

  // ── 2. SPECIALIZATIONS (Arabic names) ────────────────────────────────────
  const [cardiology, dermatology, pediatrics] = await Specialization.insertMany([
    { name: "أمراض القلب والأوعية الدموية", consultationFee: 300 },
    { name: "الأمراض الجلدية والتناسلية",   consultationFee: 200 },
    { name: "طب الأطفال وحديثي الولادة",    consultationFee: 150 },
  ]);
  console.log("✅ Specializations created");

  // ── 3. CLINIC ─────────────────────────────────────────────────────────────
  await Clinic.create({
    name: "Medilink Clinic",
    address: "Egypt Cairo",
    description: "A modern clinic providing high quality healthcare services.",
    phone: "01012345678",
    email: "medilink@clinic.com",
    schedule: {
      appointmentDuration: 25,
      maxAppointmentsPerDay: 10,
      workingDays: [
        { day: "saturday",    isActive: true,  startTime: "09:00", endTime: "17:00" },
        { day: "sunday",    isActive: true,  startTime: "09:00", endTime: "17:00" },
        { day: "monday",  isActive: true,  startTime: "09:00", endTime: "17:00" },
        { day: "tuesday", isActive: true,  startTime: "09:00", endTime: "17:00" },
        { day: "wednesday", isActive: true,  startTime: "09:00", endTime: "17:00" },
        { day: "thursday",   isActive: false, startTime: null,    endTime: null    },
        { day: "friday",   isActive: false, startTime: null,    endTime: null    },
      ],
    },
  });
  console.log("✅ Clinic created");

  // ── 4. ADMIN ──────────────────────────────────────────────────────────────
  const admin = await User.create({
    firstName: "توفيق",
    lastName: "عبدالله",
    gender: "male",
    birthDate: new Date("1980-01-01"),
    phone: "01000000000",
    role: "admin",
    password: HASHED_PASSWORD,
    isPreHashed: true,
  });
  console.log("✅ Admin created");

  // ── 5. DOCTORS ────────────────────────────────────────────────────────────
  const doctorUsers = await User.insertMany([
    {
      firstName: "أحمد",
      lastName: "الألفي",
      gender: "male",
      birthDate: new Date("1980-05-15"),
      phone: "01011111111",
      role: "doctor",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
    {
      firstName: "أماني",
      lastName: "العطار",
      gender: "female",
      birthDate: new Date("1985-08-20"),
      phone: "01022222222",
      role: "doctor",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
    {
      firstName: "يمان",
      lastName: "علاء",
      gender: "male",
      birthDate: new Date("1978-03-10"),
      phone: "01033333333",
      role: "doctor",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
  ]);

  const [doctor1, doctor2, doctor3] = doctorUsers;

  await DoctorProfile.insertMany([
    {
      user: doctor1._id,
      specialization: cardiology._id,
      experienceYears: 10,
      workingDays: ["saturday", "sunday", "monday", "tuesday", "wednesday"],
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      user: doctor2._id,
      specialization: dermatology._id,
      experienceYears: 7,
      workingDays: ["saturday", "sunday", "monday", "tuesday", "wednesday"],
      startTime: "10:00",
      endTime: "18:00",
    },
    {
      user: doctor3._id,
      specialization: pediatrics._id,
      experienceYears: 15,
      workingDays: ["saturday", "sunday", "monday", "tuesday", "wednesday"],
      startTime: "08:00",
      endTime: "16:00",
    },
  ]);
  console.log("✅ Doctors + profiles created");

  // ── 6. RECEPTIONISTS ──────────────────────────────────────────────────────
  const receptionistUsers = await User.insertMany([
    {
      firstName: "نور",
      lastName: "طارق",
      gender: "female",
      birthDate: new Date("1995-07-12"),
      phone: "01044444444",
      role: "receptionist",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
    {
      firstName: "عمر",
      lastName: "يوسف",
      gender: "male",
      birthDate: new Date("1993-11-25"),
      phone: "01055555555",
      role: "receptionist",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
  ]);

  const [rec1, rec2] = receptionistUsers;

  await Receptionist.insertMany([
    {
      user: rec1._id,
      workingDays: ["saturday", "sunday", "monday", "tuesday", "wednesday"],
      education: "Bachelor of Business Administration",
      status: "active",
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      user: rec2._id,
      workingDays: ["saturday", "sunday", "monday", "tuesday", "wednesday"],
      education: "Diploma in Health Administration",
      status: "active",
      startTime: "12:00",
      endTime: "20:00",
    },
  ]);
  console.log("✅ Receptionists + profiles created");

  // ── 7. PATIENTS ───────────────────────────────────────────────────────────
  const patientUsers = await User.insertMany([
    {
      firstName: "محمد",
      lastName: "حسين",
      gender: "male",
      birthDate: new Date("1990-02-14"),
      phone: "01066666666",
      role: "patient",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
    {
      firstName: "مروة",
      lastName: "خالد",
      gender: "female",
      birthDate: new Date("1992-06-30"),
      phone: "01077777777",
      role: "patient",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
    {
      firstName: "نور",
      lastName: "باسم",
      gender: "female",
      birthDate: new Date("1998-09-05"),
      phone: "01088888888",
      role: "patient",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
    {
      firstName: "علي",
      lastName: "يوسف",
      gender: "male",
      birthDate: new Date("1985-12-20"),
      phone: "01099999999",
      role: "patient",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
    {
      firstName: "سلوى",
      lastName: "حمدي",
      gender: "female",
      birthDate: new Date("2000-04-18"),
      phone: "01111111111",
      role: "patient",
      password: HASHED_PASSWORD,
      isPreHashed: true,
    },
  ]);

  const [patient1, patient2, patient3, patient4, patient5] = patientUsers;

  await PatientProfile.insertMany([
    {
      user: patient1._id,
      bloodType: "A+",
      allergies: ["Penicillin"],
      chronicConditions: ["Hypertension"],
    },
    {
      user: patient2._id,
      bloodType: "B-",
      allergies: [],
      chronicConditions: [],
    },
    {
      user: patient3._id,
      bloodType: "O+",
      allergies: ["Aspirin"],
      chronicConditions: ["Diabetes"],
    },
    {
      user: patient4._id,
      bloodType: "AB+",
      allergies: [],
      chronicConditions: ["Asthma"],
    },
    {
      user: patient5._id,
      bloodType: "A-",
      allergies: [],
      chronicConditions: [],
    },
  ]);
  console.log("✅ Patients + profiles created");

  // ── 8. APPOINTMENTS ───────────────────────────────────────────────────────
  // ✅ status values match your model enum exactly
  const [apt1, apt2, apt3, apt4] = await Appointment.insertMany([
    {
      patient: patient1._id,
      doctor: doctor1._id,
      date: new Date("2025-12-10"),
      slotTime: "09:00",
      status: "مكتمل",
      fees: 300,
      notes: "Regular checkup",
    },
    {
      patient: patient2._id,
      doctor: doctor1._id,
      date: new Date("2025-12-12"),
      slotTime: "09:25",
      status: "مكتمل",
      fees: 300,
      notes: "Follow up",
    },
    {
      patient: patient3._id,
      doctor: doctor2._id,
      date: new Date("2025-12-15"),
      slotTime: "10:00",
      status: "مكتمل",
      fees: 200,
    },
    {
      patient: patient1._id,
      doctor: doctor1._id,
      date: new Date("2026-01-05"),
      slotTime: "09:00",
      status: "مكتمل",
      fees: 300,
    },
  ]);

  await Appointment.insertMany([
    {
      patient: patient4._id,
      doctor: doctor1._id,
      date: new Date("2026-07-20"),
      slotTime: "10:00",
      status: "قيد الانتظار",
      fees: 300,
    },
    {
      patient: patient5._id,
      doctor: doctor2._id,
      date: new Date("2026-07-20"),
      slotTime: "10:25",
      status: "قيد الانتظار",
      fees: 200,
    },
    {
      patient: patient2._id,
      doctor: doctor3._id,
      date: new Date("2026-07-21"),
      slotTime: "08:00",
      status: "قيد الانتظار",
      fees: 150,
    },
    {
      patient: patient3._id,
      doctor: doctor1._id,
      date: new Date("2026-07-22"),
      slotTime: "09:25",
      status: "ملغى",
      cancelledBy: "patient",
      fees: 300,
    },
  ]);
  console.log("✅ Appointments created");

  // ── 9. PRESCRIPTIONS ──────────────────────────────────────────────────────
  await Prescription.insertMany([
    {
      patient: patient1._id,
      doctor: doctor1._id,
      appointment: apt1._id,
      medicines: [
        { name: "Ventolin",     dose: "1 حبة", frequency: "كل 6 ساعات",  duration: "3 أيام"  },
        { name: "Paracetamol",  dose: "1 حبة", frequency: "كل 8 ساعات",  duration: "7 أيام"  },
      ],
    },
    {
      patient: patient2._id,
      doctor: doctor1._id,
      appointment: apt2._id,
      medicines: [
        { name: "Amoxicillin",  dose: "1 حبة", frequency: "كل 8 ساعات",  duration: "7 أيام"  },
        { name: "Ibuprofen",    dose: "1 حبة", frequency: "كل 12 ساعة",  duration: "5 أيام"  },
      ],
    },
    {
      patient: patient3._id,
      doctor: doctor2._id,
      appointment: apt3._id,
      medicines: [
        { name: "Cetirizine",   dose: "1 حبة", frequency: "مرة يومياً",  duration: "14 يوم"  },
      ],
    },
    {
      patient: patient1._id,
      doctor: doctor1._id,
      appointment: apt4._id,
      medicines: [
        { name: "Ventolin",     dose: "1 حبة", frequency: "كل 6 ساعات",  duration: "3 أيام"  },
        { name: "Paracetamol",  dose: "1 حبة", frequency: "كل 8 ساعات",  duration: "7 أيام"  },
      ],
    },
  ]);
  console.log("✅ Prescriptions created");

  // ── 10. MEDICAL REPORTS ───────────────────────────────────────────────────
  await MedicalReport.insertMany([
    {
      patient: patient1._id,
      doctor: doctor1._id,
      appointment: apt1._id,
      diagnosis: "حساسية شديدة",
      notes: "سعال شديد واحتقان في الأنف والحنجرة",
    },
    {
      patient: patient2._id,
      doctor: doctor1._id,
      appointment: apt2._id,
      diagnosis: "التهاب الحلق الحاد",
      notes: "يحتاج المريض للراحة التامة وشرب السوائل الدافئة",
    },
    {
      patient: patient3._id,
      doctor: doctor2._id,
      appointment: apt3._id,
      diagnosis: "حساسية جلدية",
      notes: "تجنب التعرض للمسببات البيئية",
    },
    {
      patient: patient1._id,
      doctor: doctor1._id,
      appointment: apt4._id,
      diagnosis: "حساسية شديدة",
      notes: "تحسن ملحوظ مقارنة بالزيارة السابقة",
    },
  ]);
  console.log("✅ Medical reports created");

  // ── 11. REVIEWS ───────────────────────────────────────────────────────────
  await Review.insertMany([
    {
      patient: patient1._id,
      doctor: doctor1._id,
      appointment: apt1._id,
      stars: 5,
      comment: "دكتور ممتاز ومتعاون جداً، أنصح به بشدة",
    },
    {
      patient: patient2._id,
      doctor: doctor1._id,
      appointment: apt2._id,
      stars: 4,
      comment: "تجربة جيدة جداً، الدكتور محترف ودقيق في التشخيص",
    },
    {
      patient: patient3._id,
      doctor: doctor2._id,
      appointment: apt3._id,
      stars: 5,
      comment: "الدكتورة متميزة ومهتمة بالمريض بشكل كبير",
    },
  ]);
  console.log("✅ Reviews created");

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  console.log("\n🎉 Database seeded successfully!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔐 All passwords → Test@1234");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👤 Admin       → 01000000000  (توفيق عبدالله)");
  console.log("👨‍⚕️ Doctor 1    → 01011111111  (أحمد الألفي    - قلب)");
  console.log("👩‍⚕️ Doctor 2    → 01022222222  (أماني العطار   - جلدية)");
  console.log("👨‍⚕️ Doctor 3    → 01033333333  (يمان علاء      - أطفال)");
  console.log("🗂️  Recep 1     → 01044444444  (نور طارق)");
  console.log("🗂️  Recep 2     → 01055555555  (عمر يوسف)");
  console.log("🧑‍🤝‍🧑 Patient 1  → 01066666666  (محمد حسين  - له زيارتان مكتملتان)");
  console.log("🧑‍🤝‍🧑 Patient 2  → 01077777777  (مروة خالد)");
  console.log("🧑‍🤝‍🧑 Patient 3  → 01088888888  (نور باسم)");
  console.log("🧑‍🤝‍🧑 Patient 4  → 01099999999  (علي يوسف)");
  console.log("🧑‍🤝‍🧑 Patient 5  → 01111111111  (سلوى حمدي)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});