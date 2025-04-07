import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PolicyModal from './PolicyModal';
import PrivacyPolicyContent from './PrivacyPolicyContent';
import CookiePolicyContent from './CookiePolicyContent';
import TermsOfServiceContent from './TermsOfServiceContent';

function Footer() {
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState({
    message: '',
    isError: false,
    success: false
  });
  
  // Policy modal states
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(!email || !email.includes('@')){
        setSubscribeStatus({
            message: "Please enter a valid email address",
            isError: true,
            success: false
        });
        return;
    }

    setIsLoading(true);
    setSubscribeStatus({
        message: '',
        isError: false,
        success: false
    });

    try {
        const response = await fetch(
            `https://resource-base-backend-production.up.railway.app/api/newsletter/subscribe`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            }
        );

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.error || "Failed to subscribe");
        }

        setSubscribeStatus({
            message: "Thanks for subscribing",
            isError: false,
            success: true
        });

        setEmail('');
    } catch (error) {
        setSubscribeStatus({
            message: error.message === 'Email already subscribed' 
              ? 'This email is already subscribed' 
              : 'Failed to subscribe. Please try again.',
            isError: true,
            success: false
          });
          console.error('Newsletter subscription error:', error);    
    } finally{
        setIsLoading(false);
    }
  }
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <div className="text-xl font-bold text-blue-600">ResourceBase</div>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Discover, share and learn from the best and trusted resources, curated by the community.
            </p>
            <div className="flex space-x-4">
            <a href="https://github.com/Pritom2357" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/pritom-biswas-11b098315?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/pritom.biswas.3705157/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/tags" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tags
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Newsletter
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter to get the latest updates.
            </p>
            <form className="mt-2" onSubmit={handleSubmit}>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                  className="px-3 py-2 w-full text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                    type="submit"
                    className={`px-4 py-2 text-white text-sm font-medium rounded-r-md transition-colors ${
                      isLoading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={isLoading}
                  >
                  Subscribe
                </button>
              </div>

              {subscribeStatus.message && (
                <div className={`mt-2 text-sm px-2 py-1 rounded ${
                subscribeStatus.isError 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-green-600 bg-green-50'
                }`}>
                {subscribeStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            &copy; {currentYear} ResourceBase. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <button 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => setIsPrivacyModalOpen(true)}
            >
              Privacy Policy
            </button>
            <button 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => setIsTermsModalOpen(true)}
            >
              Terms of Service
            </button>
            <button 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => setIsCookieModalOpen(true)}
            >
              Cookie Policy
            </button>
          </div>
        </div>
        
        {/* Policy Modals */}
        <PolicyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          title="Privacy Policy"
          content={<PrivacyPolicyContent />}
        />
        
        <PolicyModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
          title="Terms of Service"
          content={<TermsOfServiceContent />}
        />
        
        <PolicyModal
          isOpen={isCookieModalOpen}
          onClose={() => setIsCookieModalOpen(false)}
          title="Cookie Policy"
          content={<CookiePolicyContent />}
        />
      </div>
    </footer>
  );
}

export default Footer;