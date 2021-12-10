const subject = "Order at Won Games";

const text = `
  Hi <%= user.username %>, thanks for buying at Won Games!
    Follow the info of your order:
    Card Information:
    Card brand: <%= payment.card_brand %>
    Card number: **** **** **** <%= payment.card_last4 %>
    Total: <%= payment.total %>
    Games:
    <% _.forEach(games, function(game) { %>
      <%= game.name %> - Price: $<%= game.price %>
    <% }); %>
`;

const html = ``;

module.exports = {
  subject,
  text,
  html,
};
