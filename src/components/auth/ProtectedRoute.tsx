import type React from 'react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from './AuthModal';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // TEMPORARY: Auth bypass for development inspection
  return <>{children}</>;

  /* ORIGINAL AUTH CODE - COMMENTED OUT FOR DEVELOPMENT
  const { currentUser, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">AWS D1.1 Welder Dashboard</h1>
            <p className="text-slate-300 mb-8">Professional welding inspection and compliance platform</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return <>{children}</>;
  */
};

export default ProtectedRoute;
