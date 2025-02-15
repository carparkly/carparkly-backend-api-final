require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dbConnect = require('./config/db');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Database Connection
dbConnect();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(helmet());
app.use(morgan(process.env.LOG_LEVEL || 'dev'));

// API Routes
app.use('/api', apiRoutes);

// Swagger Docs
const swaggerOptions = {
  definition: { openapi: '3.0.0', info: { title: 'carparkly-backend API', version: '1.0.0' }},
  apis: ['./src/routes/*.js'],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log();
});
