import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'

interface UserProfileDropdownProps {
  onSignInClick: () => void
  onSignUpClick: () => void
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ onSignInClick, onSignUpClick }) => {
  const { user, signOut, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center p-2 text-gray-600 hover:text-[#13ee9e] transition-colors rounded-full hover:bg-gray-900"
          title="Sign In / Sign Up"
          id="user-dropdown-toggle" 
        >
          <UserCircleIcon className="w-6 h-6" />
        </button>

        {/* Dropdown Menu for Sign In/Up */}
        {isOpen && (
          <>
            {/* Invisible bridge for hover */}
            <div className="absolute -top-2 right-0 w-full h-4 bg-transparent" />
            
            {/* Arrow */}
            {/* <div className="absolute -top-2 right-3 w-4 h-4 bg-blue-600 border-l border-t border-gray-700 transform rotate-45 z-10" /> */}
            
            {/* Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-[#151b25] rounded-lg shadow-lg border border-gray-700 py-2 z-20">
              <button
                onClick={() => {
                  onSignInClick()
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-800 text-white hover:text-[#13ee9e] transition-colors"
                id="signin-button"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onSignUpClick()
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-800 text-white hover:text-[#13ee9e] transition-colors"
                id="signup-button"
              >
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 text-gray-600 hover:text-[#13ee9e] transition-colors rounded-full hover:bg-gray-900"
        title={`Signed in as ${user?.user_metadata?.full_name || user?.email}`}
        id="auth-user-dropdown-toggle"
      >
        <UserCircleIcon className="w-6 h-6" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible bridge for hover */}
          <div className="absolute -top-2 right-0 w-full h-4 bg-transparent" />
          
          {/* Arrow */}
          {/* <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45 z-10" /> */}
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-[#151b25] rounded-lg shadow-lg border border-gray-800 py-2 z-20">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#13ee9e] rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[1rem] font-medium text-white truncate">
                    {user?.user_metadata?.full_name || 'Customer'}
                  </p>
                  <p className="text-[0.8rem] text-white truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/account')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#13ee9e] transition-colors"
                id="account-settings-button"
              >
                <Cog6ToothIcon className="w-4 h-4 mr-3" />
                Account & Orders
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
                id="signout-button"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UserProfileDropdown
