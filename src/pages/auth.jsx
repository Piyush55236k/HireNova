import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../utils/supabase'
import { useSupabaseUser } from '../hooks/useSupabaseUser'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import '../styles/auth.css'

export default function AuthPage() {
  const { isSignedIn, isLoaded } = useSupabaseUser()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Handle sign out when redirected here
    const signedOut = searchParams.get('signed-out')
    if (signedOut === 'true') {
      console.log("🚪 Processing sign out on auth page")
      
      // Clear Supabase auth
      supabase.auth.signOut().then(() => {
        console.log("✅ Supabase sign out completed")
      }).catch(error => {
        console.log("⚠️ Supabase sign out error (continuing anyway):", error)
      })
      
      // Clear storage
      try {
        localStorage.clear()
        sessionStorage.clear()
        console.log("✅ Storage cleared")
      } catch (error) {
        console.log("⚠️ Storage clear error:", error)
      }
      
      // Remove the query parameter
      window.history.replaceState({}, document.title, '/auth')
    }
  }, [searchParams])

  if (!isLoaded) return <div>Loading...</div>
  
  if (isSignedIn) {
    return <Navigate to="/onboarding" />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent backdrop-blur-sm">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800/90 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-2xl p-8 relative">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-violet-900/20 rounded-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="mb-4">
                <img src="/logo.png" className="h-12 mx-auto" alt="HireNova Logo" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome to HireNova
              </h2>
              <p className="text-gray-300 text-sm">
                Sign in to your account or create a new one
              </p>
            </div>
            
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: 'dark',
                variables: {
                  default: {
                    colors: {
                      brand: '#8b5cf6', // Purple-500
                      brandAccent: '#7c3aed', // Purple-600
                      brandButtonText: 'white',
                      defaultButtonBackground: 'transparent',
                      defaultButtonBackgroundHover: '#374151', // Gray-700
                      defaultButtonBorder: '#6b7280', // Gray-500
                      defaultButtonText: '#f3f4f6', // Gray-100
                      dividerBackground: '#4b5563', // Gray-600
                      inputBackground: 'rgba(31, 41, 55, 0.8)', // Gray-800 with transparency
                      inputBorder: '#6b7280', // Gray-500
                      inputBorderHover: '#8b5cf6', // Purple-500
                      inputBorderFocus: '#a855f7', // Purple-500
                      inputText: '#f3f4f6', // Gray-100
                      inputLabelText: '#d1d5db', // Gray-300
                      inputPlaceholder: '#9ca3af', // Gray-400
                      messageText: '#f87171', // Red-400 for errors
                      messageTextDanger: '#f87171', // Red-400
                      anchorTextColor: '#c084fc', // Purple-300
                      anchorTextHoverColor: '#a855f7', // Purple-500
                    },
                    space: {
                      spaceSmall: '4px',
                      spaceMedium: '8px',
                      spaceLarge: '16px',
                      labelBottomMargin: '8px',
                      anchorBottomMargin: '4px',
                      emailInputSpacing: '4px',
                      socialAuthSpacing: '4px',
                      buttonPadding: '10px 15px',
                      inputPadding: '10px 15px',
                    },
                    fontSizes: {
                      baseBodySize: '14px',
                      baseInputSize: '14px',
                      baseLabelSize: '14px',
                      baseButtonSize: '14px',
                    },
                    fonts: {
                      bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                      buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                      inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                    },
                    radii: {
                      borderRadiusButton: '8px',
                      borderRadiusInput: '8px',
                    },
                  }
                },
                style: {
                  button: {
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    padding: '12px 24px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  },
                  anchor: {
                    color: '#c084fc',
                    textDecoration: 'none',
                    fontWeight: '500',
                  },
                  divider: {
                    background: '#4b5563',
                    margin: '16px 0',
                  },
                  label: {
                    color: '#d1d5db',
                    fontWeight: '500',
                    fontSize: '14px',
                    marginBottom: '6px',
                  },
                  input: {
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid #6b7280',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                    padding: '12px 16px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease-in-out',
                    backdropFilter: 'blur(8px)',
                  },
                  message: {
                    color: '#f87171',
                    fontSize: '13px',
                    marginTop: '4px',
                  },
                },
              }}
              providers={['google', 'github']}
              redirectTo={window.location.origin + '/onboarding'}
              theme="dark"
            />
          </div>
        </div>
        
        {/* Subtle decorative elements - smaller and more transparent */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-violet-500/5 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  )
}
