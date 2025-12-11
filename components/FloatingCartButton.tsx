"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { formatAmount } from "@/app/utils/numberFormat";

/**
 * A floating mini-cart CTA aligned to the right.
 * Shows only when cart has items and hides on checkout/cart/dashboard pages.
 */
export default function FloatingCartButton() {
  const { cartCount, cartTotal } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const shouldHide = useMemo(() => {
    if (!pathname) return false;
    if (pathname.startsWith("/dashboard")) return true;
    if (pathname.startsWith("/checkout")) return true;
    if (pathname.startsWith("/cart")) return true;
    return false;
  }, [pathname]);

  if (!cartCount || cartCount <= 0) return null;
  if (shouldHide) return null;

  return (
    <button
      onClick={() => router.push("/cart")}
      className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center w-[78px] rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-200"
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <div className="flex flex-col items-center justify-center w-full py-3 bg-[#0b7c7c] text-white">
        <ShoppingCart className="w-5 h-5" />
        <span className="text-xs font-semibold mt-1">Item</span>
        <span className="text-[11px] font-bold mt-0.5">{cartCount ?? 0}</span>
      </div>
      <div className="w-full py-1.5 text-center text-white text-sm font-semibold bg-[#f9a44c]">
        ৳{formatAmount(cartTotal)}
      </div>
    </button>
  );
}

