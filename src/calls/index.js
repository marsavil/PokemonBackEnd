const axios = require('axios');
const { Pokemon, Type } = require('../db');
const { Sequelize } = require('sequelize');
const {POKEMON_URL, LIMIT, TYPES_URL} = process.env;

async function getPokemonsFromApi(){ // trae los pokemons de la api 
  let pokemonsFromApi = [];
  const apiData = await axios.get(POKEMON_URL+'?limit='+LIMIT, {headers:{"Accept-Encoding": "gzip,deflate,compress"}}) // request
  let promisesToResolve = [];
  apiData.data.results.map((p) => promisesToResolve.push(axios.get(p.url, {headers:{"Accept-Encoding": "gzip,deflate,compress"}}))); // almacena sub requests creados a partir del atributo url de cada pokemon  
  const pokemons = await Promise.all(promisesToResolve)
  pokemonsFromApi = pokemons.map((p) => {
              return {
                id: p.data.id,
                name: p.data.name,
                image: p.data.sprites.other.dream_world.front_default,  
                hp: p.data.stats[0].base_stat,
                attack: p.data.stats[1].base_stat,
                defense: p.data.stats[2].base_stat,
                speed: p.data.stats[5].base_stat,
                height: p.data.height,
                weight: p.data.weight,
                types: p.data.types.map((t) => {
                  return {
                    name: t.type.name
                  }
                }),
                createdInDb : false
              };
            });
    return pokemonsFromApi;
  };


async function getPokemonsFromDb() {
  try{
    const pokemonsStored = await Pokemon.findAll({
      include:{
        attributes: ["name"],
        model: Type,
          through: {
            attributes: [],
          },
      }
    });
    return pokemonsStored;
  } catch(error){
      return error;
  }
}

async function getAllPokemons() { // concatena los pokemons obtenidos de la api con los almacenados en BD
  try {
    let apiInfo = await getPokemonsFromApi();
    let dbInfo = await getPokemonsFromDb(); 
    return apiInfo.concat(dbInfo);
  } catch (error) {
    return error;
  }
};

async function getPokemonByIdFromApi(id) {
  try{
    const pokemonFound = await axios.get(POKEMON_URL+'/'+id, {headers:{"Accept-Encoding": "gzip,deflate,compress"}} );
      if (pokemonFound) {
          let p = pokemonFound;

          return {
              id: p.data.id,
              name: p.data.name,
              image: p.data.sprites.other.dream_world.front_default,
              hp: p.data.stats[0].base_stat,
              attack: p.data.stats[1].base_stat,
              defense: p.data.stats[2].base_stat,
              speed: p.data.stats[3].base_stat,
              height: p.data.height,
              weight: p.data.weight,
              types: p.data.types.map((t) => { return {name: t.type.name}}),
              createdInDb : false
          };  // return

      }else {
          return null;
      }
  } catch(error){
      return null;
  }
  
}

async function getPokemonByNameFromApi(name) {
  try{
      const pokemonFound = await axios.get(POKEMON_URL+'/'+name, {headers:{"Accept-Encoding": "gzip,deflate,compress"}} );
      if (pokemonFound) {
        
          return {
              id: pokemonFound.data.id,
              name: pokemonFound.data.name,
              image: pokemonFound.data.sprites.other.dream_world.front_default,
              hp: pokemonFound.data.stats[0].base_stat,
              attack: pokemonFound.data.stats[1].base_stat,
              defense: pokemonFound.data.stats[2].base_stat,
              speed: pokemonFound.data.stats[3].base_stat,
              height: pokemonFound.data.height,
              weight: pokemonFound.data.weight,
              types: pokemonFound.data.types.map((t) => { return {name: t.type.name}}),
              createdInDb : false
          }; 

      }else {
          return null;
      }
  } catch(error){
      return ({error : "Pokemon not found"});
      
  }
}


async function getPokemonsByNameFromDb(name){ 
  try{
    const pokemonFound = await Pokemon.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('pokemon.name')), 
        Sequelize.fn('lower', name)
      ),
      include:{
        attributes: ["name"],
        model: Type,
        through: {
          attributes: [],
        }
      }
    });
    return pokemonFound;
  } catch(error){
      return error;
  }
}
async function getPokemonByIdFromDb(id) {
  try{
      const search = await Pokemon.findOne({
          where: {
              id: id
          },
          include:{
              attributes: ["name"],
              model: Type,
              through: {
                attributes: [],
              }
          }
      });

      return search;
  } catch(error){
      return null;
  }
}
async function getTypes(){
  try{
    const response = await axios.get(TYPES_URL,{headers:{"Accept-Encoding": "gzip,deflate,compress"}});
    const allTypes = response.data.results.map((t) => {
      return { name: t.name }
    });
    await Type.bulkCreate(allTypes); // almacena
    return allTypes
  }
  catch(error){
    return(error);    
  }
}
module.exports ={
  getAllPokemons,
  getPokemonsFromApi,
  getPokemonsFromDb,
  getPokemonByIdFromApi,
  getPokemonByNameFromApi,
  getPokemonsByNameFromDb,
  getPokemonByIdFromDb,
  getTypes,

};