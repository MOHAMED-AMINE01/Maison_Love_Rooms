import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Reservation from '../models/Reservation';
import Suite from '../models/Suite';
import Service from '../models/Service';
import Formule from '../models/Formule';
import { fetchIcalBlocks, buildIcalFeed } from '../utils/ical';
import { stripe } from '../utils/stripe';
import { sendEmail } from '../utils/email';
import Settings from '../models/Settings';
import GiftCard from '../models/GiftCard';
import Product from '../models/Product';
import Order from '../models/Order';
import Faq from '../models/Faq';

// @desc    Authentification Admin & génération du token
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ email });

    if (!admin) {
      // Pour le développement/démo, créons un admin par défaut si aucun n'existe
      if (email === 'admin@novahunt.com' || email === 'admin@maisonloveroom.com') {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password || 'admin123', salt);
        const newAdmin = await Admin.create({
          email,
          passwordHash,
          name: 'Super Admin',
          role: 'admin'
        });
        const token = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
        res.cookie('adminToken', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
        });
        return res.json({
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          token: token,
        });
      }
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (isMatch) {
      const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
      });
      res.json({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Identifiants invalides' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir les statistiques du Dashboard (inspiré de l'image)
// @route   GET /api/admin/stats
// @access  Private
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const valideeReservations = await Reservation.countDocuments({ status: { $in: ['validee', 'confirmee'] } });
    const attenteReservations = await Reservation.countDocuments({ status: 'en_attente' });
    const annuleeReservations = await Reservation.countDocuments({ status: 'annulee' });
    const attenteOrders = await Order.countDocuments({ status: 'en_attente' });

    // Calcul du chiffre d'affaires (somme des prix des réservations validées, confirmées et terminées)
    const reservationsValidees = await Reservation.find({ status: { $in: ['validee', 'confirmee', 'terminee'] } });
    const totalRevenue = reservationsValidees.reduce((acc, curr) => acc + curr.totalPrice, 0);

    // Calcul dynamique du taux d'occupation des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeReservations = await Reservation.find({
      status: { $in: ['validee', 'confirmee', 'terminee'] },
      checkIn: { $gte: thirtyDaysAgo }
    });

    let totalNightsBooked = 0;
    activeReservations.forEach(r => {
      const checkInTime = new Date(r.checkIn).getTime();
      const checkOutTime = new Date(r.checkOut).getTime();
      const diffTime = checkOutTime - checkInTime;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) totalNightsBooked += diffDays;
    });

    const suitesCount = await Suite.countDocuments();
    const totalCapacityNights = (suitesCount || 1) * 30;
    const tauxOccupation = Math.min(100, Math.round((totalNightsBooked / totalCapacityNights) * 100)) || 0;

    // Calcul dynamique des nouveaux clients uniques
    const uniqueClients = await Reservation.distinct('clientEmail');
    const nouveauxClients = uniqueClients.length;

    // Calcul de la croissance du chiffre d'affaires comparé aux 30 jours précédents
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousPeriodReservations = await Reservation.find({
      status: { $in: ['validee', 'confirmee', 'terminee'] },
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });
    const previousPeriodRevenue = previousPeriodReservations.reduce((acc, curr) => acc + curr.totalPrice, 0);

    let revenueGrowth = 0;
    if (previousPeriodRevenue > 0) {
      revenueGrowth = Math.round(((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100);
    } else if (totalRevenue > 0) {
      revenueGrowth = 100;
    }

    res.json({
      totalReservations,
      valideeReservations,
      attenteReservations,
      annuleeReservations,
      attenteOrders,
      totalRevenue,
      tauxOccupation,
      nouveauxClients,
      revenueGrowth
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir toutes les réservations
// @route   GET /api/admin/reservations
// @access  Private
export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer une réservation (Action rapide)
// @route   POST /api/admin/reservations
// @access  Private
export const createReservation = async (req: Request, res: Response) => {
  try {
    const { clientName, clientEmail, clientPhone, clientAddress, suiteName, formuleName, formulePrice, checkIn, checkOut, arrivalTime, numberOfPersons, services, prestations, occasion, specialRequest, internalNote, totalPrice, status, consentGiven } = req.body;
    const reservation = await Reservation.create({
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      suiteName,
      formuleName,
      formulePrice,
      checkIn,
      checkOut,
      arrivalTime,
      numberOfPersons: numberOfPersons || 2,
      services: services || [],
      prestations: prestations || [],
      occasion,
      specialRequest,
      internalNote,
      totalPrice,
      consentGiven: consentGiven || false,
      status: status || 'confirmee'
    });
    res.status(201).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour une réservation (Statut, note interne, etc.)
// @route   PUT /api/admin/reservations/:id
// @access  Private
export const updateReservation = async (req: Request, res: Response) => {
  try {
    const { clientName, clientEmail, clientPhone, clientAddress, suiteName, formuleName, formulePrice, checkIn, checkOut, arrivalTime, numberOfPersons, services, prestations, occasion, specialRequest, internalNote, totalPrice, status, consentGiven } = req.body;

    // Chercher la réservation actuelle AVANT la mise à jour pour détecter un passage à "annulee"
    const existing = await Reservation.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // ─── Remboursement Stripe automatique ───────────────────────────────────
    // Si la réservation passe en "annulee" ET qu'elle a été payée via Stripe,
    // émettre un remboursement complet automatiquement.
    let refundResult: { id: string; status: string } | null = null;
    if (
      status === 'annulee' &&
      existing.status !== 'annulee' &&
      existing.paymentStatus === 'paye' &&
      existing.paymentProvider === 'stripe' &&
      existing.paymentRef
    ) {
      try {
        // paymentRef contient le Checkout Session ID (cs_...) → récupérer le PaymentIntent
        const session = await stripe.checkout.sessions.retrieve(existing.paymentRef);
        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;

        if (paymentIntentId) {
          const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            // Pas de montant spécifié = remboursement total
          });
          refundResult = { id: refund.id, status: refund.status ?? 'unknown' };
          // Marquer comme remboursé en BDD
          existing.paymentStatus = 'rembourse';
        }
      } catch (stripeErr: any) {
        // Ne pas bloquer l'annulation si Stripe échoue, mais le signaler
        console.error('[Stripe] Échec du remboursement automatique:', stripeErr.message);
        // On continue quand même l'annulation de la réservation en BDD
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Appliquer les modifications
    const fields: any = { clientName, clientEmail, clientPhone, clientAddress, suiteName, formuleName, formulePrice, checkIn, checkOut, arrivalTime, numberOfPersons, services, prestations, occasion, specialRequest, internalNote, totalPrice, consentGiven };
    if (status) fields.status = status;
    if (existing.paymentStatus === 'rembourse') fields.paymentStatus = 'rembourse';

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      fields,
      { new: true }
    );

    res.json({ reservation, refund: refundResult });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer une réservation
// @route   DELETE /api/admin/reservations/:id
// @access  Private
export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json({ message: 'Réservation supprimée avec succès' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir toutes les suites
// @route   GET /api/admin/suites
// @access  Private / Public
export const getSuites = async (req: Request, res: Response) => {
  try {
    const suites = await Suite.find();
    res.json(suites);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir une suite par ID ou nom
// @route   GET /api/suites/:id
// @access  Public
export const getSuiteById = async (req: Request, res: Response) => {
  try {
    let suite;
    const id = String(req.params.id);
    if (mongoose.Types.ObjectId.isValid(id)) {
      suite = await Suite.findById(id);
    }
    if (!suite) {
      const nameQuery = id.replace(/-/g, ' ');
      suite = await Suite.findOne({ name: { $regex: new RegExp(`^(${id}|${nameQuery})$`, 'i') } });
    }
    if (!suite) {
      return res.status(404).json({ message: 'Suite non trouvée' });
    }
    res.json(suite);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer une suite (Chambre)
// @route   POST /api/admin/suites
// @access  Private
export const createSuite = async (req: Request, res: Response) => {
  try {
    const { name, tagline, description, longDescription, presentationTitle, atouts, callToAction, pricePerNight, features, status, imageUrl, images, icalUrls } = req.body;
    const suite = await Suite.create({
      name,
      tagline,
      description,
      longDescription,
      presentationTitle,
      atouts,
      callToAction,
      pricePerNight,
      features,
      status,
      imageUrl,
      images: images || [],
      icalUrls: icalUrls || { airbnb: '', booking: '' }
    });
    res.status(201).json(suite);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour une suite (Chambre)
// @route   PUT /api/admin/suites/:id
// @access  Private
export const updateSuite = async (req: Request, res: Response) => {
  try {
    const { name, tagline, description, longDescription, presentationTitle, atouts, callToAction, pricePerNight, features, status, imageUrl, images, icalUrls } = req.body;
    const updateFields: any = { name, tagline, description, longDescription, presentationTitle, atouts, callToAction, pricePerNight, features, status, imageUrl, images: images || [] };
    if (icalUrls !== undefined) updateFields.icalUrls = icalUrls;
    const suite = await Suite.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!suite) {
      return res.status(404).json({ message: 'Suite non trouvée' });
    }
    res.json(suite);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer une suite (Chambre)
// @route   DELETE /api/admin/suites/:id
// @access  Private
export const deleteSuite = async (req: Request, res: Response) => {
  try {
    const suite = await Suite.findByIdAndDelete(req.params.id);
    if (!suite) {
      return res.status(404).json({ message: 'Suite non trouvée' });
    }
    res.json({ message: 'Suite supprimée avec succès' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir tous les services additionnels
// @route   GET /api/admin/services
// @access  Private / Public
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer un service additionnel
// @route   POST /api/admin/services
// @access  Private
export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, status, features, isPopular, billingType, category, allowQuantity, maxQuantity, pricingUnit, variants, order } = req.body;
    const service = await Service.create({
      name,
      description,
      price,
      imageUrl,
      status: status || 'actif',
      features: features || [],
      isPopular: isPopular || false,
      billingType: billingType || 'par_nuit',
      category: category || '',
      allowQuantity: allowQuantity || false,
      maxQuantity: maxQuantity || 1,
      pricingUnit: pricingUnit || 'forfait',
      variants: variants || [],
      order: order || 0
    });
    res.status(201).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour un service additionnel
// @route   PUT /api/admin/services/:id
// @access  Private
export const updateService = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, status, features, isPopular, billingType, category, allowQuantity, maxQuantity, pricingUnit, variants, order } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name, description, price, imageUrl, status,
        features: features || [],
        isPopular: isPopular || false,
        billingType: billingType || 'par_nuit',
        category: category || '',
        allowQuantity: allowQuantity || false,
        maxQuantity: maxQuantity || 1,
        pricingUnit: pricingUnit || 'forfait',
        variants: variants || [],
        order: order || 0
      },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir les paramètres globaux (tableau comparatif, etc.)
// @route   GET /api/admin/settings
// @access  Private / Public
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne({ singletonId: 'main' });
    if (!settings) {
      return res.json({ singletonId: 'main', comparisonTable: [] });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour les paramètres globaux
// @route   PUT /api/admin/settings
// @access  Private
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { comparisonTable, establishmentName, email, phone, address, instagram, whatsapp, checkInTime, checkOutTime, maxNights, fontTheme } = req.body;
    let settings = await Settings.findOne({ singletonId: 'main' });
    if (!settings) {
      settings = await Settings.create({
        singletonId: 'main',
        comparisonTable: comparisonTable || [],
        establishmentName: establishmentName || 'Maison Love Rooms',
        email: email || 'conciergerie@maisonloveroom.fr',
        phone: phone || '+33 1 23 45 67 89',
        address: address || 'Rue des Saints-Pères, 75006 Paris',
        instagram: instagram || '@maisonloveroom',
        whatsapp: whatsapp || '+33 1 23 45 67 89',
        checkInTime: checkInTime || '18:00',
        checkOutTime: checkOutTime || '11:00',
        maxNights: maxNights !== undefined ? Number(maxNights) : 2,
        fontTheme: fontTheme || 'heritage'
      });
    } else {
      if (comparisonTable !== undefined) settings.comparisonTable = comparisonTable;
      if (establishmentName !== undefined) settings.establishmentName = establishmentName;
      if (email !== undefined) settings.email = email;
      if (phone !== undefined) settings.phone = phone;
      if (address !== undefined) settings.address = address;
      if (instagram !== undefined) settings.instagram = instagram;
      if (whatsapp !== undefined) settings.whatsapp = whatsapp;
      if (checkInTime !== undefined) settings.checkInTime = checkInTime;
      if (checkOutTime !== undefined) settings.checkOutTime = checkOutTime;
      if (maxNights !== undefined) settings.maxNights = Number(maxNights);
      if (fontTheme !== undefined) settings.fontTheme = fontTheme;
      await settings.save();
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un service additionnel
// @route   DELETE /api/admin/services/:id
// @access  Private
export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.json({ message: 'Service supprimé avec succès' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================================================
// FORMULES — offre principale du tunnel (rattachée à une suite)
// ==========================================================================

// @desc    Obtenir toutes les formules (admin : actives + inactives)
// @route   GET /api/admin/formules
// @access  Private
export const getFormules = async (req: Request, res: Response) => {
  try {
    const formules = await Formule.find().sort({ order: 1, createdAt: 1 });
    res.json(formules);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir les formules actives (site public)
// @route   GET /api/formules
// @access  Public
export const getPublicFormules = async (req: Request, res: Response) => {
  try {
    const filter: any = { status: 'actif' };
    if (req.query.suiteName) filter.suiteName = String(req.query.suiteName);
    const formules = await Formule.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(formules);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer une formule
// @route   POST /api/admin/formules
// @access  Private
export const createFormule = async (req: Request, res: Response) => {
  try {
    const { name, suiteName, description, price, billingType, features, imageUrl, images, isPopular, status, order } = req.body;
    const formule = await Formule.create({
      name,
      suiteName: suiteName || '',
      description: description || '',
      price,
      billingType: billingType || 'nuit',
      features: features || [],
      imageUrl: imageUrl || '',
      images: images || [],
      isPopular: isPopular || false,
      status: status || 'actif',
      order: order || 0,
    });
    res.status(201).json(formule);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour une formule
// @route   PUT /api/admin/formules/:id
// @access  Private
export const updateFormule = async (req: Request, res: Response) => {
  try {
    const { name, suiteName, description, price, billingType, features, imageUrl, images, isPopular, status, order } = req.body;
    const formule = await Formule.findByIdAndUpdate(
      req.params.id,
      {
        name, suiteName, description, price,
        billingType: billingType || 'nuit',
        features: features || [],
        imageUrl, images: images || [],
        isPopular: isPopular || false,
        status, order: order || 0,
      },
      { new: true }
    );
    if (!formule) {
      return res.status(404).json({ message: 'Formule non trouvée' });
    }
    res.json(formule);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer une formule
// @route   DELETE /api/admin/formules/:id
// @access  Private
export const deleteFormule = async (req: Request, res: Response) => {
  try {
    const formule = await Formule.findByIdAndDelete(req.params.id);
    if (!formule) {
      return res.status(404).json({ message: 'Formule non trouvée' });
    }
    res.json({ message: 'Formule supprimée avec succès' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vérifier la disponibilité d'une suite sur une période
// @route   GET /api/availability?suiteName=..&checkIn=..&checkOut=..
// @access  Public
// Croise les dates bloquées manuellement (Suite.blockedDates) et les réservations
// actives (confirmée / validée) pour éviter les doublons.
export const getAvailability = async (req: Request, res: Response) => {
  try {
    const suiteName = String(req.query.suiteName || '');
    const checkInStr = String(req.query.checkIn || '');
    const checkOutStr = String(req.query.checkOut || '');

    if (!suiteName || !checkInStr || !checkOutStr) {
      return res.status(400).json({ available: false, reason: 'Paramètres manquants (suiteName, checkIn, checkOut).' });
    }

    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ available: false, reason: 'Dates invalides.' });
    }
    if (checkOut.getTime() <= checkIn.getTime()) {
      return res.status(400).json({ available: false, reason: 'La date de départ doit être postérieure à la date d\'arrivée.' });
    }

    // Chevauchement de deux intervalles [aStart, aEnd) et [bStart, bEnd)
    const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
      aStart.getTime() < bEnd.getTime() && bStart.getTime() < aEnd.getTime();

    const suite = await Suite.findOne({ name: suiteName });
    if (!suite) {
      return res.status(404).json({ available: false, reason: 'Suite introuvable.' });
    }
    if (suite.status !== 'disponible') {
      return res.json({ available: false, reason: 'Cette suite est actuellement en maintenance.' });
    }

    // 1. Dates bloquées manuellement (ou importées iCal en Phase 3)
    for (const bd of suite.blockedDates) {
      if (overlaps(checkIn, checkOut, new Date(bd.startDate), new Date(bd.endDate))) {
        return res.json({ available: false, reason: bd.reason || 'Période indisponible.' });
      }
    }

    // 2. Réservations actives sur la même suite
    const reservations = await Reservation.find({
      suiteName,
      status: { $in: ['confirmee', 'validee'] },
    });
    for (const r of reservations) {
      if (overlaps(checkIn, checkOut, new Date(r.checkIn), new Date(r.checkOut))) {
        return res.json({ available: false, reason: 'Ces dates sont déjà réservées.' });
      }
    }

    return res.json({ available: true });
  } catch (error: any) {
    res.status(500).json({ available: false, reason: error.message });
  }
};

// ==========================================================================
// SYNCHRONISATION iCal (Airbnb / Booking) — anti-doublon
// ==========================================================================

// Fonction autonome pour synchroniser une seule suite
export async function syncSingleSuite(suite: any): Promise<Record<string, number | string>> {
  const sources: ('airbnb' | 'booking')[] = ['airbnb', 'booking'];
  const summary: Record<string, number | string> = {};
  // On garde les blocages manuels ; les blocages importés sont recalculés à chaque synchro.
  let kept = suite.blockedDates.filter((bd: any) => (bd.source || 'manuel') === 'manuel');

  for (const source of sources) {
    const url = suite.icalUrls?.[source];
    if (!url) {
      summary[source] = 'non configuré';
      continue;
    }
    try {
      const blocks = await fetchIcalBlocks(url, source);
      kept = kept.concat(blocks as any);
      summary[source] = blocks.length;
    } catch (e: any) {
      summary[source] = `erreur: ${e.message}`;
    }
  }

  suite.blockedDates = kept as any;
  await suite.save();
  return summary;
}

// @desc    Synchroniser les calendriers iCal d'une suite (import Airbnb/Booking)
// @route   POST /api/admin/suites/:id/sync-ical
// @access  Private
export const syncSuiteIcal = async (req: Request, res: Response) => {
  try {
    const suite = await Suite.findById(req.params.id);
    if (!suite) return res.status(404).json({ message: 'Suite non trouvée' });

    const summary = await syncSingleSuite(suite);
    res.json({ message: 'Synchronisation terminée', summary, suite });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction globale pour synchroniser toutes les suites (utilisée par le cron/intervalle)
export const syncAllSuitesIcal = async () => {
  console.log(`[iCal Sync] Démarrage de la synchronisation globale...`);
  try {
    const suites = await Suite.find();
    for (const suite of suites) {
      if (suite.icalUrls?.airbnb || suite.icalUrls?.booking) {
        console.log(`[iCal Sync] Synchro de la suite : ${suite.name}`);
        const summary = await syncSingleSuite(suite);
        console.log(`[iCal Sync] Résultat pour ${suite.name} :`, summary);
      }
    }
    console.log(`[iCal Sync] Fin de la synchronisation globale.`);
  } catch (error: any) {
    console.error(`[iCal Sync] Erreur lors de la synchronisation globale:`, error.message);
  }
};

// @desc    Mettre à jour uniquement les URLs iCal d'une suite (sans toucher au reste)
// @route   PATCH /api/admin/suites/:id/ical
// @access  Private
export const updateSuiteIcalUrls = async (req: Request, res: Response) => {
  try {
    const { icalUrls } = req.body;
    const suite = await Suite.findByIdAndUpdate(
      req.params.id,
      { icalUrls: { airbnb: icalUrls?.airbnb || '', booking: icalUrls?.booking || '' } },
      { new: true }
    );
    if (!suite) return res.status(404).json({ message: 'Suite non trouvée' });
    res.json(suite);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Exporter les réservations d'une suite au format iCal (.ics)
// @route   GET /api/ical/:id
// @access  Public (URL à coller dans Airbnb / Booking)
export const exportSuiteIcal = async (req: Request, res: Response) => {
  try {
    const suite = await Suite.findById(req.params.id);
    if (!suite) return res.status(404).send('Suite non trouvée');
    const reservations = await Reservation.find({
      suiteName: suite.name,
      status: { $in: ['confirmee', 'validee'] },
    }).select('_id checkIn checkOut');
    const feed = buildIcalFeed(suite.name, reservations as any);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="${suite.name.replace(/\s+/g, '-').toLowerCase()}.ics"`);
    res.send(feed);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// @desc    Bloquer une période pour une suite (Chambre)
// @route   POST /api/admin/suites/:id/block-dates
// @access  Private
export const addBlockedDate = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const suite = await Suite.findById(req.params.id);
    if (!suite) {
      return res.status(404).json({ message: 'Suite non trouvée' });
    }

    suite.blockedDates.push({ startDate, endDate, reason });
    await suite.save();
    res.status(201).json(suite);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Débloquer une période pour une suite (Chambre)
// @route   DELETE /api/admin/suites/:id/block-dates/:blockId
// @access  Private
export const removeBlockedDate = async (req: Request, res: Response) => {
  try {
    const { id, blockId } = req.params;
    const suite = await Suite.findById(id);
    if (!suite) {
      return res.status(404).json({ message: 'Suite non trouvée' });
    }

    suite.blockedDates = suite.blockedDates.filter(
      (block) => block._id?.toString() !== blockId
    );
    await suite.save();
    res.json(suite);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all gift cards (public + admin)
// @route   GET /api/admin/gift-cards
// @access  Public
export const getGiftCards = async (req: Request, res: Response) => {
  try {
    const cards = await GiftCard.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a gift card
// @route   POST /api/admin/gift-cards
// @access  Private
export const createGiftCard = async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, features, badge, cta, status } = req.body;
  try {
    if (!name || !description || price === undefined || !imageUrl) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }
    const card = new GiftCard({ name, description, price, imageUrl, features, badge, cta, status });
    await card.save();
    res.status(201).json(card);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a gift card
// @route   PUT /api/admin/gift-cards/:id
// @access  Private
export const updateGiftCard = async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, features, badge, cta, status } = req.body;
  try {
    const card = await GiftCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Carte cadeau non trouvée' });
    }
    if (name) card.name = name;
    if (description) card.description = description;
    if (price !== undefined) card.price = price;
    if (imageUrl) card.imageUrl = imageUrl;
    if (features) card.features = features;
    if (badge !== undefined) card.badge = badge;
    if (cta !== undefined) card.cta = cta;
    if (status) card.status = status;
    await card.save();
    res.json(card);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a gift card
// @route   DELETE /api/admin/gift-cards/:id
// @access  Private
export const deleteGiftCard = async (req: Request, res: Response) => {
  try {
    const card = await GiftCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Carte cadeau non trouvée' });
    }
    res.json({ message: 'Carte cadeau supprimée' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================================================================
   PRODUITS / GESTION DE STOCK
   ========================================================================== */

// @desc    Liste tous les produits (admin)
// @route   GET /api/admin/products
// @access  Public (lecture) — l'admin voit aussi les inactifs
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Liste les produits actifs et en stock (site public)
// @route   GET /api/products
// @access  Public
export const getPublicProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ status: 'actif' }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crée un produit
// @route   POST /api/admin/products
// @access  Private
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, images, stock, status } = req.body;
  try {
    if (!name || !description || price === undefined || !imageUrl) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }
    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      images: images || [],
      stock: stock !== undefined ? stock : 0,
      status,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Met à jour un produit
// @route   PUT /api/admin/products/:id
// @access  Private
export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, images, stock, status } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (imageUrl) product.imageUrl = imageUrl;
    if (images) product.images = images;
    if (stock !== undefined) product.stock = Math.max(0, stock);
    if (status) product.status = status;
    await product.save();
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ajuste le stock d'un produit (ex: vente physique -1, réassort +1)
// @route   PATCH /api/admin/products/:id/stock
// @access  Private
export const adjustProductStock = async (req: Request, res: Response) => {
  const { delta } = req.body; // entier relatif, ex: -1 ou +5
  try {
    if (typeof delta !== 'number' || !Number.isFinite(delta)) {
      return res.status(400).json({ message: 'Le champ "delta" doit être un nombre' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    const next = product.stock + delta;
    if (next < 0) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }
    product.stock = next;
    await product.save();
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprime un produit
// @route   DELETE /api/admin/products/:id
// @access  Private
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================================================================
   COMMANDES (vente en ligne)
   ========================================================================== */

// @desc    Crée une commande depuis le site et décrémente le stock automatiquement.
//          Phase 1 : sans paiement (encaissement hors ligne). L'architecture
//          (paymentStatus / paymentProvider) est prête pour brancher Stripe.
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req: Request, res: Response) => {
  const { items, customerName, customerEmail, customerPhone, note, customerAddress, customerPostalCode, customerCity, fulfillment } = req.body;
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Aucun produit dans la commande' });
    }
    if (!customerName || !customerEmail) {
      return res.status(400).json({ message: 'Coordonnées client manquantes' });
    }

    // Normalise les quantités demandées par produit.
    const requested = new Map<string, number>();
    for (const it of items) {
      const id = String(it.productId || it.product || '');
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      if (!id) {
        return res.status(400).json({ message: 'Identifiant produit manquant' });
      }
      requested.set(id, (requested.get(id) || 0) + qty);
    }

    // Décrémente chaque produit de façon atomique avec garde anti-survente.
    // On garde la trace de ce qui a été décrémenté pour pouvoir annuler en cas d'échec.
    const decremented: { id: string; qty: number }[] = [];
    const orderItems: any[] = [];
    let total = 0;

    for (const [id, qty] of requested.entries()) {
      const updated = await Product.findOneAndUpdate(
        { _id: id, status: 'actif', stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!updated) {
        // Rollback des décréments déjà appliqués
        for (const d of decremented) {
          await Product.findByIdAndUpdate(d.id, { $inc: { stock: d.qty } });
        }
        return res.status(409).json({
          message: 'Stock insuffisant ou produit indisponible',
          productId: id,
        });
      }

      decremented.push({ id, qty });
      orderItems.push({
        itemType: 'product',
        product: updated._id,
        name: updated.name,
        price: updated.price,
        quantity: qty,
      });
      total += updated.price * qty;
    }

    const order = await Order.create({
      items: orderItems,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerPostalCode,
      customerCity,
      fulfillment: fulfillment || 'retrait',
      note,
      total,
      status: 'en_attente',
      paymentStatus: 'non_paye',
      paymentProvider: 'aucun',
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer une demande de carte cadeau (même système de commandes, sans stock)
// @route   POST /api/gift-card-orders
// @access  Public
export const createGiftCardOrder = async (req: Request, res: Response) => {
  const { giftCardId, customerName, customerEmail, customerPhone, note, recipientName, customerAddress, customerPostalCode, customerCity, fulfillment } = req.body;
  try {
    if (!giftCardId) {
      return res.status(400).json({ message: 'Carte cadeau manquante' });
    }
    if (!customerName || !customerEmail) {
      return res.status(400).json({ message: 'Coordonnées client manquantes' });
    }
    const card = await GiftCard.findOne({ _id: giftCardId, status: 'actif' });
    if (!card) {
      return res.status(404).json({ message: 'Carte cadeau introuvable ou indisponible' });
    }

    const order = await Order.create({
      items: [{ itemType: 'giftcard', name: `Carte cadeau — ${card.name}`, price: card.price, quantity: 1 }],
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerPostalCode,
      customerCity,
      fulfillment: fulfillment || 'retrait',
      recipientName,
      note,
      total: card.price,
      status: 'en_attente',
      paymentStatus: 'non_paye',
      paymentProvider: 'aucun',
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================================================================
   PAIEMENT STRIPE (Boutique + Cartes cadeaux)
   ========================================================================== */

// @desc    Créer une session de paiement Stripe pour une commande existante
// @route   POST /api/payments/session
// @access  Public
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.paymentStatus === 'paye') return res.status(400).json({ message: 'Commande déjà payée' });

    const origin = (req.headers.origin as string) || (process.env.FRONTEND_URL?.split(',')[0]) || 'http://localhost:3000';
    const isGift = order.items.some((i: any) => i.itemType === 'giftcard');
    const returnPath = isGift ? '/cartes-cadeaux' : '/boutique';

    const line_items = order.items.map((i: any) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: order.customerEmail,
      metadata: { orderId: String(order._id) },
      success_url: `${origin}${returnPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${returnPath}?canceled=1`,
    });

    order.paymentProvider = 'stripe';
    order.paymentRef = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Marque une commande comme payée + confirmée (idempotent).
const markOrderPaid = async (orderId: string, sessionId: string) => {
  const order = await Order.findById(orderId);
  if (order && order.paymentStatus !== 'paye') {
    order.paymentStatus = 'paye';
    order.status = 'confirmee';
    order.paymentProvider = 'stripe';
    order.paymentRef = sessionId;
    await order.save();
  }
  return order;
};

// @desc    Vérifier une session au retour de Stripe (fonctionne sans webhook)
// @route   GET /api/payments/verify?session_id=...
// @access  Public
export const verifyCheckoutSession = async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.query.session_id || '');
    if (!sessionId) return res.status(400).json({ message: 'session_id manquant' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';
    let order = null;
    if (paid && session.metadata?.orderId) {
      order = await markOrderPaid(session.metadata.orderId, session.id);
    }
    res.json({ paid, order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer une session de paiement Stripe pour une réservation existante
// @route   POST /api/payments/reservation-session
// @access  Public
export const createReservationCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    if (reservation.paymentStatus === 'paye') return res.status(400).json({ message: 'Réservation déjà payée' });

    const origin = (req.headers.origin as string) || (process.env.FRONTEND_URL?.split(',')[0]) || 'http://localhost:5173';

    const checkInStr = new Date(reservation.checkIn).toLocaleDateString('fr-FR');
    const checkOutStr = new Date(reservation.checkOut).toLocaleDateString('fr-FR');

    const line_items = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Réservation ${reservation.suiteName} — ${reservation.formuleName || 'Formule'}`,
            description: `Du ${checkInStr} au ${checkOutStr}`,
          },
          unit_amount: Math.round(reservation.totalPrice * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: reservation.clientEmail,
      metadata: { reservationId: String(reservation._id) },
      success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}&type=reservation`,
      cancel_url: `${origin}/checkout?canceled=1&reservation_id=${reservation._id}`,
    });

    reservation.paymentProvider = 'stripe';
    reservation.paymentRef = session.id;
    await reservation.save();

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Marque une réservation comme payée + confirmée (idempotent).
const markReservationPaid = async (reservationId: string, sessionId: string) => {
  const reservation = await Reservation.findById(reservationId);
  if (reservation && reservation.paymentStatus !== 'paye') {
    reservation.paymentStatus = 'paye';
    reservation.status = 'confirmee';
    reservation.paymentProvider = 'stripe';
    reservation.paymentRef = sessionId;
    await reservation.save();
  }
  return reservation;
};

// @desc    Vérifier une session de réservation au retour de Stripe (sans webhook)
// @route   GET /api/payments/verify-reservation?session_id=...
// @access  Public
export const verifyReservationSession = async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.query.session_id || '');
    if (!sessionId) return res.status(400).json({ message: 'session_id manquant' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';
    let reservation = null;
    if (paid && session.metadata?.reservationId) {
      reservation = await markReservationPaid(session.metadata.reservationId, session.id);
    }
    res.json({ paid, reservation });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Webhook Stripe (source de vérité en production)
// @route   POST /api/stripe/webhook
// @access  Public (signé)
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: any;
  try {
    if (whSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, whSecret);
    } else {
      // Pas de secret configuré (dev) : on parse sans vérifier la signature.
      event = JSON.parse(req.body.toString());
    }
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.metadata?.orderId) {
      await markOrderPaid(session.metadata.orderId, session.id);
    } else if (session.metadata?.reservationId) {
      await markReservationPaid(session.metadata.reservationId, session.id);
    }
  }
  res.json({ received: true });
};

// @desc    Liste les commandes (admin)
// @route   GET /api/admin/orders
// @access  Private
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Met à jour le statut / le paiement d'une commande.
//          Si la commande passe à « annulee », le stock des produits est réapprovisionné.
//          Si la commande était payée via Stripe, un remboursement automatique est émis.
// @route   PATCH /api/admin/orders/:id
// @access  Private
export const updateOrder = async (req: Request, res: Response) => {
  const { status, paymentStatus } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Réassort automatique si l'on annule une commande qui ne l'était pas déjà.
    if (status === 'annulee' && order.status !== 'annulee') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    // ─── Remboursement Stripe automatique ───────────────────────────────────
    // Si la commande passe en "annulee" ET qu'elle a été payée via Stripe,
    // émettre un remboursement complet automatiquement.
    let refundResult: { id: string; status: string } | null = null;
    if (
      status === 'annulee' &&
      order.status !== 'annulee' &&
      order.paymentStatus === 'paye' &&
      order.paymentProvider === 'stripe' &&
      order.paymentRef
    ) {
      try {
        // paymentRef contient le Checkout Session ID (cs_...) → récupérer le PaymentIntent
        const session = await stripe.checkout.sessions.retrieve(order.paymentRef);
        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;

        if (paymentIntentId) {
          const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            // Pas de montant spécifié = remboursement total
          });
          refundResult = { id: refund.id, status: refund.status ?? 'unknown' };
          // Marquer comme remboursé en BDD
          order.paymentStatus = 'rembourse';
        }
      } catch (stripeErr: any) {
        // Ne pas bloquer l'annulation si Stripe échoue, mais le signaler
        console.error('[Stripe] Échec du remboursement automatique (commande):', stripeErr.message);
        // On continue quand même l'annulation de la commande en BDD
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    if (status) order.status = status;
    // Ne pas écraser 'rembourse' si on vient de le définir via Stripe
    if (paymentStatus && order.paymentStatus !== 'rembourse') order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ order, refund: refundResult });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer une commande de l'historique
// @route   DELETE /api/admin/orders/:id
// @access  Private
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================================================================
   FAQ (Foire aux questions — éditable depuis le back-office)
   ========================================================================== */

// @desc    Liste les FAQ actives (site public), triées par ordre d'affichage
// @route   GET /api/faqs
// @access  Public
export const getPublicFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await Faq.find({ status: 'actif' }).sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Liste toutes les FAQ (admin — voit aussi les inactives)
// @route   GET /api/admin/faqs
// @access  Private
export const getFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crée une FAQ
// @route   POST /api/admin/faqs
// @access  Private
export const createFaq = async (req: Request, res: Response) => {
  const { question, answer, order, status } = req.body;
  try {
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question et réponse requises' });
    }
    const faq = await Faq.create({
      question,
      answer,
      order: order !== undefined ? order : 0,
      status: status || 'actif',
    });
    res.status(201).json(faq);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Met à jour une FAQ
// @route   PUT /api/admin/faqs/:id
// @access  Private
export const updateFaq = async (req: Request, res: Response) => {
  const { question, answer, order, status } = req.body;
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ non trouvée' });
    }
    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (order !== undefined) faq.order = order;
    if (status !== undefined) faq.status = status;
    await faq.save();
    res.json(faq);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprime une FAQ
// @route   DELETE /api/admin/faqs/:id
// @access  Private
export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ non trouvée' });
    }
    res.json({ message: 'FAQ supprimée' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout admin — efface le cookie httpOnly
// @route   POST /api/admin/logout
// @access  Public
export const logoutAdmin = (req: Request, res: Response) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Déconnexion réussie' });
};

/* ==========================================================================
   Contact Form (Public)
   ========================================================================== */

// @desc    Gère la soumission du formulaire de contact (envoi d'un email à l'administrateur)
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Veuillez remplir les champs obligatoires (nom, email, message).' });
  }

  try {
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid #c7a17a;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-family: 'Times New Roman', Times, serif; color: #c7a17a; font-size: 28px; font-weight: normal; margin: 0; letter-spacing: 2px; text-transform: uppercase;">Maison Love Rooms</h1>
          <p style="color: #c7a17a; font-size: 12px; letter-spacing: 4px; margin-top: 5px; text-transform: uppercase;">Nouveau Message</p>
        </div>
        
        <div style="background-color: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 30px;">
          <p style="margin: 0 0 15px 0; font-size: 14px;"><strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Nom du client :</strong><br/><span style="font-size: 16px; margin-top: 5px; display: inline-block;">${name}</span></p>
          <p style="margin: 0 0 15px 0; font-size: 14px;"><strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Email de contact :</strong><br/><a href="mailto:${email}" style="color: #ffffff; text-decoration: none; font-size: 16px; margin-top: 5px; display: inline-block;">${email}</a></p>
          <p style="margin: 0; font-size: 14px;"><strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Sujet de la demande :</strong><br/><span style="font-size: 16px; margin-top: 5px; display: inline-block;">${subject || 'Non spécifié'}</span></p>
        </div>
        
        <div style="border-top: 1px solid rgba(199, 161, 122, 0.3); padding-top: 30px;">
          <strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px; display: block; margin-bottom: 15px;">Message :</strong>
          <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #e0e0e0; margin: 0; padding: 20px; background-color: rgba(0,0,0,0.3); border-left: 3px solid #c7a17a; border-radius: 4px;">${message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="color: #888; font-size: 11px;">Cet email a été envoyé depuis le formulaire de contact de Maison Love Room.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: process.env.EMAIL_USER as string, // L'email de destination (le même que l'expéditeur)
      subject: `[Contact] ${subject || 'Nouvelle demande'} de ${name}`,
      html: htmlContent,
      replyTo: email, // Permet à l'admin de répondre directement au client
    });

    res.status(200).json({ message: 'Message envoyé avec succès.' });
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi du formulaire de contact :', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message.', error: error.message });
  }
};
