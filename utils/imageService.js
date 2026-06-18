import sharp from "sharp";

export const processImage = async (buffer) => {
  return await sharp(buffer)
    .resize(800, 800)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();
};
