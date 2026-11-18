import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Key, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle,
  MonitorCheck
} from 'lucide-react';

export default function UserManagementView({
  allUsers = [],
  userActivities = [],
  onOpenAddUser,
  onOpenChangePassword,
  onDeleteUser
}) {
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredUsers = allUsers.filter(u => {
    if (filterRole === 'ALL') return true;
    return u.role === filterRole;
  });

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    try {
      const d = new Date(ts);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(ts);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return { label: 'Admin', bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'ROLE_SALES_MANAGER':
        return { label: 'Sales Manager', bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' };
      case 'ROLE_SALES_EMPLOYEE':
      default:
        return { label: 'Sales Rep', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '22px 26px',
        border: '1px solid #eef2f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} />
            </div>
            <h1 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              User Management & Access Control
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Full Administrator oversight: provision Sales Reps and Managers, reset credentials, and monitor exact login/dashboard-close timestamps.
          </p>
        </div>

        <button
          onClick={onOpenAddUser}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 16px',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
          }}
        >
          <UserPlus size={16} />
          <span>Add New User</span>
        </button>
      </div>

      {/* 2. User Accounts Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #eef2f6',
        padding: '22px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              Sales Employees & System Users ({filteredUsers.length})
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Real-time directory of authorized staff and last active session timestamps
            </div>
          </div>

          {/* Role Filters */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            {['ALL', 'ROLE_SALES_EMPLOYEE', 'ROLE_SALES_MANAGER', 'ROLE_ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: filterRole === r ? '#4f46e5' : 'transparent',
                  color: filterRole === r ? '#ffffff' : '#64748b'
                }}
              >
                {r === 'ALL' ? 'All Roles' : r.replace('ROLE_', '').replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Name & Email</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Last Login Timestamp</th>
                <th style={{ padding: '10px 12px' }}>Last Dashboard Close / Logout</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const badge = getRoleBadge(user.role);

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: badge.bg,
                          color: badge.text,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`
                      }}>
                        {badge.label}
                      </span>
                    </td>

                    <td style={{ padding: '14px 12px', color: '#334155' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="#10b981" />
                        <span style={{ fontSize: '12.5px', fontWeight: 500 }}>
                          {formatTimestamp(user.lastLoginAt)}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 12px', color: '#334155' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MonitorCheck size={13} color="#64748b" />
                        <span style={{ fontSize: '12.5px', fontWeight: 500 }}>
                          {formatTimestamp(user.lastLogoutAt)}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => onOpenChangePassword(user)}
                          title="Reset Password"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Key size={13} color="#f59e0b" />
                          <span>Reset Password</span>
                        </button>

                        {user.role !== 'ROLE_ADMIN' && (
                          <button
                            onClick={() => onDeleteUser(user)}
                            title="Remove User"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #fee2e2',
                              backgroundColor: '#fff1f2',
                              color: '#e11d48',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Real-Time Activity & Timestamp Log */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #eef2f6',
        padding: '22px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            Live User Activity & Session Timestamp Audit Log
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Recorded security events: user logins, dashboard close events, and administrative password updates
          </div>
        </div>

        {userActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
            No activity logs captured yet.
          </div>
        ) : (
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 10px' }}>User</th>
                  <th style={{ padding: '8px 10px' }}>Activity Event</th>
                  <th style={{ padding: '8px 10px' }}>Details</th>
                  <th style={{ padding: '8px 10px' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {userActivities.map((act) => (
                  <tr key={act.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#0f172a' }}>
                      {act.userName} ({act.userEmail})
                    </td>

                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        backgroundColor: 
                          act.activityType === 'LOGIN' ? '#ecfdf5' : 
                          act.activityType === 'PASSWORD_RESET' ? '#fef3c7' : '#f1f5f9',
                        color: 
                          act.activityType === 'LOGIN' ? '#047857' : 
                          act.activityType === 'PASSWORD_RESET' ? '#b45309' : '#475569'
                      }}>
                        {act.activityType}
                      </span>
                    </td>

                    <td style={{ padding: '10px', color: '#475569' }}>
                      {act.details}
                    </td>

                    <td style={{ padding: '10px', color: '#64748b', fontSize: '12px' }}>
                      {formatTimestamp(act.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
