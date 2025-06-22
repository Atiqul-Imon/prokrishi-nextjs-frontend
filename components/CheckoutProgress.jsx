"use client";

import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

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
          <motion.div
            className="h-full bg-primary-600"
            initial={{ width: 0 }}
            animate={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
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
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? "bg-primary-600 text-white"
                      : isCurrent
                        ? "bg-primary-100 text-primary-600 border-2 border-primary-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isCompleted ? <CheckIcon className="w-5 h-5" /> : index + 1}
                </motion.div>

                {/* Step label */}
                <div className="mt-2 text-center">
                  <motion.p
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {step.name}
                  </motion.p>
                  <motion.p
                    className={`text-xs ${
                      isCompleted || isCurrent
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {step.description}
                  </motion.p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
