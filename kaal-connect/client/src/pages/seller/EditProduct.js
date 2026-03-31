import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import ProductForm from './ProductForm';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => navigate('/seller/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="pt-24 page-container">
      <div className="space-y-4">
        {[1,2,3].map(i=><div key={i} className="h-20 bg-ink-800 shimmer"/>)}
      </div>
    </div>
  );

  if (!product) return null;

  return <ProductForm product={product} isEdit={true} />;
}
