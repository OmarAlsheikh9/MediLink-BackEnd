// utils/uploadToImageKit.js
import imagekit from "../config/imagekit.js";
import catchAsync from "./catchAsync.js";

export const uploadMultipleToImageKit = (folder) =>
  catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileName = `${folder}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`;

      const uploaded = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName,
        folder: `/${folder}`,
      });

      // store both url and fileId — fileId needed for deletion later
      uploadedFiles.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }

    req.uploadedFiles = uploadedFiles; // pass to next middleware
    next();
  });
