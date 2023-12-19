// routes/pokemon.ts

import express, { Request, Response } from 'express';

const pokemonRoutes = express.Router();

// Exemple de données Pokemon
const pokemonData: Record<string, { name: string, type: string }> = {
  "bulbasaur": { name: "Bulbasaur", type: "Grass/Poison" },
  "charmander": { name: "Charmander", type: "Fire" },
  "squirtle": { name: "Squirtle", type: "Water" },
  "pikachu": { name: "pikachu", type: "Water" },
  // Ajoutez d'autres Pokemon au besoin
};

pokemonRoutes.get('/temp', (req: Request, res: Response) => {
  res.render("../Views/Pokemon.ejs")
});

// Route pour /pokemon/:name
pokemonRoutes.get('/:name', (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { limit, offset } = req.query;

    const selectedPokemon = pokemonData[name.toLowerCase()];

    if (!selectedPokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    // Vous pouvez utiliser limit et offset ici comme vous le souhaitez
    const result = {
      ...selectedPokemon
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
pokemonRoutes.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.end();
});


export default pokemonRoutes;
