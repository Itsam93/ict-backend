import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Development",
        "Marketing",
        "Creative",
        "Productivity",
        "Fundamentals",
      ],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: {
      type: String, 
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: String, 
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;