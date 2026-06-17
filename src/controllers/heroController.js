import HeroContent from "../models/HeroContent.js";

export const createHeroContent = async (req, res) => {
  try {
    const hero = await HeroContent.create(req.body);

    res.status(201).json({
      success: true,
      data: hero,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHeroContents = async (req, res) => {
  try {
    const heroes = await HeroContent.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: heroes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleHeroContent = async (req, res) => {
  try {
    const hero = await HeroContent.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      });
    }

    res.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateHeroContent = async (req, res) => {
  try {
    const hero = await HeroContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      });
    }

    res.json({
      success: true,
      data: hero,
      message: "Hero updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteHeroContent = async (req, res) => {
  try {
    const hero = await HeroContent.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      });
    }

    await hero.deleteOne();

    res.json({
      success: true,
      message: "Hero deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const setActiveHero = async (req, res) => {
  try {
    const { id } = req.params;

    await HeroContent.updateMany({}, { isActive: false });

    const hero = await HeroContent.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      });
    }

    res.json({
      success: true,
      message: "Active hero set",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};