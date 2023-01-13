require("dotenv").config();
const express = require("express");
const {
  getPokemonByNameFromApi,
  getPokemonsByNameFromDb,
  getTypes,
} = require("../calls/index");
const { Router } = require("express");
const router = Router();
router.use(express.json());
const { Sequelize } = require("sequelize");
const { Pokemon, Type } = require("../db.js");

router.post("/", async (req, res, next) => {
  const { name, image, hp, attack, defense, speed, height, weight, types } =
    req.body;

  if (!name || !image) {
    return res
      .status(404)
      .json({ error: "Name and image are required fields." });
  }

  //Verificar que el nombre este disponible.
  let search = await getPokemonByNameFromApi(name.toLowerCase());

  // busqueda en la base de datos
  if (search.error) {
    // no encontrado en la API externa
    search = await getPokemonsByNameFromDb(name.toLowerCase());
  }

  if (search) {
    return res.status(400).json({ error: "Pokemon name already exists." });
  }
  try {
    const createdPokemon = await Pokemon.create(req.body);
    let allTypes = await Type.findAll();
    if (!allTypes.length) {
      allTypes = await getTypes();
    }
    types.forEach((t) => {
      let filteredType = allTypes.filter(
        (type) => type.name.toLowerCase() == t.toLowerCase()
      );
      createdPokemon.addType(filteredType);
    });

    return res.status(201).send("Pokemon created successfully");
  } catch (error) {
    res.status(400).send('error');
  }
});

module.exports = router;
