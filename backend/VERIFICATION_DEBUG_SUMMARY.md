# Individual Verification Debugging Summary

## What I've Done

### 1. ✅ Backend Endpoint Testing
- Created unified verification route at `/backend/routes/verification.js`
- Registered route in `server.js` as `/api/verification`
- **TESTED WITH CURL - WORKS PERFECTLY!**
  ```bash
  curl test returned: HTTP 200 OK
  Request ID: 4 successfully created
  ```

### 2. ✅ Enhanced Logging Added

#### Backend (verification.js:142-145)
```javascript
console.log('📝 Received request body:', req.body);
console.log('📝 Received files:', req.files);
console.log('📝 Individual verification request:', { userId, full_name, id_document_type });
```

#### Frontend (IndividualVerificationForm.jsx:60-70)
```javascript
console.log('🔍 FormData contents before submission:');
console.log('  full_name:', formData.full_name);
console.log('  id_document_type:', formData.id_document_type);
// ... etc
```

#### API Client (client.js:139-144)
```javascript
console.log('🔍 [API Client] Sending FormData to', endpoint);
for (let pair of body.entries()) {
  console.log('  🔍', pair[0], ':', pair[1]);
}
```

## Test Results

### ✅ Backend Works (Curl Test)
```
POST /api/verification/individual with curl:
- HTTP 200 OK
- FormData parsed correctly
- req.body contained: { full_name, id_document_type, id_document_number }
- req.files contained: { id_document_front, selfie_with_id }
- Database insertion successful
```

### ❌ Frontend Issue
- When user submits from browser: HTTP 400
- Previous logs showed: `full_name: undefined, id_document_type: undefined`
- This indicates frontend is NOT sending the data correctly

## Next Steps for User

### 1. Clear Browser Cache
```bash
# Hard refresh the browser:
# Chrome/Firefox: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
# Safari: Cmd+Option+E then Cmd+R
```

### 2. Submit Verification Form
1. Go to http://localhost:5173
2. Log in as user cheton@email.com
3. Open browser DevTools (F12) -> Console tab
4. Navigate to Dashboard -> Individual Verification
5. Fill out the form completely:
   - Full name: Test User Name
   - ID document type: Citizenship
   - ID document number: 123-456-789
   - Upload ID front image
   - Upload selfie with ID
6. Click "Submit for Verification"

### 3. Check Logs

#### Browser Console Should Show:
```
🔍 FormData contents before submission:
  full_name: Test User Name
  id_document_type: citizenship
  id_document_number: 123-456-789
  id_document_front: File { ... }
  selfie_with_id: File { ... }
🔍 FormData entries:
  full_name : Test User Name
  id_document_type : citizenship
  ...
🔍 [API Client] Sending FormData to /verification/individual
```

#### Backend Terminal Should Show:
```
🔐 [Middleware/Auth] Token present: true
✅ [Middleware/Auth] Token decoded successfully
📝 Received request body: { full_name: 'Test User Name', ... }
📝 Received files: { id_document_front: [...], selfie_with_id: [...] }
✅ Individual verification request submitted: <ID>
```

## Files Modified

1. `/backend/routes/verification.js` - Added enhanced logging
2. `/frontend/src/components/IndividualVerificationForm.jsx` - Added frontend logging
3. `/frontend/src/api/client.js` - Added API client logging

## Known Good Configuration

### Backend Server
- Running on: http://localhost:5000
- Status: ✅ Running
- Database: ✅ Connected
- Route: `/api/verification/individual` ✅ Working

### Frontend Server
- Running on: http://localhost:5173
- Status: ✅ Running
- API calls: /verification/individual (updated from old endpoint)

## Troubleshooting

If still getting 400 errors:

1. **Check the browser console logs** - They will show exactly what's in the FormData
2. **Check the backend logs** - They will show what the server receives
3. **Compare the two** - This will reveal where the data is lost

If FormData is empty in browser console:
- Issue is with file upload in the form
- Check file input `onChange` handler

If FormData is correct in browser but empty in backend:
- Issue is with the network request
- Check Network tab in DevTools
- Look for the POST request to /api/verification/individual
- Examine the request payload

## Quick Test Command

To verify backend is working:
```bash
cd /Users/elw/Documents/Web/thulobazaar/backend

# Generate test token
TOKEN=$(node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({userId: 30, email: 'cheton@email.com'}, 'thulobazaar_secure_jwt_secret_key_2024_change_in_production', {expiresIn: '1h'}));")

# Create test image
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test_id.png

# Test endpoint
curl -X POST http://localhost:5000/api/verification/individual \
  -H "Authorization: Bearer $TOKEN" \
  -F "full_name=Test User Name" \
  -F "id_document_type=citizenship" \
  -F "id_document_number=123-456-789" \
  -F "id_document_front=@/tmp/test_id.png" \
  -F "selfie_with_id=@/tmp/test_id.png"

# Should return: {"success":true,"message":"Verification request submitted successfully","data":{"requestId":...}}
```
