import { getProducts } from "@/actions/products";
import { ProductConfigurator } from "@/components/product-configurator";

export const dynamic = "force-dynamic";
export default async function LatticePage() { return <ProductConfigurator type={1} products={await getProducts(1)} />; }
