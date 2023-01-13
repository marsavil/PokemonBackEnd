const { Router } = require('express');
const pokemonsRoutes = require('./pokemons.js');
const typesRoute = require('./types.js');
const pokemonCreateRoute = require('./pokemonCreate')
// Importar todos los routers;'
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/pokemons', pokemonsRoutes);
router.use('/types', typesRoute); 
router.use('/pokemon', pokemonCreateRoute) 


module.exports = router;
