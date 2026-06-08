import express from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getDashboardStats,
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  getSuites,
  createSuite,
  updateSuite,
  deleteSuite,
  getServices,
  createService,
  updateService,
  deleteService,
  addBlockedDate,
  removeBlockedDate,
  getSettings,
  updateSettings,
  getGiftCards,
  createGiftCard,
  updateGiftCard,
  deleteGiftCard
} from '../controllers/adminController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Routes publiques
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

// Routes protégées par JWT
router.get('/stats', protect, getDashboardStats);
router.route('/reservations')
  .get(protect, getReservations)
  .post(protect, createReservation);

router.route('/reservations/:id')
  .put(protect, updateReservation)
  .delete(protect, deleteReservation);

router.route('/suites')
  .get(protect, getSuites)
  .post(protect, createSuite);

router.route('/settings')
  .get(protect, getSettings)
  .put(protect, updateSettings);

router.route('/suites/:id')
  .put(protect, updateSuite)
  .delete(protect, deleteSuite);

// Routes pour bloquer/débloquer des dates sur une suite
router.post('/suites/:id/block-dates', protect, addBlockedDate);
router.delete('/suites/:id/block-dates/:blockId', protect, removeBlockedDate);

// Routes pour les services additionnels (Boutique / Options)
router.route('/services')
  .get(getServices) // Public pour le checkout du site
  .post(protect, createService);

router.route('/services/:id')
  .put(protect, updateService)
  .delete(protect, deleteService);

// Routes pour les cartes cadeaux
router.route('/gift-cards')
  .get(getGiftCards) // Public pour la page client
  .post(protect, createGiftCard);

router.route('/gift-cards/:id')
  .put(protect, updateGiftCard)
  .delete(protect, deleteGiftCard);

export default router;

