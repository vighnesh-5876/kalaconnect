import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";

const IMG_BASE = "http://localhost:5000";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    API.get("/products/my-products")
      .then(({ data }) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (product) => {
    try {
      const formData = new FormData();
      formData.append("isAvailable", !product.isAvailable);
      const { data } = await API.put(`/products/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? data.product : p))
      );
      toast.success(data.product.isAvailable ? "Shown in marketplace" : "Hidden from marketplace");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="pt-24 pb-20" style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ color: "#d4a843", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "6px" }}>Artist Studio</p>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "36px", color: "#fdf8ef" }}>My Artworks</h1>
        </div>
        <Link to="/seller/products/new" className="btn-gold" style={{ padding: "12px 24px" }}>+ Add New Work</Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: "60px", marginBottom: "24px" }}>???</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", color: "#fdf8ef", fontSize: "28px", marginBottom: "12px" }}>No artworks yet</h2>
          <p style={{ color: "rgba(238,220,180,0.4)", marginBottom: "32px" }}>Start listing your work to reach collectors</p>
          <Link to="/seller/products/new" className="btn-gold" style={{ padding: "14px 32px" }}>List Your First Work</Link>
        </div>
      ) : (
        <div className="card-dark" style={{ overflow: "hidden" }}>
          {products.map((product, i) => {
            const imgSrc = product.images?.[0]
              ? product.images[0].startsWith("http") ? product.images[0] : `${IMG_BASE}${product.images[0]}`
              : "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60";
            return (
              <div key={product._id} style={{
                display: "flex", alignItems: "center", gap: "16px", padding: "16px",
                borderBottom: i < products.length - 1 ? "1px solid rgba(62,50,40,0.5)" : "none",
                flexWrap: "wrap"
              }}>
                <img src={imgSrc} alt={product.title}
                  style={{ width: "56px", height: "56px", objectFit: "cover", background: "#251e17", flexShrink: 0 }}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60"; }} />
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <p style={{ color: "#fdf8ef", fontSize: "14px", fontWeight: "500", marginBottom: "2px" }}>{product.title}</p>
                  <p style={{ color: "rgba(238,220,180,0.4)", fontSize: "12px" }}>{product.category} · Stock: {product.stock}</p>
                </div>
                <p style={{ color: "#d4a843", fontFamily: "Playfair Display, serif", fontWeight: "600" }}>?{product.price.toLocaleString("en-IN")}</p>
                <button onClick={() => handleToggle(product)}
                  style={{ padding: "4px 12px", fontSize: "12px", border: `1px solid ${product.isAvailable ? "rgba(122,158,126,0.4)" : "rgba(62,50,40,0.8)"}`,
                    color: product.isAvailable ? "#7a9e7e" : "rgba(238,220,180,0.3)", background: "transparent", cursor: "pointer" }}>
                  {product.isAvailable ? "Active" : "Hidden"}
                </button>
                <Link to={`/seller/products/edit/${product._id}`}
                  style={{ color: "rgba(238,220,180,0.4)", fontSize: "12px", textDecoration: "none" }}>Edit</Link>
                <button onClick={() => handleDelete(product._id, product.title)}
                  disabled={deletingId === product._id}
                  style={{ color: "#c9624a", background: "transparent", border: "none", cursor: "pointer", fontSize: "12px" }}>
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
