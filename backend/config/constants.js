/**
 * Application Constants
 * Centralized configuration for all magic strings and numbers
 */

/**
 * Ad Status Enum
 */
const AD_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

/**
 * User Roles Enum
 */
const USER_ROLES = {
  USER: 'user',
  EDITOR: 'editor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

/**
 * Business Verification Status Enum
 */
const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

/**
 * Pagination Defaults
 */
const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  MAX_LIMIT: 100
};

/**
 * File Upload Limits
 */
const FILE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  MAX_FILES_PER_AD: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
};

/**
 * Security Constants
 */
const SECURITY = {
  BCRYPT_SALT_ROUNDS: 12,
  JWT_EXPIRES_IN: '24h',
  PASSWORD_MIN_LENGTH: 8
};

/**
 * Location/Search Defaults
 */
const LOCATION = {
  DEFAULT_RADIUS_KM: 25,
  MAX_RADIUS_KM: 100
};

/**
 * Cache Settings
 */
const CACHE = {
  SEARCH_RESULTS_TTL: 300, // 5 minutes in seconds
  CATEGORIES_TTL: 3600,    // 1 hour in seconds
  LOCATIONS_TTL: 3600      // 1 hour in seconds
};

/**
 * Rate Limiting
 */
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
};

/**
 * Ad Condition Enum
 */
const AD_CONDITION = {
  NEW: 'new',
  USED: 'used',
  REFURBISHED: 'refurbished'
};

/**
 * Promotion Types
 */
const PROMOTION_TYPES = {
  BUMP: 'bump',
  FEATURED: 'featured',
  URGENT: 'urgent',
  STICKY: 'sticky'
};

/**
 * Time Intervals
 */
const TIME_INTERVALS = {
  LAST_24H: '24 hours',
  LAST_7_DAYS: '7 days',
  LAST_30_DAYS: '30 days'
};

/**
 * Database Query Limits
 */
const DB_LIMITS = {
  CONNECTION_TIMEOUT: 5000,     // 5 seconds
  STATEMENT_TIMEOUT: 30000,     // 30 seconds
  POOL_MIN: 5,
  POOL_MAX: 20
};

/**
 * HTTP Status Codes (for reference)
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * Error Messages
 */
const ERROR_MESSAGES = {
  AD_NOT_FOUND: 'Ad not found',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  VALIDATION_FAILED: 'Validation failed',
  DUPLICATE_ENTRY: 'Duplicate entry',
  SERVER_ERROR: 'Internal server error'
};

module.exports = {
  AD_STATUS,
  USER_ROLES,
  VERIFICATION_STATUS,
  PAGINATION,
  FILE_LIMITS,
  SECURITY,
  LOCATION,
  CACHE,
  RATE_LIMIT,
  AD_CONDITION,
  PROMOTION_TYPES,
  TIME_INTERVALS,
  DB_LIMITS,
  HTTP_STATUS,
  ERROR_MESSAGES
};
