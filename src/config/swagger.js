import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Inventory & Order Management API",
      version: "1.0.0",
      description: "Production-ready API for inventory, orders, stock, restock queue, and activity logs."
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:5000/api"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
