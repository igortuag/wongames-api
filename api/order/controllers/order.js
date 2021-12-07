"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    const games = await strapi.config.functions.cart.cartItems(cart);

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: "No valid games found!",
      };
    }

    const total = games.reduce((acc, game) => {
      return acc + game.price;
    }, 0);

    if (total === 0) {
      return {
        freeGames: true,
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: "usd",
        metadata: { integration_check: "accept_a_payment" },
      });

      return paymentIntent;
    } catch (err) {
      return {
        error: err.raw.message,
      };
    }
  },

  create: async (ctx) => {
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;

    const token = await strapi.plugins[
      "users-permissions"
    ].services.jwt.getToken(ctx);

    const userId = token.id;

    const userInfo = await strapi.query("user", "users-permissions").findOne({
      id: userId,
    });

    const games = await strapi.config.functions.cart.cartItems(cart);

    return { cart, paymentIntentId, paymentMethod, userInfo };
  },
};
