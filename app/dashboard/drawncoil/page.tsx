import { getProducts } from "@/actions/products";
import { ProductManagement } from "@/components/product-management";
export const dynamic = "force-dynamic";
export default async function DrawnManagementPage() { return <ProductManagement type={3} products={await getProducts(3, true)} />; }
