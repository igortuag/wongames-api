"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sanitizeEntity } = require("strapi-utils");
const orderTemplate = require("../../../config/email-templates/order");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    const cartGamesId = await strapi.config.functions.cart.cartGamesIds(cart);

    const games = await strapi.config.functions.cart.cartItems(cartGamesId);

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: "No valid games found!",
      };
    }

    const amount = await strapi.config.functions.cart.total(games);

    if (amount === 0) {
      return {
        freeGames: true,
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: { cart: JSON.stringify(cartGamesId) },
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

    const cartGamesId = await strapi.config.functions.cart.cartGamesIds(cart);

    const games = await strapi.config.functions.cart.cartItems(cartGamesId);

    const total_in_cents = await strapi.config.functions.cart.total(games);

    let paymentInfo;
    if (total_in_cents !== 0) {
      try {
        paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
      } catch (error) {
        ctx.response.status = 402;
        return { error: err.message };
      }
    }

    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      card_brand: paymentInfo?.card?.brand,
      card_last4: paymentInfo?.card?.last4,
      user: userInfo,
      games,
    };

    const entity = await strapi.services.order.create(entry);

    await strapi.plugins.email.services.email.sendTemplateEmail(
      {
        to: userInfo.email,
        from: "no-reply@wongames.com",
      },
      orderTemplate,
      {
        user: userInfo,
        payment: {
          total: `$ ${total_in_cents / 100}`,
          card_brand: entry?.card?.brand,
          card_last4: entry?.card?.last4,
        },
        games,
      }
    );

    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
