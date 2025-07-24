# Global Price Pulse - Local Testing Guide

## 🎯 Current Status

✅ **React App**: Running on http://localhost:3000  
✅ **Firebase Emulator UI**: Running on http://localhost:4000  
✅ **Firestore Emulator**: Running on http://localhost:8080  
⚠️ **Functions Emulator**: Running but needs configuration  

## 🚀 How to Test

### 1. **Open the Application**
```bash
# Open in your browser
open http://localhost:3000
```

### 2. **Complete the 5-Step Quiz**
1. **Step 1**: Enter an item (e.g., "AirPods Pro", "MacBook Air", "Tokyo flight")
2. **Step 2**: Select a category (Electronics, Travel, Fashion, etc.)
3. **Step 3**: Enter your budget in USD
4. **Step 4**: Choose your preferred region
5. **Step 5**: Enter your email (optional)

### 3. **Test the Dashboard**
- View matched deals
- Click "View Deal" buttons (affiliate links)
- Test sharing functionality
- Verify responsive design on mobile

### 4. **Monitor Firebase Emulators**
```bash
# Open Firebase Emulator UI
open http://localhost:4000
```

**Check these collections in Firestore:**
- `quizzes` - Quiz submissions
- `deals` - Mock deal data
- `analytics` - User interactions
- `users` - User preferences

## 🧪 Testing Scenarios

### **Scenario 1: Basic Quiz Flow**
1. Open http://localhost:3000
2. Enter "AirPods Pro" as item
3. Select "Electronics" category
4. Enter budget: $300
5. Select "Japan" region
6. Submit quiz
7. Verify deals appear in dashboard

### **Scenario 2: Mobile Testing**
1. Open browser dev tools
2. Switch to mobile view (iPhone/Android)
3. Complete quiz on mobile
4. Test touch interactions
5. Verify responsive design

### **Scenario 3: Analytics Testing**
1. Complete multiple quizzes
2. Check Firebase Emulator UI
3. Verify analytics events are tracked
4. Test affiliate link clicks

### **Scenario 4: Error Handling**
1. Try submitting quiz without required fields
2. Test network error scenarios
3. Verify graceful error handling

## 📊 Expected Results

### **Quiz Submission**
- Quiz data should appear in Firestore `quizzes` collection
- Status should be "processing" then "completed"
- Matched deals should be populated

### **Deal Matching**
- Should return 3-10 deals based on criteria
- Deals should be within budget
- Relevance scores should be calculated

### **Analytics**
- Quiz completion events
- Deal click events
- Share events
- Error events

## 🔧 Troubleshooting

### **React App Not Loading**
```bash
# Check if React server is running
ps aux | grep react-scripts

# Restart React server
npm start
```

### **Firebase Emulators Not Working**
```bash
# Check Java installation
java -version

# Restart emulators
firebase emulators:start --only firestore,functions,hosting
```

### **Port Conflicts**
```bash
# Check what's using port 5000
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

## 📱 Mobile Testing

### **iOS Simulator**
```bash
# Open iOS Simulator
open -a Simulator

# Navigate to http://localhost:3000
```

### **Android Emulator**
```bash
# Open Android Studio
# Launch AVD Manager
# Start emulator
# Navigate to http://localhost:3000
```

## 🎯 Performance Testing

### **Load Time**
- Initial page load: < 2 seconds
- Quiz transitions: < 500ms
- Deal matching: < 1 second

### **Memory Usage**
- Monitor browser dev tools
- Check for memory leaks
- Verify cleanup on component unmount

## 🔍 Debugging

### **React DevTools**
1. Install React Developer Tools browser extension
2. Open browser dev tools
3. Check component state and props
4. Monitor re-renders

### **Firebase Emulator Debugging**
1. Open http://localhost:4000
2. Check Firestore data
3. Monitor Functions logs
4. Verify security rules

### **Network Tab**
1. Open browser dev tools
2. Go to Network tab
3. Complete quiz
4. Check API calls and responses

## 📝 Test Checklist

- [ ] **Quiz Flow**
  - [ ] All 5 steps work correctly
  - [ ] Validation prevents invalid submissions
  - [ ] Progress bar updates properly
  - [ ] Back/Next navigation works

- [ ] **Dashboard**
  - [ ] Deals display correctly
  - [ ] Affiliate links work
  - [ ] Sharing functionality works
  - [ ] Responsive design on mobile

- [ ] **Firebase Integration**
  - [ ] Quiz data saved to Firestore
  - [ ] Analytics events tracked
  - [ ] Functions trigger correctly
  - [ ] Security rules enforced

- [ ] **Error Handling**
  - [ ] Network errors handled gracefully
  - [ ] Invalid input shows proper errors
  - [ ] Loading states display correctly
  - [ ] Error boundaries catch crashes

- [ ] **Performance**
  - [ ] Page loads quickly
  - [ ] Smooth animations
  - [ ] No memory leaks
  - [ ] Efficient re-renders

## 🚀 Next Steps After Testing

1. **Fix any issues** found during testing
2. **Optimize performance** if needed
3. **Add more test cases** for edge scenarios
4. **Prepare for production deployment**
5. **Set up monitoring and analytics**

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Review Firebase Emulator logs
3. Verify environment variables
4. Restart servers if needed

---

**Happy Testing! 🎉**

The Global Price Pulse app is now ready for comprehensive local testing. Follow this guide to ensure everything works perfectly before deployment. 