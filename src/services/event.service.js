import Event from '../models/event.model.js';
import EventCategory from '../models/eventcategory.model.js';
import Shop from '../models/shop.model.js';
import upload from "../middlewares/multerConfig.js";

export const getAllEvents = async () => {
    const events = await Event.find().populate('shop').populate('category');
    return events;
};

export const getEventById = async (eventId) => {
    if (!eventId) {
        const error = new Error("Event ID is required");
        error.status = 400;
        throw error;
    }

    const event = await Event.findById(eventId).populate('shop').populate('category');
    if (!event) {
        const error = new Error("Event not found");
        error.status = 404;
        throw error;
    }

    return event;
};

export const addEvent = async (req) => {
    const uploadSingle = upload.single('image');

    return new Promise((resolve, reject) => {
        uploadSingle(req, null, async (err) => {
            if (err) {
                return reject(err);
            }

            try {
                const {
                    title,
                    description,
                    eventDateTime,
                    shop,
                    category,
                    price,
                    isFree
                } = req.body;

                const imageFile = req.file;

                if (!title || !description || !eventDateTime || !shop || !category) {
                    const error = new Error("Invalid input data");
                    error.status = 400;
                    return reject(error);
                }

                const existingCategory = await EventCategory.findOne({ name: category });
                
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

                const event = await Event.create({
                    title,
                    description,
                    eventDateTime,
                    shop: existingShop._id,
                    category: existingCategory._id,
                    image: imageFile ? `/storages/${imageFile.filename}` : null,
                    price: price || 0,
                    isFree: isFree === true || isFree === 'true'
                });

                resolve(event);
            } catch (error) {
                reject(error);
            }
        });
    });
};

export const updateEvent = async (eventId, req) => {
  return new Promise((resolve, reject) => {
    const uploadFields = upload.fields([
      { name: "image", maxCount: 1 },
    ]);

    uploadFields(req, null, async (err) => {
      if (err) return reject(err);

      try {
        const { title, description, eventDateTime, location, price, isFree } = req.body;
        const imageFile = req.files?.image?.[0];

        const event = await Event.findById(eventId);
        if (!event) {
          const error = new Error("Event not found");
          error.status = 404;
          return reject(error);
        }

        const updateData = {
          title:         title         || event.title,
          description:   description   || event.description,
          eventDateTime: eventDateTime || event.eventDateTime,
          location:      location      || event.location,
          price:         price         ?? event.price,
          isFree:        isFree !== undefined ? isFree === 'true' : event.isFree,
        };

        if (imageFile) updateData.image = `/storages/${imageFile.filename}`;

        if (req.body.category) {
          const existingCategory = await EventCategory.findById(req.body.category);
          if (!existingCategory) {
            const error = new Error("Catégorie introuvable");
            error.status = 404;
            return reject(error);
          }
          updateData.category = existingCategory._id;
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true })
          .populate('category')
          .populate('shop');

        resolve(updatedEvent);

      } catch (error) {
        reject(error);
      }
    });
  });
};

export const deleteEvent = async (eventId) => {
    if (!eventId) {
        const error = new Error("Event ID is required");
        error.status = 400;
        throw error;
    }

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
        const error = new Error("Event not found");
        error.status = 404;
        throw error;
    }

    return event;
};

export const updateEventCategory = async (categoryId, input) => {
    if (!categoryId) {
        const error = new Error("Category ID is required");
        error.status = 400;
        throw error;
    }

    const category = await EventCategory.findByIdAndUpdate(categoryId, input, { new: true });
    if (!category) {
        const error = new Error("Event category not found");
        error.status = 404;
        throw error;
    }

    return category;
};

export const deleteEventCategory = async (categoryId) => {
    if (!categoryId) {
        const error = new Error("Category ID is required");
        error.status = 400;
        throw error;
    }

    const category = await EventCategory.findByIdAndDelete(categoryId);
    if (!category) {
        const error = new Error("Event category not found");
        error.status = 404;
        throw error;
    }

    return category;
};

export const addEventCategory = async (input) => {
    if (!input || !input.name) {
        const error = new Error("Invalid input data");
        error.status = 400;
        throw error;
    }

    const name = input.name;
    const description = input.description || '';

    const eventCategory = await EventCategory.create({
        name: name,
        description: description,
    });

    return eventCategory;
};