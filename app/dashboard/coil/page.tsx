import { getProducts } from "@/actions/products";
import { ProductManagement } from "@/components/product-management";
export const dynamic = "force-dynamic";
export default async function CoilManagementPage() { return <ProductManagement type={2} products={await getProducts(2, true)} />; }
