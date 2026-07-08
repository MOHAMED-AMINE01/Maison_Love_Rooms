import express from 'express';
import {
  getSuites,
  getSuiteById,
  getServices,
  getPublicFormules,
  getAvailability,
  exportSuiteIcal,
  createReservation,
  getSettings,
  getPublicProducts,
  createOrder,
  createGiftCardOrder,
  createCheckoutSession,
  verifyCheckoutSession,
  createReservationCheckoutSession,
  verifyReservationSession,
  getPublicFaqs,
  submitContactForm
} from '../controllers/adminController';

const router = express.Router();

// Routes publiques pour les suites
router.get('/suites', getSuites);
router.get('/suites/:id', getSuiteById);

// Routes publiques pour les services additionnels et paramètres
router.get('/services', getServices);
router.get('/settings', getSettings);

// Routes publiques pour les formules (offre principale) et la disponibilité
router.get('/formules', getPublicFormules);
router.get('/availability', getAvailability);

// Export iCal des réservations d'une suite (à coller dans Airbnb / Booking)
router.get('/ical/:id', exportSuiteIcal);

// Route publique pour créer une réservation
router.post('/reservations', createReservation);

// Routes publiques pour la boutique (produits actifs + création de commande)
router.get('/products', getPublicProducts);
router.post('/orders', createOrder);
router.post('/gift-card-orders', createGiftCardOrder);

// Paiement Stripe
router.post('/payments/session', createCheckoutSession);
router.get('/payments/verify', verifyCheckoutSession);
router.post('/payments/reservation-session', createReservationCheckoutSession);
router.get('/payments/verify-reservation', verifyReservationSession);

// Route publique pour la FAQ (questions actives)
router.get('/faqs', getPublicFaqs);

// Route publique pour le formulaire de contact
router.post('/contact', submitContactForm);

export default router;
