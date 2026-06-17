import Transaction from "../models/Transaction.js";

export const trackView = async (req, res) => {
  try {
    const { resourceId, duration } = req.body;

    const tx = await Transaction.findOne({
      userId: req.user.id,
      productId: resourceId,
    });

    if (!tx) {
      return res.status(403).json({ message: "No access" });
    }

    tx.viewedAt = tx.viewedAt || new Date();
    tx.lastViewedAt = new Date();
    tx.viewDuration += duration || 0;

    await tx.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markCompleted = async (req, res) => {
  try {
    const { resourceId } = req.body;

    const tx = await Transaction.findOne({
      userId: req.user.id,
      productId: resourceId,
    });

    if (!tx) return res.status(403).json({ message: "No access" });

    tx.completed = true;
    tx.completedAt = new Date();

    await tx.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};