import { useEffect, useState } from 'react';
import { Product } from '@/types/Product'; // ✅ Use shared type

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL; // 👈 use env variable
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
