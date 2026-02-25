import express from 'express';
import { setupRoutes } from '../src/routes.js';

const app = express();

app.use(express.json());

setupRoutes(app);

export default app;
