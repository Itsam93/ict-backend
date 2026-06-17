import Purchase from "../models/Purchase.js";
import Enrollment from "../models/Enrollment.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const reference = event.data.reference;

    const purchase = await Purchase.findOne({ reference });

    if (!purchase) return res.sendStatus(200);

    purchase.status = "paid";
    purchase.paidAt = new Date();
    await purchase.save();

    if (purchase.type === "course") {
      await Enrollment.updateOne(
        { email: purchase.email, course: purchase.course },
        {
          email: purchase.email,
          course: purchase.course,
          status: "enrolled",
        },
        { upsert: true }
      );
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export const uploadToCloudinary = async (fileBuffer, folder = "resources") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};



