import React, { useState, useEffect } from 'react';
import { Search, Upload, Download, Heart, Share2, Home, Grid3x3, Plus, Menu, X, Zap, Users, TrendingUp, ChevronRight, LogOut, User } from 'lucide-react';

export default function StockPlatform() {
  const [images, setImages] = useState([
    { id: 1, title: 'Beautiful Sunset', tags: ['sunset', 'nature', 'beach'], uploader: 'John Doe', image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=500&h=500&fit=crop', downloads: 2500, likes: 340, keywords: 'sunset beach nature orange sky' },
    { id: 2, title: 'Mountain Landscape', tags: ['mountain', 'nature', 'landscape'], uploader: 'Jane Smith', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', downloads: 3200, likes: 450, keywords: 'mountain peak snow landscape nature' },
    { id: 3, title: 'Urban City', tags: ['city', 'urban', 'building'], uploader: 'Mike Johnson', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=500&fit=crop', downloads: 1800, likes: 280, keywords: 'city urban building skyline night' },
    { id: 4, title: 'Forest Path', tags: ['forest', 'nature', 'green'], uploader: 'Sarah Wilson', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop', downloads: 2100, likes: 390, keywords: 'forest path nature green trees' },
    { id: 5, title: 'Ocean Waves', tags: ['ocean', 'water', 'beach'], uploader: 'Tom Brown', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=500&fit=crop', downloads: 2800, likes: 520, keywords: 'ocean waves water beach sea' },
    { id: 6, title: 'Desert Sand', tags: ['desert', 'sand', 'landscape'], uploader: 'Emma Davis', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', downloads: 1500, likes: 220, keywords: 'desert sand dunes landscape nature' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', tags: '', description: '' });
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' });
  const [users, setUsers] = useState([
    { id: 1, email: 'test@example.com', password: 'password123', name: 'Test User', verified: true }
  ]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const filteredImages = images.filter(img =>
    img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    img.keywords.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Login Handler
  const handleLogin = () => {
    const user = users.find(u => u.email === authData.email && u.password === authData.password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setAuthData({ email: '', password: '', name: '' });
      setShowAuthModal(false);
      alert('✅ Login Successful!');
    } else {
      alert('❌ Invalid email or password');
    }
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Signup Handler
  const handleSignup = () => {
    if (!authData.email || !authData.password || !authData.name) {
      alert('❌ Please fill all fields');
      return;
    }

    if (!isValidEmail(authData.email)) {
      alert('❌ Please enter a valid email address');
      return;
    }
    
    if (authData.password.length < 6) {
      alert('❌ Password must be at least 6 characters');
      return;
    }
    
    if (users.find(u => u.email === authData.email)) {
      alert('❌ Email already registered');
      return;
    }

    const newUser = {
      id: users.length + 1,
      email: authData.email,
      password: authData.password,
      name: authData.name,
      verified: true
    };
    
    setUsers([...users, newUser]);
    setIsLoggedIn(true);
    setCurrentUser(newUser);
    setAuthData({ email: '', password: '', name: '' });
    setShowAuthModal(false);
    alert(`✅ Account Created Successfully!\n\nWelcome ${newUser.name}!\nEmail: ${newUser.email}`);
  };

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    alert('✅ Logged Out Successfully!');
  };

  const handleUpload = () => {
    if (!uploadData.title || !uploadData.tags) {
      alert('❌ Title and Tags are required');
      return;
    }

    if (!isLoggedIn) {
      alert('❌ Please login to upload images');
      setShowAuthModal(true);
      return;
    }

    if (!uploadedImage) {
      alert('❌ Please select an image to upload');
      return;
    }

    const newImage = {
      id: images.length + 1,
      title: uploadData.title,
      tags: uploadData.tags.split(',').map(t => t.trim()),
      uploader: currentUser.name,
      image: imagePreview,
      downloads: 0,
      likes: 0,
      keywords: `${uploadData.title} ${uploadData.tags} ${uploadData.description}`.toLowerCase()
    };
    
    setImages([newImage, ...images]);
    setUploadData({ title: '', tags: '', description: '' });
    setUploadedImage(null);
    setImagePreview(null);
    setShowUploadModal(false);
    alert('✅ Image uploaded successfully!\n\n📸 Title: ' + uploadData.title + '\n🏷️ Tags: ' + uploadData.tags + '\n📌 SEO Keywords: Optimized');
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('❌ Please select a valid image file');
        return;
      }

      setUploadedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (id, title) => {
    alert(`📥 Downloading: ${title}\n\nSEO Metadata:\n- Title, Tags, Keywords saved\n- Direct download link generated`);
    setImages(images.map(img =>
      img.id === id ? { ...img, downloads: img.downloads + 1 } : img
    ));
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleUploadClick = () => {
    if (!isLoggedIn) {
      alert('⚠️ Please login or signup to upload images');
      setShowAuthModal(true);
      setAuthMode('login');
    } else {
      setShowUploadModal(true);
    }
  };

  useEffect(() => {
    if (currentPage === 'home') {
      document.title = `Stock Hub - Free Stock Images & Photo Marketplace | ${filteredImages.length} Free Download Images`;
    }
  }, [filteredImages, currentPage]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-50 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600">SH</div>
            <h1 className="text-2xl font-bold hidden md:block">Stock Hub</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => { setCurrentPage('home'); setSearchTerm(''); }} className="hover:bg-white/20 px-3 py-2 rounded-lg transition font-medium">Home</button>
            <button onClick={() => setCurrentPage('gallery')} className="hover:bg-white/20 px-3 py-2 rounded-lg transition font-medium">Gallery</button>
            <button onClick={() => setCurrentPage('about')} className="hover:bg-white/20 px-3 py-2 rounded-lg transition font-medium">About</button>
            
            {isLoggedIn ? (
              <>
                <button 
                  onClick={handleUploadClick}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Upload
                </button>
                <div className="flex items-center gap-3 border-l border-white/30 pl-6">
                  <span className="text-sm">{currentUser?.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-lg transition"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                  className="px-4 py-2 hover:bg-white/20 rounded-lg transition font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => { setShowAuthModal(true); setAuthMode('signup'); }}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-blue-700 px-4 py-4 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/20 rounded-lg">Home</button>
            <button onClick={() => { setCurrentPage('gallery'); setShowMobileMenu(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/20 rounded-lg">Gallery</button>
            {isLoggedIn ? (
              <>
                <button onClick={() => { handleUploadClick(); setShowMobileMenu(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/20 rounded-lg">Upload Image</button>
                <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/20 rounded-lg text-red-300">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setShowAuthModal(true); setAuthMode('login'); setShowMobileMenu(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/20 rounded-lg">Login</button>
                <button onClick={() => { setShowAuthModal(true); setAuthMode('signup'); setShowMobileMenu(false); }} className="block w-full text-left px-3 py-2 hover:bg-white/20 rounded-lg">Sign Up</button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Home Page */}
      {currentPage === 'home' && (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Free Stock Images & Photos</h2>
              <p className="text-xl text-gray-600 mb-8">Download millions of free images. Share your photos with the world.</p>
              
              {/* Search Box */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="तस्वीरें खोजें... (sunset, nature, city, landscape)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition text-lg"
                />
              </div>

              {/* Upload CTA */}
              <button
                onClick={handleUploadClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition inline-flex items-center gap-2"
              >
                <Upload className="w-5 h-5" /> {isLoggedIn ? 'Share Your Images' : 'Login to Upload'}
              </button>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-white py-12 border-b">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-gray-900">{images.length}+</p>
                  <p className="text-gray-600">Free Images</p>
                </div>
                <div>
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-gray-900">50K+</p>
                  <p className="text-gray-600">Active Users</p>
                </div>
                <div>
                  <Zap className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-gray-900">100K+</p>
                  <p className="text-gray-600">Daily Downloads</p>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Popular Images</h3>
              <p className="text-gray-600 mb-8">Trending now • {filteredImages.length} images found</p>

              {filteredImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredImages.map(img => (
                    <div key={img.id} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200">
                      <div className="relative overflow-hidden bg-gray-200 h-64">
                        <img
                          src={img.image}
                          alt={img.title}
                          title={`${img.title} - Free Stock Photo by ${img.uploader}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => handleDownload(img.id, img.title)}
                            className="bg-white text-blue-600 p-3 rounded-full hover:bg-gray-100 transition"
                            title="Download Image"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleFavorite(img.id)}
                            className={`p-3 rounded-full transition ${favorites.includes(img.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}
                            title="Add to Favorites"
                          >
                            <Heart className="w-5 h-5" fill={favorites.includes(img.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{img.title}</h4>
                        <p className="text-sm text-gray-500 mb-3">by {img.uploader}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {img.tags.map(tag => (
                            <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">#{tag}</span>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>⬇️ {img.downloads}</span>
                          <span>❤️ {img.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">कोई तस्वीरें नहीं मिलीं (No images found)</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Auth Modal (Login/Signup) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {authMode === 'login' ? 'Login to Stock Hub' : 'Create Account'}
            </h3>
            
            {authMode === 'signup' && (
              <input
                type="text"
                placeholder="Full Name"
                value={authData.name}
                onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
              />
            )}
            
            <input
              type="email"
              placeholder="Email Address"
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-blue-600"
            />

            {authMode === 'login' && (
              <p className="text-sm text-gray-600 mb-4">
                Demo: test@example.com / password123
              </p>
            )}

            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={authMode === 'login' ? handleLogin : handleSignup}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {authMode === 'login' ? "Don't have account? " : 'Already have account? '}
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📸 Upload Image</h3>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">👤 Logged in as: <strong>{currentUser?.name}</strong></p>
              <p className="text-xs text-blue-700 mt-1">📧 {currentUser?.email}</p>
            </div>

            {/* Image Upload Section */}
            <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer block text-center">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                    <p className="text-sm text-blue-600 font-medium">✅ Image Selected</p>
                    <p className="text-xs text-gray-600 mt-1">📁 {uploadedImage?.name}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </>
                )}
              </label>
            </div>

            <input
              type="text"
              placeholder="Image Title (SEO Friendly)"
              value={uploadData.title}
              onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
            />
            
            <input
              type="text"
              placeholder="Tags (nature, sunset, landscape)"
              value={uploadData.tags}
              onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
            />
            
            <textarea
              placeholder="Description"
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600 h-20 resize-none"
            />
            
            <p className="text-xs text-gray-500 mb-4 p-3 bg-gray-50 rounded">📌 <strong>SEO Keywords</strong> automatically generated from title, tags & description</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedImage(null);
                  setImagePreview(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                disabled={!uploadedImage}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="text-white font-semibold mb-4">Browse</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Popular Images</a></li>
                <li><a href="#" className="hover:text-white transition">Categories</a></li>
                <li><a href="#" className="hover:text-white transition">Trending</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Upload</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Upload Photo</a></li>
                <li><a href="#" className="hover:text-white transition">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition">Creator Guide</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Stock Hub. All rights reserved. | Free Stock Images Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}