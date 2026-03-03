import Category from '../models/category.model.js';
import Shop from '../models/shop.model.js';
import upload from "../middlewares/multerConfig.js";
import deleteFileFromStorage from "../middlewares/deleteFile.js";

export const addCategory = async (input) => {
    if (!input || !input.name || !input.description) {
        const error = new Error("Invalid input data");
        error.status = 400;
        throw error;
    }

    const existingCategory = await Category.findOne({ name: input.name });
    if (existingCategory) {
        const error = new Error("Category already exists");
        error.status = 409;
        throw error;
    }

    const category = await Category.create({
        name: input.name,
        description: input.description,
    });

    return category;
};

export const addShop = async (req) => {
  return new Promise((resolve, reject) => {

    const uploadFields = upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "coverPhoto", maxCount: 1 },
    ]);

    uploadFields(req, null, async (err) => {
      if (err) return reject(err);

      try {
        const { name, description, location, openingHours, category, phoneNumber } = req.body;

        const logoFile    = req.files?.logo?.[0];
        const coverFile   = req.files?.coverPhoto?.[0];

        if (!name || !description || !location || !category || !logoFile || !coverFile) {
          const error = new Error("Champs requis manquants (name, description, location, category, logo, coverPhoto)");
          error.status = 400;
          return reject(error);
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
          const error = new Error("Catégorie introuvable");
          error.status = 404;
          return reject(error);
        }

        let parsedLocation = location;
        if (typeof location === 'string') {
          try { parsedLocation = JSON.parse(location); } catch(e) {}
        }

        const shop = await Shop.create({
          name,
          description,
          location: parsedLocation,
          openingHours: openingHours || undefined,
          category: existingCategory._id,
          logo:       `/storages/${logoFile.filename}`,
          coverPhoto: `/storages/${coverFile.filename}`,
          phoneNumber: phoneNumber || null
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

export const updateShop = async (shopId, req) => {
  return new Promise((resolve, reject) => {
    const uploadFields = upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "coverPhoto", maxCount: 1 },
    ]);

    uploadFields(req, null, async (err) => {
      if (err) return reject(err);

      try {
        const { name, description, location, openingHours, category, phoneNumber } = req.body;
        const logoFile  = req.files?.logo?.[0];
        const coverFile = req.files?.coverPhoto?.[0];

        const shop = await Shop.findById(shopId);
        if (!shop) {
          const error = new Error("Shop not found");
          error.status = 404;
          return reject(error);
        }

        let parsedLocation = location;
        if (typeof location === 'string') {
          try { parsedLocation = JSON.parse(location); } catch(e) {}
        }

        const updateData = {
          name:         name         || shop.name,
          description:  description  || shop.description,
          location:     parsedLocation || shop.location,
          openingHours: openingHours || shop.openingHours,
          phoneNumber:  phoneNumber  || shop.phoneNumber
        };

        if (logoFile) {
          deleteFileFromStorage(shop.logo);
          updateData.logo = `/storages/${logoFile.filename}`;
        }
        if (coverFile) {
          deleteFileFromStorage(shop.coverPhoto);
          updateData.coverPhoto = `/storages/${coverFile.filename}`;
        }

        if (category) {
          const existingCategory = await Category.findById(category);
          if (!existingCategory) {
            const error = new Error("Catégorie introuvable");
            error.status = 404;
            return reject(error);
          }
          updateData.category = existingCategory._id;
        }

        const updatedShop = await Shop.findByIdAndUpdate(shopId, updateData, { new: true }).populate('category');
        resolve(updatedShop);

      } catch (error) {
        reject(error);
      }
    });
  });
};

export const deleteShop = async (shopId) => {
  const shop = await Shop.findByIdAndDelete(shopId);
  if (!shop) {
    const error = new Error("Shop not found");
    error.status = 404;
    throw error;
  }

  deleteFileFromStorage(shop.logo);
  deleteFileFromStorage(shop.coverPhoto);

  return shop;
};

export const getShopByCategory = async (categoryId) => {
  const shops = await Shop.find({ category: categoryId }).populate('category');
  return shops;
};

export const getAllCategory = async () => {
  const categories = await Category.find();
  return categories;
};

export const getShopById = async (shopId) => {
  const shop = await Shop.findById(shopId).populate('category');
  if (!shop) {
    const error = new Error("Shop not found");
    error.status = 404;
    throw error;
  }
  return shop;
};

// 🎲 NOUVEAU : Sélectionner un restaurant aléatoire
export const getRandomRestaurant = async () => {
  const restaurantCategory = await Category.findOne({
    name: { $regex: /restaur/i }
  });

  if (!restaurantCategory) {
    const error = new Error("Catégorie restaurant introuvable");
    error.status = 404;
    throw error;
  }

  const count = await Shop.countDocuments({ category: restaurantCategory._id });

  if (count === 0) {
    const error = new Error("Aucun restaurant disponible");
    error.status = 404;
    throw error;
  }

  const randomIndex = Math.floor(Math.random() * count);
  const shop = await Shop.findOne({ category: restaurantCategory._id })
    .skip(randomIndex)
    .populate('category');

  return shop;
};