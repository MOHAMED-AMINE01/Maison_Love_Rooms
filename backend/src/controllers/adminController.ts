import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Reservation from '../models/Reservation';
import Suite from '../models/Suite';
import Service from '../models/Service';
import Settings from '../models/Settings';
import GiftCard from '../models/GiftCard';

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
    const { clientName, clientEmail, clientPhone, suiteName, checkIn, checkOut, numberOfPersons, services, specialRequest, internalNote, totalPrice, status } = req.body;
    const reservation = await Reservation.create({
      clientName,
      clientEmail,
      clientPhone,
      suiteName,
      checkIn,
      checkOut,
      numberOfPersons: numberOfPersons || 2,
      services: services || [],
      specialRequest,
      internalNote,
      totalPrice,
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
    const { clientName, clientEmail, clientPhone, suiteName, checkIn, checkOut, numberOfPersons, services, specialRequest, internalNote, totalPrice, status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { clientName, clientEmail, clientPhone, suiteName, checkIn, checkOut, numberOfPersons, services, specialRequest, internalNote, totalPrice, status },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(reservation);
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
    const { name, description, pricePerNight, features, status, imageUrl, images } = req.body;
    const suite = await Suite.create({
      name,
      description,
      pricePerNight,
      features,
      status,
      imageUrl,
      images: images || []
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
    const { name, description, pricePerNight, features, status, imageUrl, images } = req.body;
    const suite = await Suite.findByIdAndUpdate(
      req.params.id,
      { name, description, pricePerNight, features, status, imageUrl, images: images || [] },
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
    const { name, description, price, imageUrl, status, features, isPopular } = req.body;
    const service = await Service.create({
      name,
      description,
      price,
      imageUrl,
      status: status || 'actif',
      features: features || [],
      isPopular: isPopular || false
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
    const { name, description, price, imageUrl, status, features, isPopular } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, price, imageUrl, status, features: features || [], isPopular: isPopular || false },
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
  const { name, description, price, imageUrl, features, badge, status } = req.body;
  try {
    if (!name || !description || price === undefined || !imageUrl) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }
    const card = new GiftCard({ name, description, price, imageUrl, features, badge, status });
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
  const { name, description, price, imageUrl, features, badge, status } = req.body;
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

