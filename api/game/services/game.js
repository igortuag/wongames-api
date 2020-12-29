'use strict';

const axios = require('axios');

async function getGameInfo(slug) {
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const body = await axios.get(`https://www.gog.com/game/${slug}`)
  const dom = new JSDOM(body.data);

  const ratingElement = dom.window.document.querySelector('.age-restrictions__icon use')

  console.log(ratingElement)
}

module.exports = {
  populate: async (params) => {
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`

    const { data : { products } } = await axios.get(gogApiUrl)

    await getGameInfo(products[0].slug);
  }
};
