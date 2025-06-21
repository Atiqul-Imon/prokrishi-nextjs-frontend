import React from 'react';

export default function ProfileInfo() {
  // Replace with real user info fetching
  const user = {
    name: "Atiqul Imon",
    email: "imon@email.com",
    phone: "017xxxxxxxx"
  };
  return (
    <div>
      <h2 className="font-semibold mb-4">Profile Information</h2>
      <div className="space-y-2">
        <div>Name: {user.name}</div>
        <div>Email: {user.email}</div>
        <div>Phone: {user.phone}</div>
      </div>
      {/* Add edit functionality as needed */}
    </div>
  );
}