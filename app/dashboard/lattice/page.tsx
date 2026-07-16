import { getProducts } from "@/actions/products";
import { ProductManagement } from "@/components/product-management";
export const dynamic = "force-dynamic";
export default async function LatticeManagementPage() { return <ProductManagement type={1} products={await getProducts(1, true)} />; }
