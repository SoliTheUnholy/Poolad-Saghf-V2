import { getProducts } from "@/actions/products";
import { ProductConfigurator } from "@/components/product-configurator";

export const dynamic = "force-dynamic";
export default async function CoilPage() { return <ProductConfigurator type={2} products={await getProducts(2)} />; }
