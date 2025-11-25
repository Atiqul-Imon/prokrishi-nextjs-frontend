import { Metadata } from "next";
import { getApiBaseUrl } from "@/app/utils/env";

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchProduct(id: string) {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/product/${id}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
    const product = await fetchProduct(id);

    if (!product) {
      return {
        title: "Product Not Found | Prokrishi",
        description: "The product you're looking for doesn't exist.",
      };
    }

    const title = product.metaTitle || `${product.name} | Prokrishi`;
    const description = product.metaDescription || product.shortDescription || product.description?.substring(0, 160) || "Browse our agricultural products";
    const imageUrl = product.image || "/logo/prokrishihublogo.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/products/${product.slug || product._id}`,
      },
    };
  } catch (error) {
    return {
      title: "Product | Prokrishi",
      description: "Browse agricultural products on Prokrishi",
    };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

