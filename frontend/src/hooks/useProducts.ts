import { useState, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  image_link: string;
  description: string;
  available_stocks: number;
  price: number;
  is_negotiable: boolean;
  owner_id: number;
  company_id?: number;
  likes: number;
  sold: boolean;
}

interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  sold?: boolean;
  companyId?: number;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  createProduct: (productData: CreateProductInput) => Promise<Product>;
}

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  image_link: string;
  available_stocks: number;
  is_negotiable: boolean;
  company_id?: number;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const query = `
        query GetProductsAdvanced(
          $search: String
          $minPrice: Int
          $maxPrice: Int
          $minStock: Int
          $sold: Boolean
          $companyId: Int
          $sortBy: String
          $limit: Int
          $offset: Int
        ) {
          getProductsAdvanced(
            search: $search
            minPrice: $minPrice
            maxPrice: $maxPrice
            minStock: $minStock
            sold: $sold
            companyId: $companyId
            sortBy: $sortBy
            limit: $limit
            offset: $offset
          ) {
            id
            name
            image_link
            description
            available_stocks
            price
            is_negotiable
            owner_id
            company_id
            likes
            sold
          }
        }
      `;

      const variables = {
        search: filters?.search || null,
        minPrice: filters?.minPrice || null,
        maxPrice: filters?.maxPrice || null,
        minStock: filters?.minStock || null,
        sold: filters?.sold !== undefined ? filters.sold : null,
        companyId: filters?.companyId || null,
        sortBy: filters?.sortBy || 'created_desc',
        limit: filters?.limit || 20,
        offset: filters?.offset || 0,
      };

      const response = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setProducts(result.data.getProductsAdvanced);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: CreateProductInput): Promise<Product> => {
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const mutation = `
        mutation CreateProduct($input: CreateProductInput!) {
          createProduct(input: $input) {
            id
            name
            description
            price
            image_link
            available_stocks
            is_negotiable
            owner_id
            company_id
            likes
            sold
          }
        }
      `;

      const response = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutation,
          variables: {
            input: productData
          }
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const newProduct = result.data.createProduct;
      
      // Refresh products list
      await fetchProducts();
      
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
  };
};

export type { Product, ProductFilters, CreateProductInput };
