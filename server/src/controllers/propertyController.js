import Property from "../models/propertyModel.js";
import imagekit from "../config/imagekit.js";

export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      area,
    } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await imagekit.upload({
          file: file.buffer.toString("base64"),
          fileName: file.originalname,
          folder: "/properties",
        });

        imageUrls.push(result.url);
      }
    }

    const property = await Property.create({
      title,
      description,
      price,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      images: imageUrls,
      area,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const propertyById = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property note found",
      });
    }
    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // 🔹 Update text fields
    const fields = [
      "title",
      "description",
      "price",
      "location",
      "propertyType",
      "bedrooms",
      "bathrooms",
      "area",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    // 🔹 If new images uploaded → replace old images
    if (req.files && req.files.length > 0) {
      let imageUrls = [];

      for (const file of req.files) {
        const result = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/properties",
        });
        imageUrls.push(result.url);
      }

      property.images = imageUrls; // replace images
    }

    await property.save();

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findById(id) 
    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property ont found",
      });
    }
    await Property.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Property deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allProperty = async (req , res) => {
    try {
        const property = await Property.find().sort({ createdAt: -1})
        res.status(200).json({
      success: true,
      count: property.length,
      property,
    });
    } catch (error) {
        res.status(500).json({
      success: false,
      message: error.message,
    }); 
    }
}

export const searchProperties = async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      sort,
      page = 1,
      limit = 6,
    } = req.query;

    let query = {};

    // 🔍 Search (title, description, location)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // 📍 Location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 🏠 Property type
    if (type) {
      query.propertyType = type;
    }

    // 🛏 Bedrooms
    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    // 💰 Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🔃 Sorting
    let sortOption = { createdAt: -1 }; // default latest

    if (sort === "price") {
      sortOption = { price: 1 };
    }
    if (sort === "-price") {
      sortOption = { price: -1 };
    }

    // 📄 Pagination
    const skip = (page - 1) * limit;

    const properties = await Property.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};