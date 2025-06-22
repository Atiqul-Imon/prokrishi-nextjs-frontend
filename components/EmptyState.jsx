import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  Users,
  FileText,
  Search,
  Heart,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const EmptyState = ({
  type = "default",
  title,
  description,
  actionText,
  actionHref,
  onAction,
  icon: CustomIcon,
  showAction = true,
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case "products":
        return {
          icon: Package,
          title: "No Products Found",
          description:
            "We couldn't find any products matching your criteria. Try adjusting your filters or search terms.",
          actionText: "Browse All Products",
          actionHref: "/products",
        };
      case "orders":
        return {
          icon: FileText,
          title: "No Orders Yet",
          description:
            "You haven't placed any orders yet. Start shopping to see your order history here.",
          actionText: "Start Shopping",
          actionHref: "/products",
        };
      case "customers":
        return {
          icon: Users,
          title: "No Customers Found",
          description:
            "There are no customers registered yet. They will appear here once they sign up.",
          actionText: "View Dashboard",
          actionHref: "/dashboard",
        };
      case "cart":
        return {
          icon: ShoppingCart,
          title: "Your Cart is Empty",
          description:
            "Add some products to your cart to get started with your shopping.",
          actionText: "Continue Shopping",
          actionHref: "/products",
        };
      case "search":
        return {
          icon: Search,
          title: "No Results Found",
          description:
            "We couldn't find any products matching your search. Try different keywords or browse our categories.",
          actionText: "Browse Categories",
          actionHref: "/products",
        };
      case "wishlist":
        return {
          icon: Heart,
          title: "Your Wishlist is Empty",
          description:
            "Save your favorite products to your wishlist for easy access later.",
          actionText: "Discover Products",
          actionHref: "/products",
        };
      case "categories":
        return {
          icon: Package,
          title: "No Categories Found",
          description: "No product categories have been created yet.",
          actionText: "Add Category",
          actionHref: "/dashboard/categories/add",
        };
      default:
        return {
          icon: Package,
          title: "No Data Found",
          description: "There's nothing to display here at the moment.",
          actionText: "Go Back",
          actionHref: "/",
        };
    }
  };

  const content = {
    icon: CustomIcon || getDefaultContent().icon,
    title: title || getDefaultContent().title,
    description: description || getDefaultContent().description,
    actionText: actionText || getDefaultContent().actionText,
    actionHref: actionHref || getDefaultContent().actionHref,
  };

  const IconComponent = content.icon;

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <motion.div
        className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <IconComponent className="w-10 h-10 text-gray-400" />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-2xl font-semibold text-gray-900 mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {content.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-gray-600 max-w-md mb-8 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {content.description}
      </motion.p>

      {/* Action Button */}
      {showAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              {content.actionText}
            </button>
          ) : actionHref ? (
            <Link href={actionHref}>
              <motion.button
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type === "search" ? (
                  <RefreshCw className="w-5 h-5 mr-2" />
                ) : (
                  <Plus className="w-5 h-5 mr-2" />
                )}
                {content.actionText}
              </motion.button>
            </Link>
          ) : null}
        </motion.div>
      )}

      {/* Additional Help Text */}
      {type === "search" && (
        <motion.div
          className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-sm text-gray-600">
            <strong>Search Tips:</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• Try using different keywords</li>
            <li>• Check your spelling</li>
            <li>• Use more general terms</li>
            <li>• Browse categories instead</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
