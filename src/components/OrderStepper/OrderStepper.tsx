import React from 'react';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface StepperStep {
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface OrderStepperProps {
  steps: StepperStep[];
  currentStep: number;
  orderStatus: string;
}

const OrderStepper: React.FC<OrderStepperProps> = ({ steps, currentStep, orderStatus }) => {
  // If order is cancelled, show cancelled state
  if (orderStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Order Cancelled</h3>
            <p className="text-sm text-red-600">This order has been cancelled and will not be processed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-[#13ee9e] transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Step Circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${step.status === 'completed' 
                  ? 'bg-[#13ee9e] border-[#13ee9e] text-white' 
                  : step.status === 'current'
                  ? 'bg-white border-[#13ee9e] text-[#13ee9e]'
                  : 'bg-white border-gray-300 text-gray-400'
                }
              `}>
                {step.status === 'completed' ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <p className={`text-sm font-medium ${
                  step.status === 'completed' || step.status === 'current'
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
                {step.status === 'current' && (
                  <p className="text-xs text-[#13ee9e] mt-1">Current</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStepper;
