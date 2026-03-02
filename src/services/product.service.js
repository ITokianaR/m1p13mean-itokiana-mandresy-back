import upload from "../middlewares/multerConfig.js";
import Product from "../models/product.model.js";
import ProductCategory from "../models/productcategory.model.js";
import Shop from "../models/shop.model.js";

//  GET tous les produits 
export const getAllProduct = async () => {
    const products = await Product.find()
        .populate('shop', 'name')       
        .populate('category', 'name');  
    return products;
};

// GET produits d'une boutique 
export const getProductsByShop = async (shopId) => {
    const products = await Product.find({ shop: shopId })
        .populate('category', 'name');
    return products;
};

// GET un produit par ID 
export const getProductById = async (productId) => {
    const product = await Product.findById(productId)
        .populate('shop', 'name')
        .populate('category', 'name');
    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    return product;
};

// POST ajouter un produit 
export const addProduct = async (req) => {
    const uploadSingle = upload.single('image');

    return new Promise((resolve, reject) => {
        uploadSingle(req, null, async (err) => {
            if (err) return reject(err);

            try {
                const { name, description, price, stock, category, shop } = req.body;
                const imageFile = req.file;

                if (!name || !price || !stock || !category || !shop) {
                    const error = new Error("Name, price, stock, category and shop are required");
                    error.status = 400;
                    return reject(error);
                }

                // Cherche la catégorie par nom
                const existingCategory = await ProductCategory.findOne({ name: category });
                if (!existingCategory) {
                    const error = new Error("Category not found");
                    error.status = 404;
                    return reject(error);
                }

                const existingShop = await Shop.findById(shop);
                if (!existingShop) {
                    const error = new Error("Shop not found");
                    error.status = 404;
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

                // Retourner le produit avec populate
                const populated = await Product.findById(product._id)
                    .populate('shop', 'name')
                    .populate('category', 'name');

                resolve(populated);
            } catch (error) {
                reject(error);
            }
        });
    });
};

//  PUT modifier un produit 
export const updateProduct = async (productId, req) => {
    const uploadSingle = upload.single('image');

    return new Promise((resolve, reject) => {
        uploadSingle(req, null, async (err) => {
            if (err) return reject(err);

            try {
                const { name, description, price, stock, category } = req.body;
                const imageFile = req.file;

                const updateData = {};
                if (name)        updateData.name        = name;
                if (description) updateData.description = description;
                if (price)       updateData.price       = price;
                if (stock)       updateData.stock       = stock;
                if (imageFile)   updateData.image       = `/storages/${imageFile.filename}`;

                if (category) {
                    const existingCategory = await ProductCategory.findOne({ name: category });
                    if (!existingCategory) {
                        const error = new Error("Category not found");
                        error.status = 404;
                        return reject(error);
                    }
                    updateData.category = existingCategory._id;
                }

                const product = await Product.findByIdAndUpdate(
                    productId,
                    updateData,
                    { new: true }
                )
                .populate('shop', 'name')
                .populate('category', 'name');

                if (!product) {
                    const error = new Error("Product not found");
                    error.status = 404;
                    return reject(error);
                }

                resolve(product);
            } catch (error) {
                reject(error);
            }
        });
    });
};

//  DELETE supprimer un produit 
export const deleteProduct = async (productId) => {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }
    return { message: "Product deleted successfully", product };
};

// GET toutes les catégories produits
export const getAllProductCategories = async () => {
    const categories = await ProductCategory.find();
    return categories;
};

// POST ajouter une catégorie produit 
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