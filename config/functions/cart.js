const cartItems = async (cart) => {
  let games = [];

  await Promise.all(
    cart?.map(async (game) => {
      const validatedGame = await strapi.services.game.findOne({
        id: game.id,
      });

      if (validatedGame) {
        games.push(validatedGame);
      }
    })
  );

  return games;
};
