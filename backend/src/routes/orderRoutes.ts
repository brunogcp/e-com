import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';
import { verifyToken } from '../middlewares/verifyToken';
import { verifyAdmin } from '../middlewares/verifyAdmin';

const router = express.Router();

router.post('/', [verifyToken], createOrder);
router.get('/', [verifyToken], getOrders);
router.get('/:id', [verifyToken], getOrderById);
router.put('/:id', [verifyToken, verifyAdmin], updateOrderStatus);

export default router;
