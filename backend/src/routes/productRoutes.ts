import express from 'express';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController';
import { verifyToken } from '../middlewares/verifyToken';
import { verifyAdmin } from '../middlewares/verifyAdmin';
import { redisCache } from '../middlewares/redisCache';

const router = express.Router();

router.post('/', [verifyToken, verifyAdmin], addProduct);
router.get('/', [redisCache('productsList', 1800)], getProducts);
router.get('/:id', getProductById);
router.put('/:id', [verifyToken, verifyAdmin], updateProduct);
router.delete('/:id', [verifyToken, verifyAdmin], deleteProduct);

export default router;
