const axios = require('axios');
const { Router } = require('express');
const {Type} = require('../db');
const {TYPES_URL} = process.env;
const express = require('express');
const router = Router();
const {getTypes}= require('../calls/index')
router.use(express.json()) 




router.get('/', async (req, res, next) => {
  try{
    const allTypes = await Type.findAll();   
    if (!allTypes.length) { // Si no hay datos en BD procede a cargarlos y luego entregarlos
      const chargedTypes = await getTypes()
      return res.status(200).json(chargedTypes);
    }
    else { // si hay datos en la BD los entrega
      return res.status(200).json(allTypes); 
      
    }
  } 
  catch (error){
    next(error);
}
});




module.exports = router;
