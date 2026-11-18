import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CalendarDays, 
  CheckSquare, 
  Building2, 
  LogOut, 
  Sparkles, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onSwitchAccount, 
  presetAccounts,
  pendingFollowUpsCount = 0
}) {
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  const isManager = currentUser?.role === 'ROLE_SALES_MANAGER';

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'MAIN MENU',
      items: [
        ...(isAdmin ? [{ id: 'users', label: 'User Management', icon: Users, badge: 'Admin' }] : []),
        { id: 'meetings', label: 'Meeting Lifecycle', icon: Calendar },
        { id: 'calendar', label: 'Calendar Schedule', icon: CalendarDays },
        { id: 'followups', label: 'Follow-up Tasks', icon: CheckSquare, count: pendingFollowUpsCount },
        { id: 'customers', label: 'Customer Accounts', icon: Building2 }
      ]
    }
  ];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      backgroundColor: '#0e1120',
      color: '#94a3b8',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRight: '1px solid #1e243d',
      minHeight: '100vh',
      boxSizing: 'border-box',
      userSelect: 'none'
    }}>
      {/* Top Brand Header */}
      <div>
        <div style={{
          padding: '24px 20px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #1a1f36'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
            flexShrink: 0
          }}>
            <Sparkles size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Optronix
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#6366f1',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              {isAdmin ? 'Admin Console' : isManager ? 'Manager Console' : 'Sales Workspace'}
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div style={{ padding: '20px 14px' }}>
          {navItems.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '22px' }}>
              <div style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#475569',
                letterSpacing: '0.08em',
                padding: '0 12px 8px 12px',
                textTransform: 'uppercase'
              }}>
                {sec.group}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isActive 
                          ? 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)' 
                          : 'transparent',
                        color: isActive ? '#ffffff' : '#94a3b8',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#181d33';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} color={isActive ? '#ffffff' : '#64748b'} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#1e293b',
                          color: isActive ? '#ffffff' : '#38bdf8'
                        }}>
                          {item.badge}
                        </span>
                      )}

                      {item.count > 0 && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '9999px',
                          backgroundColor: isActive ? '#ffffff' : '#ef4444',
                          color: isActive ? '#4f46e5' : '#ffffff'
                        }}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile & Role Bar */}
      <div style={{
        padding: '16px 14px',
        borderTop: '1px solid #1a1f36',
        backgroundColor: '#0a0c17'
      }}>
        {/* Quick Demo Switcher */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
            TEST DEMO ROLE
          </div>
          <select
            value={currentUser?.email || ''}
            onChange={(e) => onSwitchAccount(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              backgroundColor: '#15192c',
              border: '1px solid #232a48',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {presetAccounts.map((acc) => (
              <option key={acc.email} value={acc.email}>
                {acc.name} ({acc.role.replace('ROLE_', '')})
              </option>
            ))}
          </select>
        </div>

        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#121629',
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid #1c223c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isAdmin ? '#f59e0b' : isManager ? '#8b5cf6' : '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              flexShrink: 0
            }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {currentUser?.name}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#64748b',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {currentUser?.email}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
