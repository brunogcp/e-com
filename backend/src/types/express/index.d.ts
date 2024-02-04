declare namespace Express {
  export interface Request {
    user?: { id: string, email: string, admin: boolean },
    file?: Multer.File;
    product?: ProductAttributes
  }
}
