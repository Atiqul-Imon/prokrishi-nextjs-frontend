"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, className = "", padding = "md", hover = false, gradient = false }: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg ${paddingClasses[padding]} ${
        hover ? "hover:shadow-xl hover:scale-[1.01] transition-all duration-300" : ""
      } ${gradient ? "bg-gradient-to-br from-white via-gray-50 to-white" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function CardHeader({ title, description, actions, className = "" }: CardHeaderProps) {
  return (
    <div className={`px-6 py-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-transparent rounded-t-2xl ${className}`}>
      <div>
        <h2 className="text-xl font-black text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-700 mt-1.5 font-medium">{description}</p>}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end items-center ${className}`}>
      {children}
    </div>
  );
}

export default Card;
