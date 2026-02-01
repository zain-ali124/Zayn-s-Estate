import express from 'express';
import { createProperty, updateProperty, deleteProperty, propertyById, allProperty, searchProperties } from '../controllers/propertyController.js';
import upload from "../middlewares/uploadMiddleware.js";
import { adminOnly, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  "/create",
  protect,
  adminOnly,
  upload.array("images", 5),
  createProperty
);

router.get('/', protect, adminOnly, allProperty)
router.put('/:id', protect, adminOnly, upload.array("images", 5), updateProperty)
router.delete('/:id', protect, adminOnly, deleteProperty)
router.get('/search', searchProperties)
router.get('/:id', propertyById)

export default router;