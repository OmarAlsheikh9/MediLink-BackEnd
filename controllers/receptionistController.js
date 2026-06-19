import Receptionist from "../models/receptionistModel.js";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import flattenAndRespond from "../utils/flattenAndRespond.js";
export const createReceptionist = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    phone,
    password,
    confirmPassword,
    gender,
    status,
    birthDate,
    education,
    workingDays,
    startTime,
    endTime,
  } = req.body;

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
          role: "receptionist",
        },
      ],
      { session },
    );

    const [profile] = await Receptionist.create(
      [
        {
          user: user._id,
          status,
          education,
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
export const getAllReceptionist = catchAsync(async (req, res, next) => {
  const receptionists = await Receptionist.find();

  res.status(200).json({
    status: "success",
    length: receptionists.length,
    data: { receptionists },
  });
});
export const getReceptionist = catchAsync(async (req, res, next) => {
  const receptionist = await Receptionist.findOne({ user: req.params.id });

  if (!receptionist) return next(new AppError("receptionist not found", 404));

  res.status(200).json({
    status: "success",
    data: { receptionist },
  });
});
export const updateReceptionist = catchAsync(async (req, res, next) => {
  delete req.body.user;

  const updatedReceptionist = await Receptionist.findOneAndUpdate(
    { user: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedReceptionist) {
    return next(new AppError("Receptionist not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      receptionist: updatedReceptionist,
    },
  });
});

export const deleteReceptionist = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const profile = await Receptionist.findByIdAndDelete(req.params.id, {
      session,
    });

    if (!profile) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Receptionist not found", 404));
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
