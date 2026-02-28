'use client'

import { STEPS, StepType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: StepType
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep)

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          const isUpcoming = index > currentStepIndex

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    {
                      'bg-blue-600 border-blue-600 text-white': isCompleted,
                      'bg-blue-600 border-blue-600 text-white scale-110':
                        isCurrent,
                      'bg-gray-100 border-gray-300 text-gray-400': isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.order}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn('text-sm font-medium', {
                      'text-blue-600': isCurrent,
                      'text-gray-900': isCompleted,
                      'text-gray-400': isUpcoming,
                    })}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-all -mt-8 mx-2',
                    {
                      'bg-blue-600': isCompleted,
                      'bg-gray-300': !isCompleted,
                    }
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
