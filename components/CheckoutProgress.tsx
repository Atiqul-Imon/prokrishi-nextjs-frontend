"use client";

import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

const steps = [
  { id: "cart", name: "Cart Review", description: "Review your items" },
  { id: "shipping", name: "Shipping", description: "Delivery address" },
  { id: "payment", name: "Payment", description: "Payment method" },
  { id: "confirmation", name: "Confirmation", description: "Order summary" },
];

export default function CheckoutProgress({ currentStep = "cart" }) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
          <div
            className="h-full bg-primary-600 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary-600 text-white"
                      : isCurrent
                        ? "bg-primary-100 text-primary-600 border-2 border-primary-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ? <CheckIcon className="w-5 h-5" /> : index + 1}
                </div>

                {/* Step label */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isCompleted || isCurrent
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      isCompleted || isCurrent
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
