import React, { useState, useEffect } from 'react';
import { addProduct } from '../services/productService';
import { auth, functions } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { Plus, Upload, User, LogOut, LogIn, Link, Loader, CheckCircle, XCircle, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { validateProductCategory, getCategoryDisplayName, getCategoryDescription } from '../utils/productValidation';

function ProductForm() {
  const [form, setForm] = useState({
    link: '',
    title: '',
    imageUrl: '',
    price: '',
    description: '',
    introducedBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [categoryValidation, setCategoryValidation] = useState(null);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const validateLink = (link) => {
    if (!link.trim()) return t.linkRequired;
    if (!link.startsWith('http')) return t.invalidLink;
    return null;
  };

  const validateProductCategoryAndUpdate = (title, description, link) => {
    const validation = validateProductCategory(title, description, link);
    setCategoryValidation(validation);
    return validation.isValid;
  };

  const extractProductData = async (link) => {
    setExtracting(true);
    try {
      // Call Firebase Function to extract product data
      const extractProduct = httpsCallable(functions, 'extractProduct');
      const result = await extractProduct({ link });
      
      const data = result.data;
      
      setForm(prev => ({
        ...prev,
        title: data.title || '',
        imageUrl: data.imageUrl || '',
        price: data.price || '',
        description: data.description || '',
        link: link
      }));

      // Validate category after extraction
      validateProductCategoryAndUpdate(data.title || '', data.description || '', link);
      setErrors({});
    } catch (error) {
      console.error('상품 정보 추출 실패:', error);
      setErrors({ link: t.extractionFailed });
    } finally {
      setExtracting(false);
    }
  };

  const handleLinkChange = (e) => {
    const link = e.target.value;
    setForm(prev => ({ ...prev, link }));
    
    // Clear error when user starts typing
    if (errors.link) {
      setErrors({ ...errors, link: '' });
    }
    
    // Clear category validation when link changes
    setCategoryValidation(null);
  };

  const handleLinkBlur = async () => {
    const link = form.link.trim();
    if (!link) return;

    const linkError = validateLink(link);
    if (linkError) {
      setErrors({ link: linkError });
      return;
    }

    // Auto-extract product data
    await extractProductData(link);
  };

  const handleFormFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Re-validate category when title or description changes
    if (field === 'title' || field === 'description') {
      const newTitle = field === 'title' ? value : form.title;
      const newDescription = field === 'description' ? value : form.description;
      validateProductCategoryAndUpdate(newTitle, newDescription, form.link);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.link.trim()) {
      setErrors({ link: t.linkRequired });
      return;
    }

    // Final category validation before submission
    if (!validateProductCategoryAndUpdate(form.title, form.description, form.link)) {
      setErrors({ category: t.categoryValidationMessage });
      return;
    }
    
    setLoading(true);
    try {
      console.log('Submitting product with data:', {
        ...form, 
        introducedBy: form.introducedBy || user.displayName || user.email || 'Anonymous',
        price: form.price.toString().replace(/[^0-9]/g, ''), // 숫자만 추출
        category: categoryValidation.category
      });
      
      await addProduct({ 
        ...form, 
        introducedBy: form.introducedBy || user.displayName || user.email || 'Anonymous',
        price: form.price.toString().replace(/[^0-9]/g, ''), // 숫자만 추출
        category: categoryValidation.category
      });
      
      console.log('Product registered successfully');
      setForm({ link: '', title: '', imageUrl: '', price: '', description: '', introducedBy: '' });
      setCategoryValidation(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('상품 등록 실패:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        form: form,
        categoryValidation: categoryValidation
      });
      setErrors({ submit: error.message || t.registrationFailed });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.productRegistration}</h3>
          <p className="text-gray-600">{t.linkOnlyPaste}</p>
        </div>
        <button 
          onClick={handleLogin} 
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
        >
          <LogIn className="w-5 h-5" />
          <span>{t.googleLogin}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t.hello}, {user.displayName || user.email}{t.welcome}</h3>
            <p className="text-sm text-gray-600">{t.linkOnlyPaste}</p>
          </div>
        </div>
        <button 
          type="button" 
          onClick={handleLogout} 
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Category Guidelines */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-2">{t.categoryGuidelines}</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <span className="font-medium">{t.koreanCosmetics}:</span> {t.koreanCosmeticsGuidelines}
              </div>
              <div>
                <span className="font-medium">{t.usItProducts}:</span> {t.usItGuidelines}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Link Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.productLink} * <span className="text-xs text-gray-500">{t.amazonCoupangEtc}</span>
          </label>
          <div className="flex space-x-2">
            <input 
              name="link" 
              value={form.link} 
              onChange={handleLinkChange}
              onBlur={handleLinkBlur}
              placeholder={t.linkPlaceholder}
              className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.link ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {extracting && (
              <div className="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-600 ml-2">{t.extracting}</span>
              </div>
            )}
          </div>
          {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {t.autoExtractInfo}
          </p>
        </div>

        {/* Category Validation Result */}
        {categoryValidation && (
          <div className={`p-3 rounded-lg border ${
            categoryValidation.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {categoryValidation.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                categoryValidation.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {categoryValidation.isValid ? t.categoryDetected : t.categoryNotSupported}
              </span>
            </div>
            <p className={`text-sm mt-1 ${
              categoryValidation.isValid ? 'text-green-700' : 'text-red-700'
            }`}>
              {categoryValidation.message}
            </p>
            {categoryValidation.isValid && (
              <p className="text-xs text-green-600 mt-1">
                {getCategoryDisplayName(categoryValidation.category)} - {getCategoryDescription(categoryValidation.category)}
              </p>
            )}
          </div>
        )}

        {/* Extracted Data Preview */}
        {(form.title || form.price || form.imageUrl) && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">{t.extractedInfo}</h4>
            
            {form.title && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.productName}</label>
                <input 
                  value={form.title} 
                  onChange={(e) => handleFormFieldChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            )}

            {form.price && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.price}</label>
                <input 
                  value={form.price} 
                  onChange={(e) => handleFormFieldChange('price', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            )}

            {form.imageUrl && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.imageUrl}</label>
                <input 
                  value={form.imageUrl} 
                  onChange={(e) => handleFormFieldChange('imageUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t.descriptionOptional}</label>
              <textarea 
                value={form.description} 
                onChange={(e) => handleFormFieldChange('description', e.target.value)}
                placeholder={t.descriptionPlaceholder}
                rows="2"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        )}

        {/* Nickname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.nicknameOptional}</label>
          <input 
            name="introducedBy" 
            value={form.introducedBy} 
            onChange={(e) => setForm(prev => ({ ...prev, introducedBy: e.target.value }))}
            placeholder={t.nicknamePlaceholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{t.nicknameHint}</p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {errors.category && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.category}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !form.link.trim() || (categoryValidation && !categoryValidation.isValid)} 
          className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{t.registering}</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>{t.registerProduct}</span>
            </>
          )}
        </button>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 text-sm">✅ {t.registrationSuccess}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProductForm; 