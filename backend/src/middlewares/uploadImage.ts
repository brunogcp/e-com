import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import Product, { ProductAttributes } from '../models/Product';

interface RequestWithProduct extends Request {
  product?: ProductAttributes;
}

// Definir o destino e o nome do arquivo para os uploads
const storage = multer.diskStorage({
  destination: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'public');
  },
  filename: function(req: RequestWithProduct, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, `product-${req.product.id}` + '.jpg'); // Usar timestamp como nome de arquivo para evitar sobrescritas
  }
});

// Filtrar apenas imagens
const fileFilter = async (req: RequestWithProduct, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    const productId = req.params.id; // Assumindo que o ID do produto está nos parâmetros da URL
    const product = await Product.findByPk(productId);
    if (product) {
      req.product = product.get({ plain: true });
      cb(null, true);
    } else {
      cb(new Error('Produto não encontrado'));
    }
  } else {
    cb(new Error('Não é uma imagem!'));
  }
};

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limitar o tamanho do arquivo a 5MB
  },
  fileFilter: fileFilter
});

export default uploadImage;
