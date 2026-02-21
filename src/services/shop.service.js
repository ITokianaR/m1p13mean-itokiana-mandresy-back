import Category from '../models/category.model.js';
import Shop from '../models/shop.model.js';
import upload from "../middlewares/multerConfig.js";

export const addCategory = async (input) => {
    if (!input || !input.name || !input.description) {
        const error = new Error("Invalid input data");
        error.status = 400;
        throw error;
    }

    const name = input.name;
    const description = input.description;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        const error = new Error("Category already exists");
        error.status = 409;
        throw error;
    }

    const category = await Category.create({
        name: name,
        description: description,
    });

    return category;
}

export const addShop = async (req) => {
  return new Promise((resolve, reject) => {

    const uploadFields = upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "coverPhoto", maxCount: 1 },
    ]);

    uploadFields(req, null, async (err) => {
      if (err) {
        return reject(err);
      }

      try {
        const {
          name,
          description,
          location,
          openingHours,
          category,
          phoneNumber
        } = req.body;

        const logoFile = req.files?.logo?.[0];
        const coverFile = req.files?.coverPhoto?.[0];

        if (
          !name ||
          !description ||
          !location ||
          !category ||
          !logoFile ||
          !phoneNumber ||
          !coverFile
        ) {
          const error = new Error("Invalid input data");
          error.status = 400;
          return reject(error);
        }

        const existingCategory = await Category.findOne({ name: category });

        if (!existingCategory) {
          const error = new Error("Category not found");
          error.status = 404;
          return reject(error);
        }

        const shop = await Shop.create({
          name,
          description,
          location,
          openingHours,
          category: existingCategory._id,
          logo: `/storages/${logoFile.filename}`,
          coverPhoto: `/storages/${coverFile.filename}`,
          phoneNumber
        });

        resolve(shop);

      } catch (error) {
        reject(error);
      }
    });
  });
};

export const getShopList = async () => {
  const shops = await Shop.find().populate('category');
  return shops;
};