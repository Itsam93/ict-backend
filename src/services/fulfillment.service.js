// services/fulfillment.service.js
import Purchase from "../models/Purchase.js";
import Enrollment from "../models/Enrollment.js";

export const fulfillPurchase = async ({
  productType,
  productId,
  email,
  amount,
  reference,
}) => {
  if (productType === "resource") {
    const exists = await Purchase.findOne({
      email,
      resource: productId,
    });

    if (!exists) {
      await Purchase.create({
        email,
        resource: productId,
        amount,
        reference,
        status: "paid",
      });
    }
  }

  if (productType === "course") {
    const exists = await Enrollment.findOne({
      email,
      course: productId,
    });

    if (!exists) {
      await Enrollment.create({
        email,
        course: productId,
        status: "enrolled",
      });
    }
  }
};