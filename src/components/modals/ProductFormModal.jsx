import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Image, Save } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

export function ProductFormModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    id: `food-${Date.now()}`,
    name: '',
    category: categories[1] ?? 'Pasta',
    description: '',
    price: '',
    image: '',
    available: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('image', reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.image) {
      setError('Please upload a food image before saving.');
      return;
    }
    setError('');
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <motion.form
        className="admin-details-modal admin-edit-modal"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
      >
        <button className="admin-modal-close" type="button" onClick={onClose} aria-label="Close product form">
          <X size={20} />
        </button>
        <h2>{product ? 'Edit Food Item' : 'Add New Food Item'}</h2>
        <label className="admin-form-field">
          <span>Food name</span>
          <input value={form.name} onChange={(event) => update('name', event.target.value)} required />
        </label>
        <label className="admin-form-field">
          <span>Category</span>
          <select value={form.category} onChange={(event) => update('category', event.target.value)}>
            {categories
              .filter((category) => category !== 'All')
              .map((category) => (
                <option key={category}>{category}</option>
              ))}
          </select>
        </label>
        <label className="admin-form-field">
          <span>Description</span>
          <input value={form.description} onChange={(event) => update('description', event.target.value)} required />
        </label>
        <label className="admin-form-field">
          <span>Price</span>
          <input type="number" value={form.price} onChange={(event) => update('price', event.target.value)} required />
        </label>
        <label className="admin-upload-field">
          <span>Upload Food Image</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} />
          <div className="admin-upload-box">
            {form.image ? <img src={form.image} alt="Food preview" /> : <Image size={30} strokeWidth={1.5} />}
            <strong>{form.image ? 'Change selected image' : 'Click to upload food image'}</strong>
            <small>PNG, JPG, or WEBP supported</small>
          </div>
        </label>
        <label className="admin-form-field">
          <span>Availability</span>
          <select
            value={form.available ? 'available' : 'unavailable'}
            onChange={(event) => update('available', event.target.value === 'available')}
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>
        {error && <p className="admin-error-text">{error}</p>}
        <button className="admin-primary-button" type="submit">
          <Save size={15} strokeWidth={1.8} aria-hidden="true" />
          Save Food Item
        </button>
      </motion.form>
    </div>
  );
}
