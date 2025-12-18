const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AuthVault API',
      version: '1.0.0',
      description: 'Secure authentication & session management service',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // 👈 VERY IMPORTANT
};

module.exports = swaggerJsdoc(options);
