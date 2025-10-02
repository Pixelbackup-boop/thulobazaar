# Authentication Temporarily Disabled for Development

⚠️ **WARNING: All authentication middleware has been disabled for development purposes.**

## Files Modified:

1. `/routes/profile.js` - Commented out `authenticateToken`, added mock user middleware
2. `/routes/admin.js` - Commented out `authenticateToken` and `requireEditor`, added mock editor middleware
3. `/routes/editor.js` - Commented out `authenticateToken` and `requireEditor`, added mock editor middleware
4. `/routes/authRoutes.js` - Commented out `authenticateToken` on protected routes
5. `/routes/categoryRoutes.js` - Commented out `authenticateToken` and `requireAdmin`
6. `/routes/locationRoutes.js` - Commented out `authenticateToken` and `requireAdmin`
7. `/routes/adRoutes.js` - Need to disable `authenticateToken` and `requireAdmin`
8. `/routes/business.js` - Need to disable `authenticateToken` and `requireEditor`

## How to Re-enable Security:

1. Search for `TEMPORARILY DISABLED FOR DEVELOPMENT` comments
2. Uncomment the `router.use(authenticateToken)` lines
3. Uncomment individual middleware like `requireEditor`, `requireAdmin`, etc.
4. Remove or comment out the mock middleware blocks
5. Search for `/* authenticateToken */` and restore the middleware

## Mock Users Created:

- Regular routes: `{ userId: 1 }`
- Admin/Editor routes: `{ userId: 1, role: 'editor' }`

**DO NOT DEPLOY TO PRODUCTION WITH THESE CHANGES!**
