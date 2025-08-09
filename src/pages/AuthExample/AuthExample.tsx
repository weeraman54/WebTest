import React, { useState } from 'react'
import SignInModal from '../../components/Auth/SignInModal'
import SignUpModal from '../../components/Auth/SignUpModal'
import { useAuth } from '../../contexts/AuthContext'

const AuthExample: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const { user, signOut } = useAuth()

  const openSignIn = () => {
    setShowSignUp(false)
    setShowSignIn(true)
  }

  const openSignUp = () => {
    setShowSignIn(false) 
    setShowSignUp(true)
  }

  const closeModals = () => {
    setShowSignIn(false)
    setShowSignUp(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Customer Authentication Demo
          </h1>
          <p className="text-gray-600">
            Test the Sign In and Sign Up modals for customer authentication
          </p>
        </div>

        {user ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                ✅ Successfully Signed In!
              </h2>
              <p className="text-gray-600">
                Welcome, {user.user_metadata.full_name || user.email}!
              </p>
            </div>
            <button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <button
                onClick={openSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Open Sign In Modal
              </button>
              
              <button
                onClick={openSignUp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Open Sign Up Modal
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Click either button to test the authentication modals</p>
            </div>
          </div>
        )}

        {/* Sign In Modal */}
        <SignInModal 
          isOpen={showSignIn} 
          onClose={closeModals} 
        />

        {/* Sign Up Modal */}
        <SignUpModal 
          isOpen={showSignUp} 
          onClose={closeModals} 
        />

        {/* Quick Switch Buttons in Modals */}
        {(showSignIn || showSignUp) && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 border">
              <p className="text-xs text-gray-500 mb-2">Quick Switch:</p>
              <div className="flex gap-2">
                <button
                  onClick={openSignIn}
                  className={`text-xs px-3 py-1 rounded ${
                    showSignIn 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={openSignUp}
                  className={`text-xs px-3 py-1 rounded ${
                    showSignUp 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthExample
