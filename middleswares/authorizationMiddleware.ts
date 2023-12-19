// authorizationMiddleware.ts

import { Request, Response, NextFunction } from 'express';

export const authorizeDeleteAndPut = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ajoutez ici la logique d'autorisation appropriée
  // Vérifiez si l'utilisateur a les autorisations nécessaires pour effectuer une suppression (DELETE) ou une mise à jour (PUT)

  const userHasPermission = /* Votre logique d'autorisation ici */ false;
  // const userHasPermission = /* Votre logique d'autorisation ici */ true;

  if (userHasPermission) {
    next(); // Passez à la route suivante si l'utilisateur est autorisé
  } else {
    res.status(403).json({ message: 'Accès non autorisé' });
  }
};