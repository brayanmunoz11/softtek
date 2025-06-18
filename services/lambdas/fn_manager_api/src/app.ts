import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
// Importing controllers
import { sessionController } from './application/controllers/sessionControllers';
import { fusionController } from './application/controllers/fusionContollers';


const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Accept', 'Content-Type', 'Content-Length',
    'Accept-Encoding', 'X-CSRF-Token', 'Authorization'
  ]
}));

app.use(express.json());




app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Routes
app.use('/session', sessionController);
app.use('/fusion', fusionController);
// Swagger documentation route




// Error 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "404 Not Found",
    success: false
  });
});

export default app;
