'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { apiClient } from '@/lib/api';

interface FormData {
  businessName: string;
  businessCategory: string;
  businessDescription: string;
  businessWebsite: string;
  businessPhone: string;
  businessAddress: string;
  licenseFile: File | null;
}

interface BusinessVerificationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BusinessVerificationForm({
  onSuccess,
  onCancel,
}: BusinessVerificationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessCategory: '',
    businessDescription: '',
    businessWebsite: '',
    businessPhone: '',
    businessAddress: '',
    licenseFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Handle file input changes with preview
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: file }));
      setError(null);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  // Clear file selection
  const clearFile = () => {
    setFormData((prev) => ({ ...prev, licenseFile: null }));
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.businessName.trim()) {
      setError('Please enter your business name');
      return;
    }

    if (!formData.licenseFile) {
      setError('Please upload your business license document');
      return;
    }

    try {
      setLoading(true);

      // Create FormData with snake_case field names that match backend expectations
      const submitData = new FormData();
      submitData.append('business_name', formData.businessName.trim());
      submitData.append('business_license_document', formData.licenseFile);

      if (formData.businessCategory.trim()) {
        submitData.append('business_category', formData.businessCategory.trim());
      }

      if (formData.businessDescription.trim()) {
        submitData.append('business_description', formData.businessDescription.trim());
      }

      if (formData.businessWebsite.trim()) {
        submitData.append('business_website', formData.businessWebsite.trim());
      }

      if (formData.businessPhone.trim()) {
        submitData.append('business_phone', formData.businessPhone.trim());
      }

      if (formData.businessAddress.trim()) {
        submitData.append('business_address', formData.businessAddress.trim());
      }

      // Submit via API client
      await apiClient.submitBusinessVerification(submitData);

      // Success!
      alert('✅ Business verification request submitted successfully! Your application is under review.');
      onSuccess();
    } catch (err: any) {
      console.error('❌ Business verification submission error:', err);
      // Extract the error message from the backend response
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to submit verification request';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto relative">
        {/* Close button */}
        <button
          onClick={onCancel}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Business Verification
          </h2>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
              {error}
            </div>
          )}

          {/* Business Name */}
          <div className="mb-6">
            <label
              htmlFor="businessName"
              className="block mb-2 font-semibold text-gray-900"
            >
              Business Name *
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Enter your registered business name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Business Category */}
          <div className="mb-6">
            <label
              htmlFor="businessCategory"
              className="block mb-2 font-semibold text-gray-900"
            >
              Business Category
            </label>
            <input
              type="text"
              id="businessCategory"
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleInputChange}
              placeholder="e.g., Electronics, Clothing, Food & Beverage"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Business Description */}
          <div className="mb-6">
            <label
              htmlFor="businessDescription"
              className="block mb-2 font-semibold text-gray-900"
            >
              Business Description
            </label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleInputChange}
              placeholder="Brief description of your business"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Business Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="businessPhone"
                className="block mb-2 font-semibold text-gray-900"
              >
                Business Phone
              </label>
              <input
                type="tel"
                id="businessPhone"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleInputChange}
                placeholder="+977-..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="businessWebsite"
                className="block mb-2 font-semibold text-gray-900"
              >
                Business Website
              </label>
              <input
                type="url"
                id="businessWebsite"
                name="businessWebsite"
                value={formData.businessWebsite}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Business Address */}
          <div className="mb-6">
            <label
              htmlFor="businessAddress"
              className="block mb-2 font-semibold text-gray-900"
            >
              Business Address
            </label>
            <textarea
              id="businessAddress"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleInputChange}
              placeholder="Full business address"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Business License Document */}
          <div className="mb-6">
            <label
              htmlFor="licenseFile"
              className="block mb-2 font-semibold text-gray-900"
            >
              Business License/Registration Document *
            </label>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              {!formData.licenseFile ? (
                <>
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <label
                    htmlFor="licenseFile"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="licenseFile"
                    name="licenseFile"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG, or PDF (Max 5MB)
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Image Preview */}
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="License preview"
                        className="max-h-64 rounded-lg border border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{formData.licenseFile.name}</p>
                        <p className="text-sm text-gray-500">{(formData.licenseFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  )}

                  {/* File Info and Actions */}
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-sm font-medium text-green-600">
                      ✓ File selected: {formData.licenseFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Change File Button */}
                  <label
                    htmlFor="licenseFile"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Change File
                  </label>
                  <input
                    type="file"
                    id="licenseFile"
                    name="licenseFile"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              📄 Acceptable formats: Images (PNG, JPG) or PDF documents
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <strong className="text-blue-900">📝 Verification Requirements:</strong>
            <ul className="text-blue-900 text-sm mt-2 ml-5 list-disc">
              <li>Business name must match your registration document</li>
              <li>Upload a clear copy of your business license/registration</li>
              <li>Provide accurate contact information</li>
              <li>Review usually takes 1-2 business days</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
