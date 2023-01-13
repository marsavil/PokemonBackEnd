require('dotenv').config();
const express = require('express');
const {getAllPokemons,
    getPokemonByIdFromApi,
    getPokemonByNameFromApi,
    getPokemonsByNameFromDb,
    getPokemonByIdFromDb,
    getTypes} = require("../calls/index");
const { Router } = require('express');
const router = Router();
router.use(express.json()) 
const { Sequelize } = require('sequelize');
const {Pokemon, Type} = require('../db.js');

router.get('/', async (req, res, next) => {

  try {       
    const {name} = req.query;
      if (name){
        let search = await getPokemonByNameFromApi(name.toLowerCase());
            if (search.error){ // no encontrado en la API externa
                search = await getPokemonsByNameFromDb(name.toLowerCase()); 

                if (!search){ // no encontrado en DB
                    return res.status(404).json({"message": "Pokemon not found"});
                }
            }
            return res.status(200).json(search);
        }
        const allPokemons = await getAllPokemons(); // si no llega nombre por query, busca todos los pokemons (ap y db)
        return res.status(200).json(allPokemons);
    } catch (error) {
        next(error);
    }
});

router.get('/:idPokemon', async (req, res, next) => {
    
    try {       
      const {idPokemon} = req.params;
      if (idPokemon){
        let search = null;
        if (isNaN(idPokemon)){ // si no es número busca en DB
          search = await getPokemonByIdFromDb(idPokemon);
        } else { // el id es número y busca en api
          search = await getPokemonByIdFromApi(idPokemon);
        }
        if (search){ 
          return res.status(200).json(search);
        }
      }
      return res.status(404).json({"message": "Pokemon Id not found"});
    } catch (error) {
      next(error);
    }
});






module.exports = router;