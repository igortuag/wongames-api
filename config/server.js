module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1338),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "9c4ff0dc0987d3a3d839ec6e4e72b99e"),
    },
  },
});
