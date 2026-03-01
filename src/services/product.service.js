import upload from "../middlewares/multerConfig.js";
import Product from "../models/product.model.js";
import ProductCategory from "../models/productcategory.model.js";
import Shop from "../models/shop.model.js";

export const addProduct = async (req) => {
        const uploadSingle = upload.single('image');

        return new Promise((resolve, reject) => {
            uploadSingle(req, null, async (err) => {
                if (err) {
                    return reject(err);
                }

                try {
                    const {
                        name,
                        description,
                        price,
                        stock,
                        category,
                        shop
                    } = req.body;

                    const imageFile = req.file;

                    const existingCategory = await ProductCategory.findOne({ name: category });
                    if (!existingCategory) {
                        const error = new Error("Category not found");
                        error.status = 404;
                        return reject(error);
                    }

                    const existingShop = await Shop.findOne({ name: shop });
                    if (!existingShop) {
                        const error = new Error("Shop not found");
                        error.status = 404;
                        return reject(error);
                    }

                    if (!name || !price || !stock || !category) {
                        const error = new Error("Name, price, stock and category are required");
                        error.status = 400;
                        return reject(error);
                    }

                    const product = await Product.create({
                        name,
                        description,
                        price,
                        stock,
                        category: existingCategory._id,
                        shop: existingShop._id,
                        image: imageFile ? `/storages/${imageFile.filename}` : null
                    });

                    resolve(product);
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

export const getAllProduct = async () => {
  const product = await Product.find();
  return product;
};

export const addCategory = async (input) => {
    if (!input || !input.name || !input.description) {
        const error = new Error("Invalid input data");
        error.status = 400;
        throw error;
    }

    const existingCategory = await ProductCategory.findOne({ name: input.name });
    if (existingCategory) {
        const error = new Error("Category already exists");
        error.status = 409;
        throw error;
    }

    const category = await ProductCategory.create({
        name: input.name,
        description: input.description,
    });

    return category;
};