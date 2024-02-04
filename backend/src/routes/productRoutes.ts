import express from 'express';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct, addProductImage } from '../controllers/productController';
import { verifyToken } from '../middlewares/verifyToken';
import { verifyAdmin } from '../middlewares/verifyAdmin';
import { invalidateRedisCache, redisCache } from '../middlewares/redisCache';
import uploadImage from 'src/middlewares/uploadImage';

const router = express.Router();

router.post('/', [verifyToken, verifyAdmin, invalidateRedisCache('productsList')], addProduct);
router.get('/', [redisCache('productsList', 1800)], getProducts);
router.get('/:id', getProductById);
router.put('/:id', [verifyToken, verifyAdmin, invalidateRedisCache('productsList')], updateProduct);
router.delete('/:id', [verifyToken, verifyAdmin, invalidateRedisCache('productsList')], deleteProduct);
router.post('/upload/:id', [verifyToken, verifyAdmin, uploadImage.single('image'), invalidateRedisCache('productsList')], addProductImage);

export default router;
