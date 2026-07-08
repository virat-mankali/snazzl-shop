'use client';

import { useState, useRef } from 'react';
import { X, Upload, Trash2, ChevronDown } from 'lucide-react';
import { useMutation } from 'convex/react';
import { makeFunctionReference } from 'convex/server';
import {
  getProductCategory,
  getProductCategorySection,
  productCategories,
} from '@/lib/productCategories';
import Toast from './Toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FITS = [
  'Slim Fit',
  'Regular Fit',
  'Relaxed Fit',
  'Skinny Fit',
  'Tapered Fit',
  'Oversized Fit',
  'Comfort Fit',
  'Loose Fit',
  'Tailored Fit'
];

interface ImageUpload {
  id: string;
  file: File;
  preview: string;
  label: string;
}

const addProductMutation = makeFunctionReference<"mutation">(
  "products:addProduct"
);
const generateUploadUrlMutation = makeFunctionReference<"mutation">(
  "products:generateUploadUrl"
);

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Failed to add product. Please try again.';
};

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [coverImage, setCoverImage] = useState<{ file: File | null; preview: string | null }>({ 
    file: null, 
    preview: null 
  });
  const [productName, setProductName] = useState('');
  const [colors, setColors] = useState<Array<{ name: string; picker: string }>>([
    { name: '', picker: '#000000' }
  ]);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subSubCategory, setSubSubCategory] = useState('');
  const [fit, setFit] = useState('');
  const [availableSizes, setAvailableSizes] = useState<number[]>([]);
  const [basePrice, setBasePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [material, setMaterial] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [stock, setStock] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showMainCategoryDropdown, setShowMainCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [showSubSubCategoryDropdown, setShowSubSubCategoryDropdown] = useState(false);
  const [showFitDropdown, setShowFitDropdown] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const imageLabels = [
    'Product front side image',
    'Product left side image',
    'Product back side image',
    'Product right side image'
  ];

  const commonSizes = [28, 30, 32, 34, 36, 38, 40, 42];
  const selectedMainCategory = getProductCategory(mainCategory);
  const selectedSubCategory = getProductCategorySection(mainCategory, subCategory);

  const toggleSize = (size: number) => {
    if (availableSizes.includes(size)) {
      setAvailableSizes(availableSizes.filter(s => s !== size));
    } else {
      setAvailableSizes([...availableSizes, size].sort((a, b) => a - b));
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setCoverImage({ file, preview });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && images.length < 4) {
      const newImages: ImageUpload[] = [];
      const remainingSlots = 4 - images.length;
      
      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i];
        newImages.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          label: imageLabels[images.length + i]
        });
      }
      
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const addProduct = useMutation(addProductMutation);
  const generateUploadUrl = useMutation(generateUploadUrlMutation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to resize image to max 2MB
  const resizeImage = async (file: File): Promise<Blob> => {
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    
    // If file is already under 2MB, return it as-is
    if (file.size <= MAX_SIZE) {
      return file;
    }
    
    // Otherwise, compress it to 2MB
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const width = img.width;
          const height = img.height;
          const quality = 0.9;
          
          // Start with original dimensions, will reduce if needed
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Try to compress to under 2MB
          const tryCompress = (q: number, w: number, h: number) => {
            canvas.width = w;
            canvas.height = h;
            const context = canvas.getContext('2d');
            context?.drawImage(img, 0, 0, w, h);
            
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  if (blob.size <= MAX_SIZE || q <= 0.1) {
                    // Under 2MB or minimum quality reached
                    resolve(blob);
                  } else if (q > 0.3) {
                    // Try with lower quality first
                    tryCompress(q - 0.1, w, h);
                  } else {
                    // If quality is already low, reduce dimensions
                    const newWidth = Math.floor(w * 0.9);
                    const newHeight = Math.floor(h * 0.9);
                    tryCompress(0.9, newWidth, newHeight);
                  }
                } else {
                  reject(new Error('Failed to create blob'));
                }
              },
              'image/jpeg',
              q
            );
          };
          
          tryCompress(quality, width, height);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload image to Convex storage
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Resize the image first
      console.log('Resizing image:', file.name);
      const resizedBlob = await resizeImage(file);
      console.log('Image resized, size:', resizedBlob.size);
      
      // Get upload URL from Convex
      console.log('Getting upload URL...');
      const uploadUrl = await generateUploadUrl();
      console.log('Upload URL received:', uploadUrl);
      
      // Upload the resized image
      console.log('Uploading to storage...');
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': resizedBlob.type },
        body: resizedBlob,
      });
      
      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }
      
      const { storageId } = await result.json();
      console.log('Storage ID received:', storageId);
      return storageId;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!productName.trim()) {
      setToast({ message: 'Please enter a product name', type: 'error' });
      return;
    }
    if (colors.length === 0 || !colors[0].name.trim()) {
      setToast({ message: 'Please enter at least one color', type: 'error' });
      return;
    }
    if (!mainCategory.trim() || !subCategory.trim() || !subSubCategory.trim()) {
      setToast({ message: 'Please select main, sub, and sub-sub category', type: 'error' });
      return;
    }
    if (!fit.trim()) {
      setToast({ message: 'Please select a fit type', type: 'error' });
      return;
    }
    if (availableSizes.length === 0) {
      setToast({ message: 'Please select at least one size', type: 'error' });
      return;
    }
    if (!basePrice || parseFloat(basePrice) <= 0) {
      setToast({ message: 'Please enter a valid base price', type: 'error' });
      return;
    }
    if (!material.trim()) {
      setToast({ message: 'Please enter a material', type: 'error' });
      return;
    }
    if (!productDescription.trim()) {
      setToast({ message: 'Please enter a product description', type: 'error' });
      return;
    }
    if (!stock || parseInt(stock) < 0) {
      setToast({ message: 'Please enter a valid stock quantity', type: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress('Starting upload...');
      console.log('Starting product submission...');
      
      // Upload images to Convex storage
      const productImages: {
        cover_image?: string;
        front_image?: string;
        left_image?: string;
        back_image?: string;
        right_image?: string;
      } = {};
      
      const totalImages = (coverImage.file ? 1 : 0) + images.length;
      let uploadedCount = 0;
      
      // Upload cover image
      if (coverImage.file) {
        setUploadProgress(`Uploading cover image... (${uploadedCount + 1}/${totalImages})`);
        console.log('Uploading cover image...');
        productImages.cover_image = await uploadImage(coverImage.file);
        uploadedCount++;
        console.log('Cover image uploaded:', productImages.cover_image);
      }
      
      // Upload additional images
      const imageKeys = ['front_image', 'left_image', 'back_image', 'right_image'] as const;
      for (let i = 0; i < images.length; i++) {
        if (images[i].file) {
          setUploadProgress(`Uploading ${imageLabels[i]}... (${uploadedCount + 1}/${totalImages})`);
          console.log(`Uploading ${imageKeys[i]}...`);
          productImages[imageKeys[i]] = await uploadImage(images[i].file);
          uploadedCount++;
          console.log(`${imageKeys[i]} uploaded:`, productImages[imageKeys[i]]);
        }
      }

      const productData = {
        product_name: productName,
        colors: colors.filter(c => c.name.trim()),
        category: {
          main_category: mainCategory,
          sub_category: subCategory,
          sub_sub_category: subSubCategory
        },
        size: {
          fit: fit,
          available_sizes: availableSizes
        },
        price: {
          base_price: parseFloat(basePrice),
          discount: parseFloat(discount) || 0
        },
        material: material,
        product_description: productDescription,
        stock: parseInt(stock),
        product_images: productImages,
      };
      
      setUploadProgress('Saving product details...');
      console.log('Submitting product data:', productData);
      const result = await addProduct(productData);
      console.log('Product added successfully:', result);
      setUploadProgress('Product added successfully!');
      
      // Reset form
      setProductName('');
      setColors([{ name: '', picker: '#000000' }]);
      setMainCategory('');
      setSubCategory('');
      setSubSubCategory('');
      setFit('');
      setAvailableSizes([]);
      setBasePrice('');
      setDiscount('');
      setMaterial('');
      setProductDescription('');
      setStock('');
      setCoverImage({ file: null, preview: null });
      setImages([]);
      
      setToast({ message: 'Product added successfully!', type: 'success' });
      onSuccess?.();
      setTimeout(() => {
        onClose();
        setUploadProgress('');
      }, 1500);
    } catch (error: unknown) {
      console.error('Error adding product:', error);
      setToast({ message: getErrorMessage(error), type: 'error' });
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-50 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold text-black">Add Products</h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#171719] text-white rounded-lg hover:bg-[#2A2A2D] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
          {/* Progress Indicator */}
          {uploadProgress && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-[#171719] h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <span className="text-sm text-slate-500 whitespace-nowrap">{uploadProgress}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Image Upload */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-4">Upload Image</h3>
              
              {/* Cover Image Upload */}
              <div 
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-lg p-8 mb-4 cursor-pointer hover:border-[#D4A373] transition-colors bg-slate-50"
              >
                {coverImage.preview ? (
                  <div className="relative">
                    <img src={coverImage.preview} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#F8EEE8] rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="text-[#171719]" size={24} />
                    </div>
                    <p className="text-[#171719] font-medium mb-1">Upload Image</p>
                    <p className="text-xs text-slate-500">Upload a cover image for your product.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      File Format <span className="text-black">jpeg, png</span> Recommended Size{' '}
                      <span className="text-black">600x600 (1:1)</span>
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleCoverImageUpload}
                className="hidden"
              />

              {/* Additional Images */}
              <div className="space-y-3">
                {images.map((image) => (
                  <div key={image.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-[#F8EEE8] rounded flex items-center justify-center flex-shrink-0">
                      <Upload className="text-[#171719]" size={18} />
                    </div>
                    <span className="text-sm text-black flex-1">{image.label}</span>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="text-slate-400 hover:text-[#C86565]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                
                {images.length < 4 && (
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100"
                  >
                    <div className="w-10 h-10 bg-[#F8EEE8] rounded flex items-center justify-center flex-shrink-0">
                      <Upload className="text-[#171719]" size={18} />
                    </div>
                    <span className="text-sm text-slate-500 flex-1">
                      {imageLabels[images.length]}
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Right Columns - Form Fields */}
            <div className="col-span-2 space-y-6">
              {/* Row 1 - Product Name */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Slim Fit Denim Jeans"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black placeholder:text-slate-400"
                />
              </div>

              {/* Row 2 - Colors */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Colors</label>
                <div className="space-y-3">
                  {colors.map((color, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[index].name = e.target.value;
                          setColors(newColors);
                        }}
                        placeholder="Dark Blue"
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black placeholder:text-slate-400"
                      />
                      <input
                        type="color"
                        value={color.picker}
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[index].picker = e.target.value;
                          setColors(newColors);
                        }}
                        className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color.picker}
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[index].picker = e.target.value;
                          setColors(newColors);
                        }}
                        placeholder="#00008B"
                        className="w-28 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black placeholder:text-slate-400"
                      />
                      {colors.length > 1 && (
                        <button
                          onClick={() => setColors(colors.filter((_, i) => i !== index))}
                          className="p-2 text-[#C86565] hover:bg-[#F7E4E4] rounded-lg"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setColors([...colors, { name: '', picker: '#000000' }])}
                    className="flex items-center gap-2 px-4 py-2 text-[#171719] hover:bg-[#F8EEE8] rounded-lg font-medium text-sm"
                  >
                    <span className="text-lg">+</span>
                    <span>Add Color</span>
                  </button>
                </div>
              </div>

              {/* Row 3 - Category */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="relative">
                  <label className="block text-sm font-medium text-black mb-2">Main Category</label>
                  <button
                    type="button"
                    onClick={() => setShowMainCategoryDropdown(!showMainCategoryDropdown)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black text-left flex items-center justify-between"
                  >
                    <span className={mainCategory || 'text-slate-400'}>{mainCategory || 'Select category'}</span>
                    <ChevronDown size={18} />
                  </button>
                  {showMainCategoryDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {productCategories.map((category) => (
                        <button
                          key={category.label}
                          type="button"
                          onClick={() => {
                            setMainCategory(category.label);
                            setSubCategory('');
                            setSubSubCategory('');
                            setShowMainCategoryDropdown(false);
                            setShowSubCategoryDropdown(false);
                            setShowSubSubCategoryDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-100 text-black"
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-black mb-2">Sub Category</label>
                  <button
                    type="button"
                    onClick={() => setShowSubCategoryDropdown(!showSubCategoryDropdown)}
                    disabled={!mainCategory}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={subCategory || 'text-slate-400'}>{subCategory || 'Select sub category'}</span>
                    <ChevronDown size={18} />
                  </button>
                  {showSubCategoryDropdown && mainCategory && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {selectedMainCategory?.sections.map((section) => (
                        <button
                          key={section.title}
                          type="button"
                          onClick={() => {
                            setSubCategory(section.title);
                            setSubSubCategory('');
                            setShowSubCategoryDropdown(false);
                            setShowSubSubCategoryDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-100 text-black"
                        >
                          {section.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-black mb-2">Sub-sub Category</label>
                  <button
                    type="button"
                    onClick={() => setShowSubSubCategoryDropdown(!showSubSubCategoryDropdown)}
                    disabled={!subCategory}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={subSubCategory || 'text-slate-400'}>{subSubCategory || 'Select sub-sub category'}</span>
                    <ChevronDown size={18} />
                  </button>
                  {showSubSubCategoryDropdown && subCategory && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {selectedSubCategory?.items.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setSubSubCategory(item);
                            setShowSubSubCategoryDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-100 text-black"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 4 - Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-black mb-2">Fit</label>
                  <button
                    type="button"
                    onClick={() => setShowFitDropdown(!showFitDropdown)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black text-left flex items-center justify-between"
                  >
                    <span className={fit || 'text-slate-400'}>{fit || 'Select fit'}</span>
                    <ChevronDown size={18} />
                  </button>
                  {showFitDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {FITS.map((fitOption) => (
                        <button
                          key={fitOption}
                          type="button"
                          onClick={() => {
                            setFit(fitOption);
                            setShowFitDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-100 text-black"
                        >
                          {fitOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {commonSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          availableSizes.includes(size)
                            ? 'bg-[#171719] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5 - Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Base Price (₹)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="1999"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Discount (%)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="15"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Row 6 - Material & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Denim"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="100"
                    min="0"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Row 7 - Product Description */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Product Description</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Classic dark blue slim fit jeans made from stretchable denim fabric."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3E7D7] text-black placeholder:text-slate-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
