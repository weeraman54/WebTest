import React from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { Images } from '../../assets/assets';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white" style={{ backgroundColor: 'rgb(0, 3, 8)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Company Info */}
          <div className="lg:col-span-1 flex flex-col items-center text-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src={Images.NavbarLogo}
                alt="Geolex Logo"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Inspired by truly loved customers and established as Geolex, 
              Well known in PC industry all over Sri Lanka with The best PCs and Accessories.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 justify-center">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/geolex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 hover:bg-[#1877f2] rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/+94912259242"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 hover:bg-[#25d366] rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/geolex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.465 16.863c-1.477 0-2.673-1.197-2.673-2.673 0-1.477 1.196-2.673 2.673-2.673 1.477 0 2.673 1.196 2.673 2.673 0 1.476-1.196 2.673-2.673 2.673zm3.552-5.999c-2.206 0-3.997-1.79-3.997-3.997S9.811 2.87 12.017 2.87s3.997 1.79 3.997 3.997-1.791 3.997-3.997 3.997zm5.007 5.999c-1.477 0-2.673-1.197-2.673-2.673 0-1.477 1.196-2.673 2.673-2.673 1.477 0 2.673 1.196 2.673 2.673 0 1.476-1.196 2.673-2.673 2.673z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Head Office */}
          <div className="lg:col-span-1 flex flex-col items-center text-center">
            <h4 className="text-lg font-semibold text-white mb-4">HEAD OFFICE</h4>
            <div className="space-y-4">
              <div className="flex items-start justify-center">
                <MapPinIcon className="w-5 h-5 text-[#13ee9e] mr-3 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm leading-relaxed text-left">
                  <p className="mb-1">No.50, New Road,</p>
                  <p className="mb-1">Ambalangoda, Galle,</p>
                  <p>Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <PhoneIcon className="w-5 h-5 text-[#13ee9e] mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">Call Us: +94 91 225 9242</p>
              </div>

              <div className="flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 text-[#13ee9e] mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">Email: info@geolex.lk</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/" 
                  className="text-gray-300 hover:text-[#13ee9e] text-sm transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="text-gray-300 hover:text-[#13ee9e] text-sm transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/categories" 
                  className="text-gray-300 hover:text-[#13ee9e] text-sm transition-colors duration-300"
                >
                  Products
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-gray-300 hover:text-[#13ee9e] text-sm transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">SERVICES</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300 text-sm">Custom PC Building</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Hardware Repair</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Technical Support</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Product Consultation</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Warranty Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Geolex. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a 
                href="/privacy-policy" 
                className="text-gray-400 hover:text-[#13ee9e] text-sm transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-of-service" 
                className="text-gray-400 hover:text-[#13ee9e] text-sm transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;