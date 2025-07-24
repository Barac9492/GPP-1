import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { TrendingUp, DollarSign, AlertTriangle, CheckCircle, Clock, Globe, Zap, ArrowRight, Bell } from 'lucide-react';
import priceScraper from '../services/priceScraper';
import notificationService from '../services/notificationService';

const ArbitrageReport = () => {
  const [reports, setReports] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [alertStats, setAlertStats] = useState(null);

  useEffect(() => {
    // Load alert statistics on component mount
    loadAlertStats();
  }, []);

  const loadAlertStats = async () => {
    const stats = await notificationService.getAlertStats();
    setAlertStats(stats);
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Use real price scraping service
      const report = await priceScraper.generateArbitrageReport();
      
      // Send alerts for new opportunities
      const alerts = await notificationService.checkAndSendAlerts(report.opportunities);
      
      // Save to Firebase
      await addDoc(collection(db, 'arbitrage_reports'), {
        ...report,
        timestamp: serverTimestamp(),
        status: 'published',
        alertsSent: alerts.length
      });

      setCurrentReport(report);
      setReports(prev => [report, ...prev]);
      
      // Update alert stats
      await loadAlertStats();
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          AI-Powered Arbitrage Report
        </h2>
        <p className="text-slate-600 mb-6">
          Automated price comparison and arbitrage opportunities
        </p>
        
        {/* Alert Stats */}
        {alertStats && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-600">Alerts sent this week:</span>
                <span className="font-bold text-blue-600">{alertStats.totalAlerts}</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-slate-600">High priority:</span>
                <span className="font-bold text-red-600">{alertStats.highPriority}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">Avg savings:</span>
                <span className="font-bold text-green-600">{alertStats.averageSavings}%</span>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={generateReport}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Generate New Report
            </>
          )}
        </button>
      </div>

      {currentReport && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Latest Arbitrage Report
            </h3>
            <div className="text-sm text-slate-500">
              {currentReport.timestamp.toLocaleDateString()}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{currentReport.summary.totalOpportunities}</div>
              <div className="text-sm text-blue-600">Opportunities</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{currentReport.summary.averageSavings}%</div>
              <div className="text-sm text-green-600">Avg Savings</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{currentReport.summary.highUrgency}</div>
              <div className="text-sm text-red-600">High Priority</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₩{(currentReport.summary.totalPotentialSavings / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-purple-600">Total Savings</div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Market Insights
            </h4>
            <div className="space-y-2">
              {currentReport.marketInsights.map((insight, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-slate-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">
              Top Arbitrage Opportunities
            </h4>
            {currentReport.opportunities.map((opportunity) => (
              <div key={opportunity.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={opportunity.image} 
                      alt={opportunity.product}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(opportunity.urgency)} flex items-center`}>
                          {getUrgencyIcon(opportunity.urgency)}
                          <span className="ml-1 capitalize">{opportunity.urgency}</span>
                        </span>
                        <span className="text-sm text-slate-500">{opportunity.category}</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 mb-1">{opportunity.product}</h5>
                      <p className="text-sm text-slate-600 mb-2">{opportunity.reason}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Korea:</span>
                          <span className="font-medium ml-1">₩{opportunity.koreaPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">US:</span>
                          <span className="font-medium ml-1">₩{opportunity.usPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Shipping:</span>
                          <span className="font-medium ml-1">₩{opportunity.shipping.toLocaleString()}</span>
                        </div>
                        <div className="text-green-600 font-semibold">
                          Save: {opportunity.netSavings}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {opportunity.netSavings}%
                    </div>
                    <div className="text-sm text-slate-500">Net Savings</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous Reports */}
      {reports.length > 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Previous Reports</h3>
          <div className="space-y-3">
            {reports.slice(1).map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-medium text-slate-900">
                    Report #{reports.length - index}
                  </div>
                  <div className="text-sm text-slate-500">
                    {report.timestamp.toLocaleDateString()} • {report.summary.totalOpportunities} opportunities
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentReport(report)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArbitrageReport; 