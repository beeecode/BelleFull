import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, XCircle, CheckCircle2, Save } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { ProductFormModal } from '../../../components/modals/ProductFormModal';

const pageVariants = {
  visible: { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.04 } },
};

const itemVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
};

function AdminSearch({ value, onChange, placeholder = 'Search' }) {
  return (
    <motion.label className="admin-search" variants={itemVariants}>
      <Search size={25} strokeWidth={1.6} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </motion.label>
  );
}

export default function ProductsTab({
  products,
  setProducts,
  categories,
  setCategories,
  requestConfirm,
  showNotice,
}) {
  const [activeTab, setActiveTab] = useState('food');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState('');
  const [editingCategory, setEditingCategory] = useState('');

  const visibleProducts = products.filter((item) => {
    const matchesSearch = [item.name, item.category, item.description]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || String(item.available) === availabilityFilter;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const saveProduct = (product) => {
    setProducts((current) =>
      current.some((item) => item.id === product.id)
        ? current.map((item) => (item.id === product.id ? product : item))
        : [product, ...current]
    );
    setEditingProduct(null);
    setShowProductModal(false);
  };

  const deleteProduct = (id) => {
    requestConfirm({
      title: 'Delete Food Item?',
      message: 'Are you sure you want to delete this food item? This action cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: () => setProducts((current) => current.filter((item) => item.id !== id)),
    });
  };

  const saveCategory = () => {
    const value = categoryDraft.trim();
    if (!value) return;
    setCategories((current) =>
      editingCategory
        ? current.map((category) => (category === editingCategory ? value : category))
        : [...current, value]
    );
    setCategoryDraft('');
    setEditingCategory('');
  };

  const deleteCategory = (category) => {
    if (category === 'All') {
      showNotice('Required Category', 'The All category is required and cannot be deleted.');
      return;
    }
    requestConfirm({
      title: 'Delete Category?',
      message: `Are you sure you want to delete ${category}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      onConfirm: () => setCategories((current) => current.filter((item) => item !== category)),
    });
  };

  return (
    <>
      <AdminSearch value={search} onChange={setSearch} placeholder="Search food item..." />
      <motion.div className="admin-list-heading" variants={itemVariants}>
        <h1>Products / Menu</h1>
        <button
          className="admin-primary-button"
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setShowProductModal(true);
          }}
        >
          <Plus size={15} strokeWidth={1.8} aria-hidden="true" />
          Add New Food
        </button>
      </motion.div>
      <div className="admin-tabs">
        <button
          className={activeTab === 'food' ? 'is-active' : ''}
          type="button"
          onClick={() => setActiveTab('food')}
        >
          Food Items
        </button>
        <button
          className={activeTab === 'categories' ? 'is-active' : ''}
          type="button"
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>
      {activeTab === 'food' ? (
        <>
          <div className="admin-inline-filters">
            <select
              className="admin-compact-select"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <select
              className="admin-compact-select"
              value={availabilityFilter}
              onChange={(event) => setAvailabilityFilter(event.target.value)}
            >
              <option value="all">All availability</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
          <motion.div className="admin-product-grid" variants={pageVariants}>
            {visibleProducts.map((item) => (
              <article className="admin-product-card" key={item.id}>
                <img src={item.image} alt="" loading="lazy" />
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                  <strong>{formatPrice(item.price)}</strong>
                  <span className={item.available ? 'is-available' : 'is-unavailable'}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <footer>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(item);
                      setShowProductModal(true);
                    }}
                  >
                    <Pencil size={15} strokeWidth={1.8} aria-hidden="true" />
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteProduct(item.id)}>
                    <Trash2 size={15} strokeWidth={1.8} aria-hidden="true" />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProducts((current) =>
                        current.map((product) =>
                          product.id === item.id ? { ...product, available: !product.available } : product
                        )
                      )
                    }
                  >
                    {item.available ? (
                      <XCircle size={15} strokeWidth={1.8} aria-hidden="true" />
                    ) : (
                      <CheckCircle2 size={15} strokeWidth={1.8} aria-hidden="true" />
                    )}
                    {item.available ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                </footer>
              </article>
            ))}
          </motion.div>
        </>
      ) : (
        <>
          <div className="admin-category-form">
            <input
              value={categoryDraft}
              onChange={(event) => setCategoryDraft(event.target.value)}
              placeholder="Category name"
            />
            <button className="admin-primary-button" type="button" onClick={saveCategory}>
              {editingCategory ? (
                <Save size={15} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <Plus size={15} strokeWidth={1.8} aria-hidden="true" />
              )}
              {editingCategory ? 'Save Category' : 'Add Category'}
            </button>
          </div>
          <div className="admin-simple-grid">
            {categories.map((category) => (
              <article className="admin-simple-card" key={category}>
                <strong>{category}</strong>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(category);
                      setCategoryDraft(category);
                    }}
                  >
                    <Pencil size={15} strokeWidth={1.8} aria-hidden="true" />
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteCategory(category)}>
                    <Trash2 size={15} strokeWidth={1.8} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {showProductModal && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowProductModal(false)}
          onSave={saveProduct}
        />
      )}
    </>
  );
}
