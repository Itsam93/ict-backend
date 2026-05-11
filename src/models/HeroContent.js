import mongoose from "mongoose";

const heroContentSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      default: "Empowering Digital Skills",
    },
    title: {
      type: String,
      required: true,
    },
    highlightText: {
      type: String,
      default: "Digital Skills",
    },
    description: {
      type: String,
      required: true,
    },
    primaryCTA: {
      type: String,
      default: "Explore Courses",
    },
    secondaryCTA: {
      type: String,
      default: "Get Started",
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    }, 
  },
  { timestamps: true }
);

const HeroContent = mongoose.model("HeroContent", heroContentSchema);

export default HeroContent;