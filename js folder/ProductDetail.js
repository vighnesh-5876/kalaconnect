import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from './axios';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { StarRating } from './ProductCard';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:5000';
const PLACEHOLDER = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=60';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Review form
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/reviews/${id}`),
        ]);
        setProduct(prodRes.data.product);
        setReviews(revRes.data.reviews || []);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER;
    return img.startsWith('http') ? img : `${IMG_BASE}${img}`;
  };

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in to add to cart'); return; }
    if (user.role === 'seller') { toast.error('Sellers cannot purchase products'); return; }
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { toast.error('Please sign in'); return; }
    if (user.role === 'seller') { toast.error('Sellers cannot purchase products'); return; }
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      navigate('/checkout');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Sign in to wishlist'); return; }
    try {
      const { data } = await API.post(`/wishlist/toggle/${product._id}`);
      setIsWishlisted(data.action === 'added');
      toast.success(data.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Sign in to review'); return; }
    if (user.role === 'seller') { toast.error('Sellers cannot review products'); return; }
    if (!reviewForm.title.trim() || !reviewForm.body.trim()) {
      toast.error('Please fill all review fields'); return;
    }
    try {
      setSubmittingReview(true);
      const { data } = await API.post(`/reviews/${id}`, reviewForm);
      setReviews((prev) => [data.review, ...prev]);
      setProduct((p) => ({
        ...p,
        averageRating: data.review ? p.averageRating : p.averageRating,
        numReviews: reviews.length + 1,
      }));
      setReviewForm({ rating: 5, title: '', body: '' });
      toast.success('Review submitted!');
      // Refresh product rating
      const { data: prodData } = await API.get(`/products/${id}`);
      setProduct(prodData.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 page-container">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-ink-800 aspect-square shimmer" />
          <div className="space-y-4">
            {[80, 40, 60, 30, 100].map((w, i) => (
              <div key={i} className={`h-6 bg-ink-800 shimmer`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [null];
  const isSoldOut = product.stock === 0;
  const isSeller = user?.role === 'seller';
  const isOwner = user?._id === product.sellerId?._id;

  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-parchment-300/40 mb-8">
          <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gold-400 transition-colors">Artworks</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-gold-400 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-parchment-300/60 truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className="bg-ink-800 border border-ink-700 overflow-hidden aspect-square">
              <img
                src={getImageUrl(images[selectedImage])}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-16 border-2 overflow-hidden transition-colors ${
                      selectedImage === i ? 'border-gold-500' : 'border-ink-600 hover:border-ink-400'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = PLACEHOLDER; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Category & Availability */}
            <div className="flex items-center gap-3 mb-4">
              <span className="tag">{product.category}</span>
              {isSoldOut
                ? <span className="badge-gold bg-rust-500/10 border-rust-400/30 text-rust-400">Sold Out</span>
                : <span className="badge-gold">Available</span>
              }
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-parchment-50 leading-tight mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={product.averageRating} />
                <span className="text-gold-400 font-sans text-sm font-medium">{product.averageRating}</span>
                <span className="text-parchment-300/40 font-sans text-sm">({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Price */}
            <div className="font-display text-4xl text-gold-400 font-semibold mb-6">
              ₹{product.price.toLocaleString('en-IN')}
            </div>

            {/* Description */}
            <p className="text-parchment-300/70 font-body text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-ink-800 border border-ink-700">
              {product.dimensions && (
                <div>
                  <p className="text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase mb-0.5">Dimensions</p>
                  <p className="text-parchment-200 text-sm font-sans">{product.dimensions}</p>
                </div>
              )}
              {product.medium && (
                <div>
                  <p className="text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase mb-0.5">Medium</p>
                  <p className="text-parchment-200 text-sm font-sans">{product.medium}</p>
                </div>
              )}
              <div>
                <p className="text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase mb-0.5">In Stock</p>
                <p className="text-parchment-200 text-sm font-sans">{product.stock} piece{product.stock !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase mb-0.5">Sold</p>
                <p className="text-parchment-200 text-sm font-sans">{product.totalSold} times</p>
              </div>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span key={tag} className="tag"># {tag}</span>
                ))}
              </div>
            )}

            {/* Quantity & Cart — Buyers only */}
            {!isSeller && !isOwner && !isSoldOut && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-ink-600">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 text-parchment-300/60 hover:text-parchment-100 hover:bg-ink-700 transition-colors"
                  >–</button>
                  <span className="w-10 text-center font-sans text-sm text-parchment-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 text-parchment-300/60 hover:text-parchment-100 hover:bg-ink-700 transition-colors"
                  >+</button>
                </div>
                <button onClick={handleWishlist} className="w-10 h-10 border border-ink-600 flex items-center justify-center hover:border-gold-500/50 transition-colors">
                  <HeartIcon filled={isWishlisted} />
                </button>
              </div>
            )}

            {!isSeller && !isOwner ? (
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || isSoldOut}
                  className="btn-outline flex-1 py-3.5 disabled:opacity-40"
                >
                  {addingToCart ? 'Adding...' : isSoldOut ? 'Sold Out' : 'Add to Cart'}
                </button>
                {!isSoldOut && (
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="btn-gold flex-1 py-3.5 disabled:opacity-40"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            ) : isOwner ? (
              <Link to={`/seller/products/edit/${product._id}`} className="btn-outline w-full text-center py-3.5">
                Edit This Product
              </Link>
            ) : null}

            {/* Seller info */}
            {product.sellerId && (
              <div className="mt-8 p-4 bg-ink-800 border border-ink-700 flex items-start gap-4">
                <div className="w-12 h-12 bg-ink-600 border border-ink-500 flex items-center justify-center shrink-0 overflow-hidden">
                  {product.sellerId.avatar ? (
                    <img src={`${IMG_BASE}${product.sellerId.avatar}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-parchment-300 font-semibold text-lg">
                      {product.sellerId.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-parchment-300/40 text-[10px] font-sans tracking-widest uppercase mb-0.5">Artist</p>
                  <p className="text-parchment-100 font-display text-base font-medium">{product.sellerId.name}</p>
                  {product.sellerId.bio && (
                    <p className="text-parchment-300/50 font-sans text-xs mt-1 line-clamp-2">{product.sellerId.bio}</p>
                  )}
                  <Link to={`/seller/${product.sellerId._id}`} className="text-gold-500/70 hover:text-gold-400 text-xs font-sans mt-2 inline-block transition-colors">
                    View Artist Profile →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-16 pt-12 border-t border-ink-700">
          <h2 className="font-display text-2xl text-parchment-50 mb-8">
            Reviews {reviews.length > 0 && <span className="text-parchment-300/40 text-lg">({reviews.length})</span>}
          </h2>

          {/* Write review */}
          {user && user.role === 'buyer' && (
            <div className="card-dark p-6 mb-8">
              <h3 className="font-display text-parchment-100 text-lg mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="label-dark">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}>
                        <svg className={`w-6 h-6 ${star <= reviewForm.rating ? 'star-filled' : 'star-empty'} transition-colors`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label-dark">Title</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    className="input-dark"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="label-dark">Review</label>
                  <textarea
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                    placeholder="Share your experience with this artwork..."
                    className="input-dark resize-none h-28"
                    maxLength={1000}
                  />
                </div>
                <button type="submit" disabled={submittingReview} className="btn-gold disabled:opacity-50">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Review list */}
          {reviews.length === 0 ? (
            <p className="text-parchment-300/40 font-body text-base">No reviews yet. Be the first to review this artwork.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="card-dark p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-ink-600 border border-ink-500 flex items-center justify-center shrink-0">
                        <span className="font-sans text-parchment-300 text-sm font-semibold">
                          {review.buyer?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-parchment-100 font-sans text-sm font-medium">{review.buyer?.name || 'Anonymous'}</p>
                        <p className="text-parchment-300/30 text-xs font-sans">{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <h4 className="font-display text-parchment-100 mt-3 mb-1">{review.title}</h4>
                  <p className="text-parchment-300/60 font-body text-sm leading-relaxed">{review.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const HeartIcon = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-rust-400 fill-current' : 'text-parchment-300/60'}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
