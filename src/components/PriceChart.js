import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react';

const PriceChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Sample price data for iPhone 16
  const priceData = [
    { date: 'Jan 1', usPrice: 999, krPrice: 1200000, usTrend: 'stable', krTrend: 'down' },
    { date: 'Jan 15', usPrice: 999, krPrice: 1180000, usTrend: 'stable', krTrend: 'down' },
    { date: 'Feb 1', usPrice: 949, krPrice: 1150000, usTrend: 'down', krTrend: 'down' },
    { date: 'Feb 15', usPrice: 949, krPrice: 1120000, usTrend: 'stable', krTrend: 'down' },
    { date: 'Mar 1', usPrice: 899, krPrice: 1100000, usTrend: 'down', krTrend: 'down' },
    { date: 'Mar 15', usPrice: 899, krPrice: 1080000, usTrend: 'stable', krTrend: 'down' },
    { date: 'Apr 1', usPrice: 849, krPrice: 1050000, usTrend: 'down', krTrend: 'down' },
    { date: 'Apr 15', usPrice: 849, krPrice: 1020000, usTrend: 'stable', krTrend: 'down' },
    { date: 'May 1', usPrice: 799, krPrice: 1000000, usTrend: 'down', krTrend: 'down' },
  ];

  const maxPrice = Math.max(...priceData.map(d => Math.max(d.usPrice, d.krPrice / 1000)));
  const minPrice = Math.min(...priceData.map(d => Math.min(d.usPrice, d.krPrice / 1000)));

  const getYPosition = (price, isKR = false) => {
    const adjustedPrice = isKR ? price / 1000 : price;
    return 100 - ((adjustedPrice - minPrice) / (maxPrice - minPrice)) * 80;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-emerald-500" />;
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>;
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">iPhone 16 Price History</h3>
          <p className="text-slate-600">Track prices across global markets</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-slate-600">US Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Korea Price</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
        {/* Grid Lines */}
        <div className="absolute inset-6">
          {[0, 25, 50, 75, 100].map((line) => (
            <div
              key={line}
              className="absolute w-full border-t border-slate-200"
              style={{ top: `${line}%` }}
            ></div>
          ))}
        </div>

        {/* Price Lines */}
        <svg className="absolute inset-6 w-full h-full" viewBox="0 0 100 100">
          {/* US Price Line */}
          <polyline
            points={priceData.map((d, i) => `${(i / (priceData.length - 1)) * 100},${getYPosition(d.usPrice)}`).join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Korea Price Line */}
          <polyline
            points={priceData.map((d, i) => `${(i / (priceData.length - 1)) * 100},${getYPosition(d.krPrice, true)}`).join(' ')}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {priceData.map((d, i) => {
            const x = (i / (priceData.length - 1)) * 100;
            const yUS = getYPosition(d.usPrice);
            const yKR = getYPosition(d.krPrice, true);
            
            return (
              <g key={i}>
                {/* US Point */}
                <circle
                  cx={x}
                  cy={yUS}
                  r="2"
                  fill="#3B82F6"
                  className="cursor-pointer hover:r-3 transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint({ ...d, x, y: yUS, type: 'US', index: i })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                
                {/* Korea Point */}
                <circle
                  cx={x}
                  cy={yKR}
                  r="2"
                  fill="#10B981"
                  className="cursor-pointer hover:r-3 transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint({ ...d, x, y: yKR, type: 'KR', index: i })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-10"
            style={{
              left: `${hoveredPoint.x}%`,
              top: `${hoveredPoint.y}%`,
              transform: 'translate(-50%, -100%) translateY(-10px)',
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${hoveredPoint.type === 'US' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
              <span className="font-semibold text-slate-900">
                {hoveredPoint.type === 'US' ? 'US Price' : 'Korea Price'}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {hoveredPoint.type === 'US' 
                ? `$${hoveredPoint.usPrice}` 
                : `₩${hoveredPoint.krPrice.toLocaleString()}`
              }
            </div>
            <div className="text-sm text-slate-500">{hoveredPoint.date}</div>
            <div className="flex items-center space-x-1 mt-2">
              {getTrendIcon(hoveredPoint.type === 'US' ? hoveredPoint.usTrend : hoveredPoint.krTrend)}
              <span className="text-xs text-slate-500">
                {hoveredPoint.type === 'US' ? hoveredPoint.usTrend : hoveredPoint.krTrend}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Price Alerts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-900">Price Drop Alert</span>
          </div>
          <p className="text-sm text-emerald-700">
            iPhone 16 price dropped 20% in Korea. Best time to buy!
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Savings Opportunity</span>
          </div>
          <p className="text-sm text-blue-700">
            Save $200 by buying from Korea instead of US
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 transform hover:scale-105">
          Set Price Alert
        </button>
        <button className="flex-1 border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
          View All Deals
        </button>
      </div>
    </div>
  );
};

export default PriceChart; 