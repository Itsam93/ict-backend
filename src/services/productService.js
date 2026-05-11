import Course from "../models/Course.js";
import Resource from "../models/Resource.js";

export const getProductByType = async (type, id) => {
  const map = {
    course: Course,
    resource: Resource,
  };

  const Model = map[type];

  if (!Model) return null;

  return await Model.findById(id);
};