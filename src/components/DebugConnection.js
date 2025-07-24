import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';

const DebugConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizData, setQuizData] = useState(null);

  // Mock data for testing when Firebase is not available
  const mockQuizzes = [
    {
      id: 'test-quiz-1',
      item: 'AirPods Pro',
      budget: 300,
      region: 'US',
      category: 'Electronics',
      email: 'test@example.com',
      matchedDeals: [
        {
          id: 'deal-1',
          item: 'AirPods Pro',
          platform: 'Amazon',
          region: 'US',
          price: 240,
          originalPrice: 330,
          affiliateLink: 'https://amazon.com/dp/B0C1234567',
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
          relevanceScore: 95,
          savings: 90,
          category: 'Electronics'
        },
        {
          id: 'deal-2',
          item: 'AirPods Pro',
          platform: 'Best Buy',
          region: 'US',
          price: 255,
          originalPrice: 315,
          affiliateLink: 'https://bestbuy.com/site/product/123456',
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
          relevanceScore: 88,
          savings: 60,
          category: 'Electronics'
        }
      ]
    },
    {
      id: 'test-quiz-2',
      item: 'iPhone 15 Pro',
      budget: 1000,
      region: 'Japan',
      category: 'Electronics',
      email: 'user2@example.com',
      matchedDeals: [
        {
          id: 'deal-3',
          item: 'iPhone 15 Pro',
          platform: 'Rakuten',
          region: 'Japan',
          price: 700,
          originalPrice: 1200,
          affiliateLink: 'https://rakuten.co.jp/item/123456',
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
          relevanceScore: 92,
          savings: 500,
          category: 'Electronics'
        }
      ]
    }
  ];

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing connection...');
      
      // Try Firebase connection first
      try {
        const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
        
        if (quizzesSnapshot.empty) {
          setConnectionStatus('❌ No quizzes found in Firebase');
          // Fall back to mock data
          setQuizzes(mockQuizzes);
          setConnectionStatus('✅ Using mock data (Firebase not available)');
          return;
        }
        
        const quizzesData = [];
        quizzesSnapshot.forEach((doc) => {
          const data = doc.data();
          quizzesData.push({
            id: doc.id,
            ...data
          });
        });
        
        setQuizzes(quizzesData);
        setConnectionStatus(`✅ Connected to Firebase! Found ${quizzesData.length} quizzes`);
        
      } catch (firebaseError) {
        console.log('Firebase connection failed, using mock data:', firebaseError.message);
        setQuizzes(mockQuizzes);
        setConnectionStatus('✅ Using mock data (Firebase connection failed)');
      }
      
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus(`❌ Connection failed: ${error.message}`);
      // Fall back to mock data
      setQuizzes(mockQuizzes);
    }
  };

  const addTestData = async () => {
    try {
      setConnectionStatus('Adding test data...');
      
      const testQuiz = {
        item: 'AirPods Pro',
        budget: 300,
        region: 'US',
        category: 'Electronics',
        email: 'test@example.com',
        userId: 'anonymous',
        createdAt: new Date(),
        matchedDeals: [
          {
            id: 'deal-1',
            item: 'AirPods Pro',
            platform: 'Amazon',
            region: 'US',
            price: 240,
            originalPrice: 330,
            affiliateLink: 'https://amazon.com/dp/B0C1234567',
            imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
            relevanceScore: 95,
            savings: 90,
            category: 'Electronics'
          },
          {
            id: 'deal-2',
            item: 'AirPods Pro',
            platform: 'Best Buy',
            region: 'US',
            price: 255,
            originalPrice: 315,
            affiliateLink: 'https://bestbuy.com/site/product/123456',
            imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
            relevanceScore: 88,
            savings: 60,
            category: 'Electronics'
          }
        ]
      };

      const docRef = await addDoc(collection(db, 'quizzes'), testQuiz);
      console.log('✅ Added test data with ID:', docRef.id);
      
      setConnectionStatus(`✅ Test data added! ID: ${docRef.id}`);
      
      // Refresh the quiz list
      testConnection();
      
    } catch (error) {
      console.error('Error adding test data:', error);
      setConnectionStatus(`❌ Failed to add test data: ${error.message}`);
    }
  };

  const loadQuizData = async (quizId) => {
    try {
      // Try Firebase first
      try {
        const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
        if (quizDoc.exists()) {
          setQuizData(quizDoc.data());
          return;
        }
      } catch (firebaseError) {
        console.log('Firebase load failed, using mock data');
      }
      
      // Fall back to mock data
      const mockQuiz = mockQuizzes.find(q => q.id === quizId);
      if (mockQuiz) {
        setQuizData(mockQuiz);
      } else {
        setQuizData(null);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setQuizData(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Firebase Connection Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <p className="text-sm">{connectionStatus}</p>
      </div>

      <div className="mb-6">
        <button
          onClick={addTestData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
        >
          Add Test Data to Firebase
        </button>
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Connection Again
        </button>
      </div>

      {quizzes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Available Quizzes</h2>
          <div className="space-y-2">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="border p-3 rounded">
                <p><strong>ID:</strong> {quiz.id}</p>
                <p><strong>Item:</strong> {quiz.item}</p>
                <p><strong>Budget:</strong> ${quiz.budget}</p>
                <p><strong>Region:</strong> {quiz.region}</p>
                <p><strong>Deals:</strong> {quiz.matchedDeals?.length || 0}</p>
                <button
                  onClick={() => {
                    setSelectedQuizId(quiz.id);
                    loadQuizData(quiz.id);
                  }}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Load This Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {quizData && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Selected Quiz Data</h2>
          <div className="border p-4 rounded">
            <p><strong>ID:</strong> {selectedQuizId}</p>
            <p><strong>Item:</strong> {quizData.item}</p>
            <p><strong>Budget:</strong> ${quizData.budget}</p>
            <p><strong>Region:</strong> {quizData.region}</p>
            <p><strong>Category:</strong> {quizData.category}</p>
            <p><strong>Email:</strong> {quizData.email || 'None'}</p>
            
            {quizData.matchedDeals && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Deals ({quizData.matchedDeals.length})</h3>
                <div className="space-y-2">
                  {quizData.matchedDeals.map((deal, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-3">
                      <p><strong>{deal.platform}</strong> ({deal.region})</p>
                      <p>Price: ${deal.price} (was ${deal.originalPrice})</p>
                      <p>Save: ${deal.savings}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugConnection; 