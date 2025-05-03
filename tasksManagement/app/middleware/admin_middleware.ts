import {HttpContext} from "@adonisjs/core/http";
import {NextFn} from "@adonisjs/core/types/http";

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    console.log("AdminMiddleware exécuté");

    // Vérification des routes publiques
    const publicRoutes = ['/login', '/confirm-login'];
    if (publicRoutes.includes(ctx.request.url())) {
      return await next();
    }

    // Vérification de l'authentification
    if (!ctx.auth.user) {
      return ctx.response.status(401).json({
        status: 'unauthorized',
        message: 'Vous devez être connecté pour accéder à cette ressource',
      });
    }

    // Vérification des rôles
    await ctx.auth.user.load('roles');
    const roles = ctx.auth.user.roles;

    // Vérification de l'existence du rôle "Administrateur"
    const isAdmin = roles.some((role: any) => role.name === 'admin');
    if (!isAdmin) {
      return ctx.response.status(403).json({
        status: 'forbidden',
        message: "Vous n'avez pas les droits d'administrateur pour accéder à cette ressource",
      });
    }

    await next();
  }
}
