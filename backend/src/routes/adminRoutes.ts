import express from 'express';
import { 
  loginAdmin, 
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
  updateSettings
} from '../controllers/adminController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Route publique
router.post('/login', loginAdmin);

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

export default router;

