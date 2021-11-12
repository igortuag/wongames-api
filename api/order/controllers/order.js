'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createPaymentIntent: (ctx) => {
    const { cart } = ctx.request.body;

    return cart;
  }
};
