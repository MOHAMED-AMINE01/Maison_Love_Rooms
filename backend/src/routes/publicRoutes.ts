import express from 'express';
import {
  getSuites,
  getSuiteById,
  getServices,
  createReservation,
  getSettings,
  getPublicProducts,
  createOrder
} from '../controllers/adminController';

const router = express.Router();

// Routes publiques pour les suites
router.get('/suites', getSuites);
router.get('/suites/:id', getSuiteById);

// Routes publiques pour les services additionnels et paramètres
router.get('/services', getServices);
router.get('/settings', getSettings);

// Route publique pour créer une réservation
router.post('/reservations', createReservation);

// Routes publiques pour la boutique (produits actifs + création de commande)
router.get('/products', getPublicProducts);
router.post('/orders', createOrder);

export default router;
