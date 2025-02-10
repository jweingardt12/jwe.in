module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('STRAPI_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  admin: {
    url: '/cms',
    autoOpen: false,
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
});
