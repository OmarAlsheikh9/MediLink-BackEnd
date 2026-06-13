import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import DoctorProfile from "../models/doctorProfileModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import flattenAndRespond from "../utils/flattenAndRespond.js";

export const createDoctor = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    phone,
    password,
    confirmPassword,
    gender,
    birthDate,
    specialization,
    experienceYears,
    workingDays,
    startTime,
    endTime,
  } = req.body;

  if (password !== confirmPassword)
    return next(new AppError("passwords do not match", 400));

  const existingUser = await User.findOne({ phone });
  if (existingUser)
    return next(new AppError("phone number already in use", 400));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [user] = await User.create(
      [
        {
          firstName,
          lastName,
          phone,
          password,
          confirmPassword,
          gender,
          birthDate,
          role: "doctor",
        },
      ],
      { session },
    );

    const [profile] = await DoctorProfile.create(
      [
        {
          user: user._id,
          specialization,
          experienceYears,
          workingDays,
          startTime,
          endTime,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    user.password = undefined;

    res.status(201).json({
      status: "success",
      data: { user, profile },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
});

export const getAllDoctors = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    phone,
    specialization,
    experienceYears,
    page = 1,
    limit = 10,
  } = req.query;

  const matchStage = {};
  if (specialization)
    matchStage.specialization = new RegExp(specialization, "i");
  if (experienceYears) matchStage.experienceYears = Number(experienceYears); // fix: was RegExp

  const userMatchStage = {};
  if (firstName) userMatchStage["user.firstName"] = new RegExp(firstName, "i");
  if (lastName) userMatchStage["user.lastName"] = new RegExp(lastName, "i");
  if (phone) userMatchStage["user.phone"] = new RegExp(phone, "i");

  const skip = (Number(page) - 1) * Number(limit);

  const doctors = await DoctorProfile.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },

    { $unwind: "$user" },

    { $match: userMatchStage },

    {
      $project: {
        specialization: 1,
        experienceYears: 1,
        workingDays: 1,
        startTime: 1,
        endTime: 1,
        "user.firstName": 1,
        "user.lastName": 1,
        "user.phone": 1,
        "user.photo": 1,
        "user.gender": 1,
        "user.birthDate": 1,
      },
    },

    { $sort: { _id: 1 } },

    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  flattenAndRespond(res, { key: "doctors", data: doctors });
});

export const getDoctor = catchAsync(async (req, res, next) => {
  const doctor = await DoctorProfile.findById(req.params.id).lean();

  if (!doctor) return next(new AppError("doctor not found", 404));

  flattenAndRespond(res, { key: "doctor", data: doctor });
});
export const updateDoctor = catchAsync(async (req, res, next) => {
  delete req.body.user;

  const updatedDoctor = await DoctorProfile.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedDoctor) {
    return next(new AppError("Doctor not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doctor: updatedDoctor,
    },
  });
});

export const deleteDoctor = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const profile = await DoctorProfile.findByIdAndDelete(req.params.id, {
      session,
    });

    if (!profile) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Doctor not found", 404));
    }

    await User.findByIdAndUpdate(
      profile.user,
      {
        active: false,
        role: "patient",
      },
      {
        session,
        runValidators: true,
      },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});

export const searchUserByPhone = catchAsync(async (req, res, next) => {
  const { phone } = req.query;
  if (!phone) return next(new AppError("phone query param is required", 400));

  const user = await User.findOne({ phone }).select(
    "firstName lastName phone role gender birthDate",
  );
  if (!user) return next(new AppError("no user found", 404));

  res.status(200).json({
    status: "success",
    data: { user },
  });
});
