import express, { Application, Request, Response } from "express";

const dogs = express.Router()

dogs.get('/', (req: Request, res: Response) => {
  res.send('Dogs');
});
dogs.get('/:id', (req: Request, res: Response) => {
  res.send(`Dogs ${req.params.id}`);
});
// app.put('/', (req: Request, res: Response) => {
//   res.send('Welcome to Express & TypeScript Server');
// });
// app.post('/', (req: Request, res: Response) => {
//   res.send('Welcome to Express & TypeScript Server');
// });
// app.delete('/', (req: Request, res: Response) => {
//   res.send('Welcome to Express & TypeScript Server');
// });

export default dogs;