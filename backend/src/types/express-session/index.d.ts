import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number; // Adicione aqui suas propriedades personalizadas
  }
}