import React from 'react';
import { Search, Plus, Radio, Shield, Bell } from 'lucide-react';

export default function TopHeader({ 
  activeTab, 
  currentUser, 
  onScheduleClick,
  searchQuery,
  setSearchQuery 
}) {
  const tabTitles = {
    dashboard: 'Executive Dashboard',
    users: 'User Management & Security Access',
    meetings: 'Meeting Lifecycle & Visit Tracking',
    calendar: 'Interactive Visit Calendar',
    followups: 'Follow-up Action Items',
    customers: 'Customer Accounts Register'
  };

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  const isManager = currentUser?.role === 'ROLE_SALES_MANAGER';

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #eef2f6',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      {/* Left Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
          Optronix Portal
        </span>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
          {tabTitles[activeTab] || 'Dashboard'}
        </span>
      </div>

      {/* Center Search Bar */}
      <div style={{
        position: 'relative',
        width: '360px',
        maxWidth: '100%'
      }}>
        <Search 
          size={16} 
          color="#94a3b8" 
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search meetings, customers, reps..."
          style={{
            width: '100%',
            padding: '9px 16px 9px 38px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            fontSize: '12.5px',
            outline: 'none',
            color: '#1e293b',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Right Actions & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Live Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '9999px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          fontSize: '12px',
          fontWeight: 600,
          color: '#065f46'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'inline-block'
          }}></span>
          <span>All systems normal</span>
        </div>

        {/* Schedule Visit Button */}
        <button
          onClick={onScheduleClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            transition: 'background-color 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Schedule Visit</span>
        </button>
      </div>
    </header>
  );
}
