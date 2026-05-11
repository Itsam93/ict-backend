import CtaContent from "../models/CtaContent.js";

export const getCta = async (req, res) => {
  const data = await CtaContent.findOne();

  res.json({
    success: true,
    data,
  });
};

export const updateCta = async (req, res) => {
  let cta = await CtaContent.findOne();

  if (cta) {
    cta = await CtaContent.findByIdAndUpdate(cta._id, req.body, {
      new: true,
    });
  } else {
    cta = await CtaContent.create(req.body);
  }

  res.json({
    success: true,
    data: cta,
  });
};