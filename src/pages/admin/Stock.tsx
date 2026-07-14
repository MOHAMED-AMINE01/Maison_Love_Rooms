import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Plus, Edit3, Trash2, Search, X, Upload, Minus } from 'lucide-react';
import { AdminToast, useAdminToast } from '../../components/admin/AdminModal';
import { adminFetch } from '../../utils/apiClient';

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  status: 'actif' | 'inactif';
}

export default function AdminStock() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
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
    stock: '',
    status: 'actif' as 'actif' | 'inactif',
  });

  const itemsPerPage = 8;
  const { toast, showToast, hideToast } = useAdminToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement', error);
      showToast('error', 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', imageUrl: '', stock: '', status: 'actif' });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductData) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      stock: product.stock.toString(),
      status: product.status,
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
      setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
      showToast('success', 'Image téléchargée avec succès');
    } catch (error) {
      console.error('Erreur upload', error);
      showToast('error', 'Erreur lors du téléchargement');
    } finally {
      setUploadingImage(false);
    }
  };

  // Ajustement rapide du stock (vente physique -1, réassort +1)
  const adjustStock = async (product: ProductData, delta: number) => {
    if (delta < 0 && product.stock <= 0) return;
    setAdjustingId(product._id);
    try {
      const res = await adminFetch(`/api/admin/products/${product._id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ delta }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => (p._id === updated._id ? updated : p)));
        showToast('success', delta < 0 ? 'Stock décrémenté (vente)' : 'Stock réapprovisionné');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast('error', err.message || 'Ajustement impossible');
      }
    } catch (error) {
      console.error('Erreur ajustement stock', error);
      showToast('error', "Erreur lors de l'ajustement du stock");
    } finally {
      setAdjustingId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.imageUrl) {
      showToast('error', 'Veuillez remplir tous les champs requis');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: editingProduct ? 'Confirmer la mise à jour' : 'Créer un nouveau produit',
      message: editingProduct
        ? `Êtes-vous sûr de vouloir mettre à jour "${formData.name}" ?`
        : `Êtes-vous sûr de vouloir créer le produit "${formData.name}" ?`,
      action: editingProduct ? 'update' : 'create',
    });
  };

  const confirmSubmit = async () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl,
      stock: Math.max(0, parseInt(formData.stock || '0', 10)),
      status: formData.status,
    };

    try {
      const endpoint = editingProduct
        ? `/api/admin/products/${editingProduct._id}`
        : `/api/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await adminFetch(endpoint, { method, body: JSON.stringify(payload) });

      if (res.ok) {
        showToast('success', editingProduct ? 'Produit mis à jour' : 'Produit créé');
        setIsModalOpen(false);
        resetForm();
        fetchProducts();
      } else {
        showToast('error', 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur', error);
      showToast('error', 'Erreur lors de la sauvegarde');
    }
    setConfirmModal({ isOpen: false, title: '', message: '', action: null });
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer le produit',
      message: `Êtes-vous sûr de vouloir supprimer "${name}" ? Cette action est irréversible.`,
      action: 'delete',
      targetId: id,
    });
  };

  const confirmDelete = async () => {
    if (!confirmModal.targetId) return;
    try {
      const res = await adminFetch(`/api/admin/products/${confirmModal.targetId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Produit supprimé');
        fetchProducts();
      } else {
        showToast('error', 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur', error);
      showToast('error', 'Erreur lors de la suppression');
    }
    setConfirmModal({ isOpen: false, title: '', message: '', action: null });
  };

  const stockBadge = (stock: number) => {
    if (stock <= 0) return { text: 'Rupture', cls: 'bg-red-500/20 text-red-300 border-red-500/30' };
    if (stock <= 3) return { text: `${stock} restant${stock > 1 ? 's' : ''}`, cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    return { text: `${stock} en stock`, cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
  };

  return (
    <div className="space-y-12">
      <AdminToast {...toast} onClose={hideToast} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif italic font-light text-white">Stock & Produits</h2>
          <p className="text-white/60">Gérez vos produits, leurs photos, leurs prix et leurs quantités.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
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
            Ajouter un produit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white">Chargement...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <Package size={40} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/50">Aucun produit pour l'instant. Cliquez sur « Ajouter un produit » pour commencer.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.map((product) => {
              const badge = stockBadge(product.stock);
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`bg-white/5 border rounded-2xl p-6 transition-all ${product.status === 'inactif' ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-gold/50'}`}
                >
                  <div className="relative mb-6">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-xl" />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border ${badge.cls}`}>
                      {badge.text}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gold">{product.price} €</span>
                    <span className="text-white/40 text-sm">
                      {product.status === 'actif' ? '• Actif' : '• Inactif'}
                    </span>
                  </div>

                  {/* Ajustement rapide du stock (vente physique / réassort) */}
                  <div className="flex items-center gap-3 mb-4 bg-white/[0.03] border border-white/10 rounded-xl p-2">
                    <button
                      onClick={() => adjustStock(product, -1)}
                      disabled={adjustingId === product._id || product.stock <= 0}
                      title="Vendu (−1)"
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus size={18} />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-white font-bold text-lg">{product.stock}</span>
                      <span className="block text-[10px] uppercase tracking-widest text-white/40">en stock</span>
                    </div>
                    <button
                      onClick={() => adjustStock(product, 1)}
                      disabled={adjustingId === product._id}
                      title="Réapprovisionner (+1)"
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all disabled:opacity-30"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                    >
                      <Edit3 size={16} />
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-gold text-noir font-bold' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Créer / Éditer */}
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
                  {editingProduct ? 'Éditer le produit' : 'Nouveau produit'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold"
                    placeholder="Ex: Coffret bien-être"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
                    rows={3}
                    placeholder="Description du produit..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Prix (€)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="49"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Stock (quantité)</label>
                    <div className="flex items-center gap-0 bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-gold transition-all">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: String(Math.max(0, parseInt(formData.stock || '0', 10) - 1)) })}
                        className="px-4 py-3 text-gold font-bold text-xl hover:bg-white/10 transition-all border-r border-white/10 select-none"
                      >−</button>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-3 py-3 bg-transparent text-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: String(parseInt(formData.stock || '0', 10) + 1) })}
                        className="px-4 py-3 text-gold font-bold text-xl hover:bg-white/10 transition-all border-l border-white/10 select-none"
                      >+</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Photo du produit</label>
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Aperçu" className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <label className="flex items-center justify-center w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                    <Upload size={18} className="text-gold mr-2" />
                    <span className="text-white">
                      {uploadingImage ? 'Téléchargement...' : 'Télécharger une image'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Statut</label>
                  <div className="flex gap-0 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'actif' })}
                      className={`flex-1 py-3 text-sm font-bold transition-all duration-300 ${formData.status === 'actif' ? 'bg-emerald-500/20 text-emerald-400 border-r border-emerald-500/30' : 'text-white/40 hover:text-white/70 border-r border-white/10'}`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${formData.status === 'actif' ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      Actif
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'inactif' })}
                      className={`flex-1 py-3 text-sm font-bold transition-all duration-300 ${formData.status === 'inactif' ? 'bg-red-500/20 text-red-400' : 'text-white/40 hover:text-white/70'}`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${formData.status === 'inactif' ? 'bg-red-400' : 'bg-white/20'}`} />
                      Inactif
                    </button>
                  </div>
                </div>

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
                    {editingProduct ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de confirmation */}
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
                    if (confirmModal.action === 'create' || confirmModal.action === 'update') confirmSubmit();
                    else if (confirmModal.action === 'delete') confirmDelete();
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${confirmModal.action === 'delete' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gold hover:bg-gold/90 text-noir'}`}
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
