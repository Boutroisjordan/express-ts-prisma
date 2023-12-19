// userRoutes.ts
import express, { Request, Response, NextFunction } from 'express';
import upload from '../multerConfig';

const userRouter = express.Router();

userRouter.get('/', (req: Request, res: Response) => {
  // Rendre la vue du formulaire
  res.render('index');
});

userRouter.post('/', upload.array('avatars', 2), (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, files } = req;

    console.log('Form Data:', body);
    console.log('Avatars:', files);



    res.status(200).json({ message: 'Données reçues avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default userRouter;
