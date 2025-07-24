import React from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import { Plus, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

function Products() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.shareProducts}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.shareProductsDescription}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Product Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">{t.productRegistration}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t.loginAndShare}</p>
                <ProductForm />
              </div>
            </div>
          </div>

          {/* Main Content - Product List */}
          <div className="lg:col-span-2">
            <ProductList />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.registrationGuide}</h2>
            <p className="text-gray-600">Follow these simple steps to share great deals with the community!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.step1}</h3>
              <p className="text-gray-600 text-sm">{t.step1Description}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.step2}</h3>
              <p className="text-gray-600 text-sm">{t.step2Description}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.step3}</h3>
              <p className="text-gray-600 text-sm">{t.step3Description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products; 