"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  Map,
  ShoppingBag,
  Settings,
  Lock,
  Heart,
  LogOut,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import ProfileInfo from "./ProfileInfo";
import AddressBook from "./AddressBook";
import Orders from "./Orders";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const TABS = [
  {
    name: "Profile",
    icon: User,
    description: "Manage your personal information",
    color: "primary",
  },
  {
    name: "Addresses",
    icon: Map,
    description: "Your delivery addresses",
    color: "secondary",
  },
  {
    name: "Orders",
    icon: ShoppingBag,
    description: "View your order history",
    color: "green",
  },
  {
    name: "Settings",
    icon: Settings,
    description: "Account preferences",
    color: "blue",
  },
  {
    name: "Security",
    icon: Lock,
    description: "Password and security",
    color: "purple",
  },
  {
    name: "Wishlist",
    icon: Heart,
    description: "Your saved items",
    color: "pink",
  },
  {
    name: "Logout",
    icon: LogOut,
    description: "Sign out of your account",
    color: "red",
  },
];

const colorClasses = {
  primary: "bg-primary-50 text-primary-700 border-primary-200",
  secondary: "bg-secondary-50 text-secondary-700 border-secondary-200",
  green: "bg-green-50 text-green-700 border-green-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  pink: "bg-pink-50 text-pink-700 border-pink-200",
  red: "bg-red-50 text-red-700 border-red-200",
};

const AccountPage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { messages, success, removeMessage } = useInlineMessage();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          Please log in to view your account details.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleTabClick = (name) => {
    if (name === "Logout") {
      setShowLogoutConfirm(true);
    } else {
      setActiveTab(name);
    }
  };

  const confirmLogout = () => {
    logout();
    success("Logged out successfully", 3000);
    setShowLogoutConfirm(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Inline Messages */}
        <div className="mb-4 space-y-2">
          {messages.map((msg) => (
            <InlineMessage
              key={msg.id}
              type={msg.type}
              message={msg.message}
              onClose={() => removeMessage(msg.id)}
            />
          ))}
        </div>

        {/* Logout Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showLogoutConfirm}
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          type="warning"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Manage your profile, orders, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Menu
              </h2>
              <nav className="space-y-2">
                {TABS.map(({ name, icon: Icon, description, color }) => (
                  <button
                    key={name}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                      activeTab === name
                        ? `${colorClasses[color]} border-2`
                        : "hover:bg-gray-50 text-gray-700 border-2 border-transparent"
                    }`}
                    onClick={() => handleTabClick(name)}
                  >
                    <Icon size={20} className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{name}</div>
                      <div className="text-xs opacity-75 mt-0.5">
                        {description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div>
              <div
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                {/* Tab Header */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const currentTab = TABS.find((t: any) => t.name === activeTab);
                      const Icon = currentTab?.icon;
                      return Icon ? (
                        <Icon size={24} className="text-primary-600" />
                      ) : null;
                    })()}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {activeTab}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {TABS.find((t: any) => t.name === activeTab)?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "Profile" && <ProfileInfo />}
                  {activeTab === "Addresses" && <AddressBook />}
                  {activeTab === "Orders" && <Orders />}
                  {activeTab === "Settings" && (
                    <div className="text-center py-12">
                      <Settings
                        size={48}
                        className="text-gray-400 mx-auto mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Settings
                      </h3>
                      <p className="text-gray-600">
                        Account settings and preferences coming soon.
                      </p>
                    </div>
                  )}
                  {activeTab === "Security" && (
                    <div className="text-center py-12">
                      <Lock size={48} className="text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Security
                      </h3>
                      <p className="text-gray-600">
                        Password and security settings coming soon.
                      </p>
                    </div>
                  )}
                  {activeTab === "Wishlist" && (
                    <div className="text-center py-12">
                      <Heart size={48} className="text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Wishlist
                      </h3>
                      <p className="text-gray-600">
                        Your saved items will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
