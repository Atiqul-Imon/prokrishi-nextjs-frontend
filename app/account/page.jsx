'use client';

import React, { useState } from 'react';
import { User, Home, ShoppingBag, LogOut } from 'lucide-react';
import ProfileInfo from './ProfileInfo';
import Orders from './Orders';
import AddressBook from './AddressBook';

const TABS = [
  { name: 'Profile', icon: User },
  { name: 'Addresses', icon: Home },
  { name: 'Orders', icon: ShoppingBag },
  { name: 'Logout', icon: LogOut },
];

export default function AccountPage() {
  const [tab, setTab] = useState('Profile');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="flex gap-6">
        <nav className="flex flex-col gap-2 min-w-[150px]">
          {TABS.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`flex items-center gap-2 px-3 py-2 rounded text-left ${tab === name ? 'bg-green-50 text-green-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => {
                if (name === 'Logout') {
                  // TODO: Call logout logic
                  alert('Logging out...');
                } else {
                  setTab(name);
                }
              }}
            >
              <Icon size={18} /> {name}
            </button>
          ))}
        </nav>
        <main className="flex-1 bg-white shadow rounded-lg p-6 min-h-[400px]">
          {tab === 'Profile' && <ProfileInfo />}
          {tab === 'Addresses' && <AddressBook />}
          {tab === 'Orders' && <Orders />}
        </main>
      </div>
    </div>
  );
}