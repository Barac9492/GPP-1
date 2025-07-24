import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

interface QuizData {
  userType: string;
  budget: string;
  frequency: string;
}

const Quiz: React.FC<QuizProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({
    userType: '',
    budget: '',
    frequency: ''
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete quiz and redirect to dashboard
      console.log('Quiz completed:', quizData);
      onClose();
      setCurrentStep(1);
      setQuizData({
        userType: '',
        budget: '',
        frequency: ''
      });
      // Call onComplete callback
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateQuizData = (field: keyof QuizData, value: string) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      title: "What are you looking for?",
      description: "Choose your shopping direction",
      options: [
        { value: "us-to-korea", label: "US → Korea", description: "Buying Korean cosmetics, skincare, fashion" },
        { value: "korea-to-us", label: "Korea → US", description: "Buying US tech, supplements, luxury items" }
      ],
      field: "userType" as keyof QuizData
    },
    {
      title: "What's your budget range?",
      description: "Help us find the best deals for you",
      options: [
        { value: "under-50", label: "Under $50", description: "Small purchases, samples, basic items" },
        { value: "50-100", label: "$50 - $100", description: "Mid-range products, popular items" },
        { value: "100-300", label: "$100 - $300", description: "Premium products, larger orders" },
        { value: "300+", label: "$300+", description: "Luxury items, bulk purchases" }
      ],
      field: "budget" as keyof QuizData
    },
    {
      title: "How often do you shop internationally?",
      description: "We'll adjust our recommendations accordingly",
      options: [
        { value: "monthly", label: "Monthly", description: "Regular shopper, always looking for deals" },
        { value: "quarterly", label: "Quarterly", description: "Occasional shopper, seasonal purchases" },
        { value: "yearly", label: "Yearly", description: "Rare shopper, special occasions only" },
        { value: "first-time", label: "First time", description: "New to international shopping" }
      ],
      field: "frequency" as keyof QuizData
    }
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quick Setup</h2>
                  <p className="text-sm text-gray-600 mt-2">Step {currentStep} of 3</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  {currentStepData.description}
                </p>

                <div className="space-y-4">
                  {currentStepData.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateQuizData(currentStepData.field, option.value)}
                      className={`w-full p-6 text-left border-2 rounded-2xl transition-all duration-300 ${
                        quizData[currentStepData.field] === option.value
                          ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-lg mb-1">{option.label}</div>
                          <div className="text-gray-600 leading-relaxed">{option.description}</div>
                        </div>
                        {quizData[currentStepData.field] === option.value && (
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-gray-100 flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={!quizData[currentStepData.field]}
                className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  !quizData[currentStepData.field]
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {currentStep === 3 ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Exploring
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Quiz; 