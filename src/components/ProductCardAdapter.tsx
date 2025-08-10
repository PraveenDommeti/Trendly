
import { Product as SupabaseProduct } from "@/context/SupabaseTrendlyContext";
import ProductCard from "./ProductCard";

// Legacy Product interface for the ProductCard component - updated to match Supabase Product
interface LegacyProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  brand: string | null;
  affiliate_link: string | null;
  is_internal: boolean;
  commission_rate: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const mapSupabaseToLegacyProduct = (supabaseProduct: SupabaseProduct): LegacyProduct => {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description,
    price: supabaseProduct.price,
    image_url: supabaseProduct.image_url,
    category: supabaseProduct.category,
    brand: supabaseProduct.brand,
    affiliate_link: supabaseProduct.affiliate_link,
    is_internal: supabaseProduct.is_internal,
    commission_rate: supabaseProduct.commission_rate,
    stock_quantity: supabaseProduct.stock_quantity,
    is_active: supabaseProduct.is_active,
    created_at: supabaseProduct.created_at,
    updated_at: supabaseProduct.updated_at,
  };
};

interface ProductCardAdapterProps {
  product: SupabaseProduct;
}

const ProductCardAdapter = ({ product }: ProductCardAdapterProps) => {
  const legacyProduct = mapSupabaseToLegacyProduct(product);
  return <ProductCard product={legacyProduct} />;
};

export default ProductCardAdapter;
