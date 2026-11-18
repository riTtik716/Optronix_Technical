import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const QUICK_ROLES = [
  { label: 'Sales Representative', email: 'employee@optronix.com', pass: 'password123' },
  { label: 'Sales Manager', email: 'manager@optronix.com', pass: 'password123' },
  { label: 'System Administrator', email: 'admin@optronix.com', pass: 'password123' }
];

export default function LoginView({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('admin@optronix.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please provide your work email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.login(email.trim(), password);
      api.setTokens(res.accessToken, res.refreshToken);
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email & password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f3f4f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      boxSizing: 'border-box'
    }}>
      {/* Centered White Card (matching inspiration image) */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        backgroundColor: '#ffffff',
        borderRadius: '28px',
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f1f5f9',
        padding: '36px 32px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        
        {/* Top Logo Badge */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 8px 20px -4px rgba(249, 115, 22, 0.35)',
          marginBottom: '20px'
        }}>
          <Sparkles size={30} strokeWidth={2.2} />
        </div>

        {/* Title & Subtitle */}
        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 6px 0',
          letterSpacing: '-0.02em',
          textAlign: 'center'
        }}>
          Admin Console
        </h1>
        <p style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#64748b',
          margin: '0 0 24px 0',
          textAlign: 'center'
        }}>
          Optronix Management Panel
        </p>

        {/* Tab Switcher (Email Address / Role Login) */}
        <div style={{
          width: '100%',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '14px',
          display: 'flex',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'email' ? '#ffffff' : 'transparent',
              color: activeTab === 'email' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'email' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Email Address
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'phone' ? '#ffffff' : 'transparent',
              color: activeTab === 'phone' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'phone' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Role Login
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            boxSizing: 'border-box'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Email Field */}
          <div style={{ width: '100%' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '8px',
              textAlign: 'left'
            }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#eef4ff',
              borderRadius: '14px',
              padding: '12px 14px',
              border: '1.5px solid transparent',
              transition: 'border 0.2s, background-color 0.2s',
              boxSizing: 'border-box'
            }}>
              <Mail size={18} color="#94a3b8" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@optronix.com"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  color: '#0f172a',
                  fontWeight: 500
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ width: '100%' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '8px',
              textAlign: 'left'
            }}>
              Secret Key / Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#eef4ff',
              borderRadius: '14px',
              padding: '12px 14px',
              border: '1.5px solid transparent',
              transition: 'border 0.2s, background-color 0.2s',
              boxSizing: 'border-box'
            }}>
              <Lock size={18} color="#94a3b8" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  color: '#0f172a',
                  fontWeight: 500
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '8px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 20px',
              marginTop: '4px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px -2px rgba(79, 70, 229, 0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Minimal Quick Demo Credentials */}
        <div style={{
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid #f1f5f9',
          width: '100%',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#94a3b8',
            marginBottom: '10px',
            fontWeight: 500
          }}>
            Quick Fill Demo Credentials
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {QUICK_ROLES.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => handleQuickFill(r.email, r.pass)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s, color 0.15s'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
