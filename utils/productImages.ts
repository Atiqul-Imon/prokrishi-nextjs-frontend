export type ProductImageSource = {
  image?: string;
  images?: string[];
};

const DEFAULT_PLACEHOLDER = "/img/placeholder.png";

export const getProductImageList = (
  product?: ProductImageSource,
  fallback: string = DEFAULT_PLACEHOLDER,
): string[] => {
  const list: string[] = [];

  if (product?.images?.length) {
    product.images.forEach((img) => {
      if (img) {
        list.push(img);
      }
    });
  }

  if (!list.length && product?.image) {
    list.push(product.image);
  }

  if (!list.length && fallback) {
    list.push(fallback);
  }

  return list;
};

export const getPrimaryProductImageSource = (
  product?: ProductImageSource,
  fallback: string = DEFAULT_PLACEHOLDER,
) => {
  const images = getProductImageList(product, fallback);
  return images[0] || fallback;
};

export const getSecondaryProductImageSource = (product?: ProductImageSource): string | null => {
  const images = getProductImageList(product);
  return images[1] ?? null;
};

