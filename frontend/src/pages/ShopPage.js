import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

const CATEGORIES = [
  'Phones', 'Computers', 'SmartWatch', 'Camera', 'HeadPhones', 'Gaming',
  "Women's Fashion", "Men's Fashion", 'Electronics', 'Home & Lifestyle',
  'Groceries & Pets', 'Medicine', 'Sports & Outdoor', "Baby's & Toys", 'Health & Beauty'
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({ category, search, sort, page, limit });
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = category || search;

  return (
    <div className="container shop-page" style={{ padding: '40px 24px 80px' }}>
      <div className="shop-header">
        <div className="shop-header-left">
          <h1 className="shop-title">
            {search ? `Results for "${search}"` : category || 'All Products'}
          </h1>
          <p className="shop-count">{total} items found</p>
        </div>
        <div className="shop-header-right">
          {hasFilters && (
            <button className="btn btn-outline btn-sm" onClick={clearFilters}>
              <X size={14} /> Clear Filters
            </button>
          )}
          <button className="btn btn-outline btn-sm filter-toggle-btn" onClick={() => setFiltersOpen(o => !o)}>
            <SlidersHorizontal size={14} /> Filters
          </button>
          <div className="sort-select-wrap">
            <select
              className="sort-select"
              value={sort}
              onChange={e => setParam('sort', e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="sort-chevron" />
          </div>
        </div>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className={`shop-filters ${filtersOpen ? 'open' : ''}`}>
          <div className="filter-section">
            <h3 className="filter-title">Categories</h3>
            <ul className="filter-list">
              <li>
                <button
                  className={`filter-item ${!category ? 'active' : ''}`}
                  onClick={() => setParam('category', '')}
                >
                  All Categories
                </button>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    className={`filter-item ${category === cat ? 'active' : ''}`}
                    onClick={() => setParam('category', cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="shop-products">
          {loading ? (
            <div className="grid-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 8 }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <p>No products found. Try different filters.</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid-4">
                {products.map((p, i) => (
                  <ProductCard key={p._id} product={p} style={{ animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setParam('page', String(page - 1))}
                    disabled={page <= 1}
                  >
                    ←
                  </button>
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => setParam('page', String(i + 1))}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => setParam('page', String(page + 1))}
                    disabled={page >= pages}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
