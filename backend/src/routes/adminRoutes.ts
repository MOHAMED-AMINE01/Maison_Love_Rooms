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
  deleteGiftCard,
  getProducts,
  createProduct,
  updateProduct,
  adjustProductStock,
  deleteProduct,
  getOrders,
  updateOrder,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq
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

// Routes pour les produits / gestion de stock
router.route('/products')
  .get(getProducts) // Lecture publique (l'admin voit aussi les inactifs)
  .post(protect, createProduct);

router.route('/products/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

// Ajustement manuel du stock (vente physique -1, réassort +1, ...)
router.patch('/products/:id/stock', protect, adjustProductStock);

// Liste des commandes passées en ligne + mise à jour (statut / paiement)
router.get('/orders', protect, getOrders);
router.patch('/orders/:id', protect, updateOrder);

// Routes pour la FAQ (foire aux questions éditable depuis le BO)
router.route('/faqs')
  .get(protect, getFaqs)
  .post(protect, createFaq);

router.route('/faqs/:id')
  .put(protect, updateFaq)
  .delete(protect, deleteFaq);

export default router;

