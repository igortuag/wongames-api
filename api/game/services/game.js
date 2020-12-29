'use strict';

const axios = require('axios');

module.exports = {
  populate: async (params) => {
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`

    const { data : { products } } = await axios.get(gogApiUrl)

    console.log(products[0])
  }
};
