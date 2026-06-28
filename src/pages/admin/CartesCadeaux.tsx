import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Plus, Edit3, Trash2, Search, X, Upload } from 'lucide-react';
import { AdminToast, useAdminToast } from '../../components/admin/AdminModal';
import { API_URL } from '../../constants';
import { adminFetch } from '../../utils/apiClient';

interface GiftCardData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  features: string[];
  status: 'actif' | 'inactif';
  badge?: string;
  cta?: string;
}

export default function AdminCartesCadeaux() {
  const [cards, setCards] = useState<GiftCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<GiftCardData | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: 'create' | 'update' | 'delete' | null;
    targetId?: string;
  }>({ isOpen: false, title: '', message: '', action: null });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    features: [] as string[],
    badge: '',
    cta: '',
    status: 'actif' as 'actif' | 'inactif',
  });

  const itemsPerPage = 8;
  const { toast, showToast, hideToast } = useAdminToast();

  // Fetch cards from API
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/gift-cards');
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement', error);
      showToast('error', 'Erreur lors du chargement des cartes');
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCards = filteredCards.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      features: [],
      badge: '',
      cta: '',
      status: 'actif',
    });
    setEditingCard(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (card: GiftCardData) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      description: card.description,
      price: card.price.toString(),
      imageUrl: card.imageUrl,
      features: card.features,
      badge: card.badge || '',
      cta: card.cta || '',
      status: card.status,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'maison_love_rooms');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/djks8n2nh/image/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      setFormData({ ...formData, imageUrl: data.secure_url });
      showToast('success', 'Image téléchargée avec succès');
    } catch (error) {
      console.error('Erreur upload', error);
      showToast('error', 'Erreur lors du téléchargement');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.imageUrl) {
      showToast('error', 'Veuillez remplir tous les champs requis');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: editingCard ? 'Confirmer la mise à jour' : 'Créer une nouvelle carte',
      message: editingCard
        ? `Êtes-vous sûr de vouloir mettre à jour "${formData.name}" ?`
        : `Êtes-vous sûr de vouloir créer la carte "${formData.name}" ?`,
      action: editingCard ? 'update' : 'create',
    });
  };

  const confirmSubmit = async () => {
    
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl,
      features: formData.features.filter(f => f.trim()),
      badge: formData.badge || undefined,
      cta: formData.cta || undefined,
      status: formData.status,
    };

    try {
      const endpoint = editingCard
        ? `/api/admin/gift-cards/${editingCard._id}`
        : `/api/admin/gift-cards`;
      const method = editingCard ? 'PUT' : 'POST';

      const res = await adminFetch(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          'success',
          editingCard ? 'Carte mise à jour avec succès' : 'Carte créée avec succès'
        );
        setIsModalOpen(false);
        resetForm();
        fetchCards();
      } else {
        showToast('error', 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur', error);
      showToast('error', 'Erreur lors de la sauvegarde');
    }
    setConfirmModal({ isOpen: false, title: '', message: '', action: null });
  };

  const handleDelete = (id: string, cardName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer la carte',
      message: `Êtes-vous sûr de vouloir supprimer "${cardName}" ? Cette action est irréversible.`,
      action: 'delete',
      targetId: id,
    });
  };

  const confirmDelete = async () => {
    if (!confirmModal.targetId) return;
    
    try {
      const res = await adminFetch(`/api/admin/gift-cards/${confirmModal.targetId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('success', 'Carte supprimée avec succès');
        fetchCards();
      } else {
        showToast('error', 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur', error);
      showToast('error', 'Erreur lors de la suppression');
    }
    setConfirmModal({ isOpen: false, title: '', message: '', action: null });
  };

  return (
    <div className="space-y-12">
      <AdminToast {...toast} onClose={hideToast} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">

          <h2 className="text-4xl font-serif italic font-light text-white">Cartes Cadeaux</h2>
          <p className="text-white/60">Gérez vos offres, chèques cadeaux et bons d'achat.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Rechercher une carte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-gold/30 border border-gold/40 rounded-lg font-bold text-white hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Créer une carte
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center text-white">Chargement...</div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedCards.map((card) => (
              <motion.div
                key={card._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition-all"
              >
                <div className="relative mb-6">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  {card.badge && (
                    <div className="absolute top-3 right-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {card.badge}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>
                <p className="text-white/60 text-sm mb-4">{card.description}</p>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-gold">{card.price}€</span>
                  <span className="text-white/40 ml-2">
                    {card.status === 'actif' ? '• Actif' : '• Inactif'}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(card)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    <Edit3 size={16} />
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(card._id, card.name)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${currentPage === page
                    ? 'bg-gold text-noir font-bold'
                    : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingCard ? 'Éditer la carte' : 'Créer une nouvelle carte'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="Ex: Nuit de Rêve"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
                    rows={3}
                    placeholder="Description de la carte..."
                  />
                </div>

                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Prix (€)</label>
                    <div className="flex items-center gap-0 bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-gold transition-all">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, price: String(Math.max(0, parseFloat(formData.price || '0') - 1)) })}
                        className="px-4 py-3 text-gold font-bold text-xl hover:bg-white/10 transition-all border-r border-white/10 select-none"
                      >−</button>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60 font-bold text-sm">€</span>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full pl-8 pr-3 py-3 bg-transparent text-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="189"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, price: String(parseFloat(formData.price || '0') + 1) })}
                        className="px-4 py-3 text-gold font-bold text-xl hover:bg-white/10 transition-all border-l border-white/10 select-none"
                      >+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Badge (optionnel)</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold"
                      placeholder="Ex: Populaire"
                    />
                  </div>
                </div>

                {/* CTA (texte du bouton) */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Texte du bouton (CTA)</label>
                  <input
                    type="text"
                    value={formData.cta}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="Ex: Offrir le pack, Ajouter le bouquet…"
                  />
                  <p className="text-xs text-white/40 mt-1.5">Libellé affiché sur le bouton de la carte sur le site (différent d'une carte à l'autre).</p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Image</label>
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <label className="flex items-center justify-center w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                    <Upload size={18} className="text-gold mr-2" />
                    <span className="text-white">
                      {uploadingImage ? 'Téléchargement...' : 'Télécharger une image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Avantages</label>
                  <div className="space-y-2 mb-3">
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold"
                          placeholder="Ex: 1 nuitée pour 2 personnes"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
                  >
                    + Ajouter un avantage
                  </button>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Statut</label>
                  <div className="flex gap-0 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'actif' })}
                      className={`flex-1 py-3 text-sm font-bold transition-all duration-300 ${
                        formData.status === 'actif'
                          ? 'bg-emerald-500/20 text-emerald-400 border-r border-emerald-500/30'
                          : 'text-white/40 hover:text-white/70 border-r border-white/10'
                      }`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${formData.status === 'actif' ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      Actif
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'inactif' })}
                      className={`flex-1 py-3 text-sm font-bold transition-all duration-300 ${
                        formData.status === 'inactif'
                          ? 'bg-red-500/20 text-red-400'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${formData.status === 'inactif' ? 'bg-red-400' : 'bg-white/20'}`} />
                      Inactif
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gold to-gold rounded-lg text-noir font-bold hover:shadow-lg transition-all"
                  >
                    {editingCard ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{confirmModal.title}</h3>
              <p className="text-white/60 mb-8">{confirmModal.message}</p>

              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', action: null })}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (confirmModal.action === 'create' || confirmModal.action === 'update') {
                      confirmSubmit();
                    } else if (confirmModal.action === 'delete') {
                      confirmDelete();
                    }
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                    confirmModal.action === 'delete'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gold hover:bg-gold/90 text-noir'
                  }`}
                >
                  {confirmModal.action === 'delete' ? 'Supprimer' : 'Confirmer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
