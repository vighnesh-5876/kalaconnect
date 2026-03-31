import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from './axios';
import ProductCard from './ProductCard';

const CATEGORIES = ['All', 'Paintings', 'Sculptures', 'Handmade Crafts', 'Photography', 'Digital Art', 'Jewelry', 'Textiles', 'Ceramics', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Best Selling' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'All') params.set('category', category);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('page', page);
      params.set('limit', 12);

      const { data } = await API.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sync category from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const srch = searchParams.get('search');
    if (cat) setCategory(cat);
    if (srch) setSearch(srch);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (cat === 'All') p.delete('category');
    else p.set('category', cat);
    setSearchParams(p);
  };

  const handleReset = () => {
    setSearch(''); setCategory('All'); setSort('newest');
    setMinPrice(''); setMaxPrice(''); setPage(1);
    setSearchParams({});
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="label-dark mb-3">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`w-full text-left px-3 py-2 text-sm font-sans transition-colors ${
                category === cat
                  ? 'text-gold-400 bg-gold-500/10 border-l-2 border-gold-500'
                  : 'text-parchment-300/60 hover:text-parchment-200 hover:bg-ink-700/50 border-l-2 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="label-dark mb-3">Price Range (₹)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="input-dark text-sm py-2 px-3 w-full"
            min="0"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="input-dark text-sm py-2 px-3 w-full"
            min="0"
          />
        </div>
        <button onClick={() => { setPage(1); fetchProducts(); }} className="btn-outline w-full mt-2 py-2 text-xs">
          Apply Price
        </button>
      </div>

      {/* Reset */}
      <button onClick={handleReset} className="text-parchment-300/40 hover:text-rust-400 text-xs font-sans transition-colors">
        ✕ Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="pt-24 pb-20 page-container">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Discover</p>
        <h1 className="section-title">All Artworks</h1>
        {total > 0 && (
          <p className="text-parchment-300/40 font-sans text-sm mt-2">{total} work{total !== 1 ? 's' : ''} found</p>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-ink-700">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-60">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artworks, artists..."
            className="input-dark flex-1 py-2.5 text-sm"
          />
          <button type="submit" className="btn-gold py-2.5 px-4 text-sm">Search</button>
        </form>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="input-dark py-2.5 text-sm w-auto min-w-[160px]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-outline py-2.5 px-4 text-sm lg:hidden"
        >
          ⚡ Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <FilterSidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="bg-ink-900/70 flex-1" onClick={() => setSidebarOpen(false)} />
            <div className="w-72 bg-ink-800 border-l border-ink-600 p-6 overflow-y-auto animate-slide-in-right">
              <div className="flex justify-between items-center mb-6">
                <span className="font-display text-parchment-100 text-lg">Filters</span>
                <button onClick={() => setSidebarOpen(false)} className="text-parchment-300/50 hover:text-parchment-100">✕</button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card-dark overflow-hidden">
                  <div className="bg-ink-700 aspect-art shimmer" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-ink-700 w-1/2 shimmer" />
                    <div className="h-4 bg-ink-700 w-full shimmer" />
                    <div className="h-4 bg-ink-700 w-3/4 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🎨</p>
              <p className="font-display text-parchment-300/60 text-xl mb-2">No artworks found</p>
              <p className="text-parchment-300/30 font-sans text-sm">Try adjusting your search or filters</p>
              <button onClick={handleReset} className="btn-outline mt-6">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-outline py-2 px-4 text-sm disabled:opacity-30"
                  >
                    ← Prev
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 text-sm font-sans transition-colors ${
                          page === p
                            ? 'bg-gold-500 text-ink-900 font-semibold'
                            : 'text-parchment-300/60 hover:text-parchment-100 hover:bg-ink-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="btn-outline py-2 px-4 text-sm disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
