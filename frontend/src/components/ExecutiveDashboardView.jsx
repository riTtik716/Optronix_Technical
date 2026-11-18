import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  ArrowRight, 
  AlertCircle, 
  Plus, 
  TrendingUp, 
  Play, 
  Pause, 
  Building2, 
  ExternalLink, 
  UserCheck, 
  Filter, 
  X,
  Briefcase
} from 'lucide-react';

export default function ExecutiveDashboardView({
  currentUser,
  meetings = [],
  followUps = [],
  customers = [],
  employees = [],
  onScheduleClick,
  onAddCustomerClick,
  onNavigateTab,
  onCheckIn,
  onStart,
  onPause,
  onResume,
  onComplete,
  onViewAudit
}) {
  const [selectedManagerId, setSelectedManagerId] = useState('ALL');
  const [selectedRepId, setSelectedRepId] = useState('ALL');
  const [trendRange, setTrendRange] = useState('Last Week');

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  const isManager = currentUser?.role === 'ROLE_SALES_MANAGER';
  const isEmployee = currentUser?.role === 'ROLE_SALES_EMPLOYEE';

  // Available managers from employees list
  const managers = employees.filter(e => e.role === 'ROLE_SALES_MANAGER');

  // Reps (filtered by manager if selected)
  const salesReps = employees.filter(e => {
    if (e.role !== 'ROLE_SALES_EMPLOYEE') return false;
    // If logged in as Manager, only show reps reporting to this manager
    if (isManager && e.managerId && String(e.managerId) !== String(currentUser?.id)) {
      return false;
    }
    // If admin has selected a manager filter
    if (isAdmin && selectedManagerId !== 'ALL' && String(e.managerId) !== String(selectedManagerId)) {
      return false;
    }
    return true;
  });

  // Filter meetings by selected manager and rep
  const filteredMeetings = meetings.filter(m => {
    // If logged in as Manager, only see reps in manager's team
    if (isManager && m.assignedEmployeeManagerId && String(m.assignedEmployeeManagerId) !== String(currentUser?.id)) {
      return false;
    }
    // If Admin filtered by Manager
    if (isAdmin && selectedManagerId !== 'ALL') {
      if (String(m.assignedEmployeeManagerId) !== String(selectedManagerId)) return false;
    }
    // Filter by Rep
    if (selectedRepId !== 'ALL') {
      if (String(m.assignedEmployeeId) !== String(selectedRepId)) return false;
    }
    return true;
  });

  // Filter follow-ups by selected rep
  const filteredFollowUps = followUps.filter(f => {
    if (selectedRepId !== 'ALL') {
      return String(f.ownerId) === String(selectedRepId);
    }
    if (isManager) {
      const repIds = salesReps.map(r => String(r.id));
      return repIds.includes(String(f.ownerId));
    }
    return true;
  });

  // Dynamic Statistics
  const totalMeetings = filteredMeetings.length;
  const inProgressMeetings = filteredMeetings.filter(m => m.status === 'IN_PROGRESS' || m.status === 'CHECKED_IN').length;
  const completedMeetings = filteredMeetings.filter(m => m.status === 'COMPLETED').length;
  const pendingFollowUps = filteredFollowUps.filter(f => f.status === 'PENDING').length;

  // Active customer accounts visited in this filter
  const visitedCustomerIds = new Set(filteredMeetings.map(m => m.customer?.id || m.customerId));
  const activeCustomerAccountsCount = visitedCustomerIds.size > 0 ? visitedCustomerIds.size : customers.length;

  const outcomeCounts = {
    INTERESTED: filteredMeetings.filter(m => m.outcome === 'INTERESTED').length,
    FOLLOW_UP_REQUIRED: filteredMeetings.filter(m => m.outcome === 'FOLLOW_UP_REQUIRED').length,
    PROPOSAL_REQUESTED: filteredMeetings.filter(m => m.outcome === 'PROPOSAL_REQUESTED').length,
    NOT_INTERESTED: filteredMeetings.filter(m => m.outcome === 'NOT_INTERESTED').length,
    UNABLE_TO_MEET: filteredMeetings.filter(m => m.outcome === 'UNABLE_TO_MEET').length
  };

  const selectedRepObj = employees.find(e => String(e.id) === String(selectedRepId));

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
      case 'CONFIRMED': return { bg: '#ccfbf1', text: '#0f766e', border: '#99f6e4' };
      case 'CHECKED_IN': return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'IN_PROGRESS': return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      case 'COMPLETED': return { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' };
      case 'REOPENED': return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
      default: return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Scope Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid #eef2f6',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Welcome back, {currentUser?.name}
            </h1>
            <span style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: isAdmin ? '#fef3c7' : isManager ? '#f3e8ff' : '#eff6ff',
              color: isAdmin ? '#92400e' : isManager ? '#6b21a8' : '#1e40af',
              border: `1px solid ${isAdmin ? '#fde68a' : isManager ? '#e9d5ff' : '#bfdbfe'}`
            }}>
              {currentUser?.role?.replace('ROLE_', '')}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            {isEmployee && 'Personal Sales Workspace: Tracking your assigned meetings, active GPS visits, and personal follow-up tasks.'}
            {isManager && 'Sales Manager Console: Team pipeline oversight, active GPS check-ins, and meeting reopen governance.'}
            {isAdmin && 'Executive System & Security Console: Enterprise-wide visibility across all managers, sales teams, and customer accounts.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="https://meet.google.com/new"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '12.5px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Video size={15} />
            <span>Start Google Meet</span>
          </a>

          <button
            onClick={onScheduleClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
            }}
          >
            <Plus size={15} />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* 2. Enterprise Team Hierarchy & Sales Rep Filter Selector (For Managers & Admin) */}
      {!isEmployee && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="#4f46e5" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                Filter Dashboard by Sales Representative:
              </span>
              {selectedRepId !== 'ALL' && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#4f46e5',
                  backgroundColor: '#eef2ff',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #c7d2fe'
                }}>
                  Showing: {selectedRepObj?.name} ({totalMeetings} visits)
                </span>
              )}
            </div>

            {/* Admin Manager Switcher */}
            {isAdmin && managers.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Filter Manager:</span>
                <select
                  value={selectedManagerId}
                  onChange={(e) => {
                    setSelectedManagerId(e.target.value);
                    setSelectedRepId('ALL');
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    fontSize: '12px',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">All Sales Managers (2)</option>
                  {managers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Rep Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* All Reps Pill */}
            <button
              onClick={() => setSelectedRepId('ALL')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: selectedRepId === 'ALL' ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                backgroundColor: selectedRepId === 'ALL' ? '#4f46e5' : '#f8fafc',
                color: selectedRepId === 'ALL' ? '#ffffff' : '#475569',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={14} />
              <span>All Team Reps</span>
              <span style={{
                fontSize: '10.5px',
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: selectedRepId === 'ALL' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                color: selectedRepId === 'ALL' ? '#ffffff' : '#0f172a'
              }}>
                {meetings.length}
              </span>
            </button>

            {/* Individual Reps */}
            {salesReps.map((rep) => {
              const repMeetingsCount = meetings.filter(m => String(m.assignedEmployeeId) === String(rep.id)).length;
              const isSelected = String(selectedRepId) === String(rep.id);

              return (
                <button
                  key={rep.id}
                  onClick={() => setSelectedRepId(String(rep.id))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#4f46e5' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : '#e0e7ff',
                    color: isSelected ? '#ffffff' : '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800
                  }}>
                    {rep.name.charAt(0)}
                  </div>

                  <span>{rep.name.split(' (')[0]}</span>

                  {rep.managerName && isAdmin && (
                    <span style={{
                      fontSize: '10px',
                      color: isSelected ? '#e0e7ff' : '#94a3b8',
                      fontWeight: 500
                    }}>
                      (Mgr: {rep.managerName.split(' (')[0]})
                    </span>
                  )}

                  <span style={{
                    fontSize: '10.5px',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#0f172a'
                  }}>
                    {repMeetingsCount}
                  </span>
                </button>
              );
            })}

            {selectedRepId !== 'ALL' && (
              <button
                onClick={() => setSelectedRepId('ALL')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <X size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Stat Metric Cards (Dynamically recalculate based on selected rep) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        {/* Metric 1: Total Visits */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>TOTAL VISITS</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{totalMeetings}</div>
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <TrendingUp size={12} />
            <span>{selectedRepId !== 'ALL' ? `${selectedRepObj?.name.split(' (')[0]}'s pipeline` : 'Active pipeline'}</span>
          </div>
        </div>

        {/* Metric 2: In-Progress / Active */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>IN PROGRESS / ACTIVE</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: inProgressMeetings > 0 ? '#10b981' : '#0f172a' }}>
            {inProgressMeetings}
          </div>
          <div style={{ fontSize: '11px', color: inProgressMeetings > 0 ? '#10b981' : '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {inProgressMeetings > 0 && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>}
            <span>{inProgressMeetings > 0 ? 'Live GPS sessions active' : 'No active sessions'}</span>
          </div>
        </div>

        {/* Metric 3: Completed */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>COMPLETED</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{completedMeetings}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Recorded outcomes</div>
        </div>

        {/* Metric 4: Pending Follow-ups */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>PENDING FOLLOW-UPS</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: pendingFollowUps > 0 ? '#f59e0b' : '#0f172a' }}>
            {pendingFollowUps}
          </div>
          <div style={{ fontSize: '11px', color: pendingFollowUps > 0 ? '#d97706' : '#64748b', marginTop: '4px' }}>
            {pendingFollowUps > 0 ? 'Action items pending' : 'All clear'}
          </div>
        </div>

        {/* Metric 5: Active Customer Accounts */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>CUSTOMER ACCOUNTS</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{activeCustomerAccountsCount}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Engaged enterprise accounts</div>
        </div>
      </div>

      {/* 4. Sales Team Leaderboard Widget (For Managers & Admin) */}
      {!isEmployee && selectedRepId === 'ALL' && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #eef2f6',
          padding: '22px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Sales Team Performance & Pipeline Overview
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Individual representative workloads, active visits, and pending commitments
              </div>
            </div>
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
              {salesReps.length} Representatives reporting
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            {salesReps.map((rep) => {
              const repMeetings = meetings.filter(m => String(m.assignedEmployeeId) === String(rep.id));
              const repActive = repMeetings.filter(m => m.status === 'IN_PROGRESS' || m.status === 'CHECKED_IN').length;
              const repCompleted = repMeetings.filter(m => m.status === 'COMPLETED').length;
              const repFollowUps = followUps.filter(f => String(f.ownerId) === String(rep.id) && f.status === 'PENDING').length;

              return (
                <div
                  key={rep.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700
                      }}>
                        {rep.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                          {rep.name.split(' (')[0]}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {rep.email}
                        </div>
                        {rep.managerName && (
                          <div style={{ fontSize: '10.5px', color: '#4f46e5', fontWeight: 600, marginTop: '2px' }}>
                            Team: {rep.managerName.split(' (')[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedRepId(String(rep.id))}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#4f46e5',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View Visits
                    </button>
                  </div>

                  {/* Stat pills */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '6px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{repMeetings.length}</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>Total</div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '6px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: repActive > 0 ? '#10b981' : '#0f172a' }}>{repActive}</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>Active</div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '6px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#8b5cf6' }}>{repCompleted}</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>Done</div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '6px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: repFollowUps > 0 ? '#f59e0b' : '#0f172a' }}>{repFollowUps}</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>Tasks</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Analytics Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* Trend Graph */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '22px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <VisitActivityCadenceChart 
            meetings={filteredMeetings} 
            trendRange={trendRange} 
            setTrendRange={setTrendRange} 
            selectedRepName={selectedRepObj?.name.split(' (')[0]}
          />
        </div>

        {/* Outcome Breakdown Donut & List */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '22px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Meeting Outcomes Breakdown</div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Post-visit results ({completedMeetings} completed)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Interested', count: outcomeCounts.INTERESTED, color: '#10b981', bg: '#ecfdf5' },
              { label: 'Follow-up required', count: outcomeCounts.FOLLOW_UP_REQUIRED, color: '#f59e0b', bg: '#fffbeb' },
              { label: 'Proposal requested', count: outcomeCounts.PROPOSAL_REQUESTED, color: '#3b82f6', bg: '#eff6ff' },
              { label: 'Not interested', count: outcomeCounts.NOT_INTERESTED, color: '#64748b', bg: '#f8fafc' },
              { label: 'Unable to meet', count: outcomeCounts.UNABLE_TO_MEET, color: '#ef4444', bg: '#fef2f2' }
            ].map((item, idx) => {
              const pct = completedMeetings > 0 ? Math.round((item.count / completedMeetings) * 100) : 0;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></span>
                    <span style={{ fontSize: '12.5px', color: '#334155', fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', height: '7px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: item.count > 0 ? `${Math.max(pct, 6)}%` : '0%',
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: item.count > 0 ? '#0f172a' : '#94a3b8',
                      minWidth: '55px',
                      textAlign: 'right'
                    }}>
                      {item.count} <span style={{ fontSize: '10.5px', fontWeight: 500, color: '#64748b' }}>({pct}%)</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Recent Visits & Virtual Meeting Rooms Table */}
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
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              Client Visits & Virtual Meeting Rooms ({filteredMeetings.length})
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {selectedRepId !== 'ALL' 
                ? `Visits assigned to ${selectedRepObj?.name.split(' (')[0]}`
                : isEmployee ? 'Your assigned meetings and visits' : 'All team visits and direct meeting access'}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('meetings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              background: 'transparent',
              color: '#4f46e5',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <span>View All Visits</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {filteredMeetings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
            <Calendar size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 500 }}>No visits scheduled for this selection.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Customer & Purpose</th>
                  {!isEmployee && <th style={{ padding: '10px 12px' }}>Sales Representative</th>}
                  <th style={{ padding: '10px 12px' }}>Location</th>
                  <th style={{ padding: '10px 12px' }}>Scheduled Time</th>
                  <th style={{ padding: '10px 12px' }}>Google Meet</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeetings.map((meeting) => {
                  const statusStyle = getStatusColor(meeting.status);
                  const meetLink = meeting.meetingLink || 'https://meet.google.com/new';
                  const custName = meeting.customer?.companyName || meeting.customerName || 'Customer';

                  return (
                    <tr key={meeting.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{custName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{meeting.purpose}</div>
                      </td>

                      {!isEmployee && (
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: '#e0e7ff',
                              color: '#4f46e5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              {meeting.assignedEmployeeName?.charAt(0) || 'R'}
                            </div>
                            <div>
                              <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '12.5px' }}>
                                {meeting.assignedEmployeeName?.split(' (')[0]}
                              </div>
                              {meeting.assignedEmployeeManagerName && (
                                <div style={{ fontSize: '10.5px', color: '#6366f1', fontWeight: 500 }}>
                                  Mgr: {meeting.assignedEmployeeManagerName.split(' (')[0]}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      )}

                      <td style={{ padding: '12px', color: '#475569' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="#94a3b8" />
                          <span>{meeting.meetingLocation || meeting.locationAddress || 'Client Site'}</span>
                        </div>
                      </td>

                      <td style={{ padding: '12px', color: '#475569', fontSize: '12px' }}>
                        {new Date(meeting.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.scheduledEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td style={{ padding: '12px' }}>
                        <a
                          href={meetLink}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#065f46',
                            textDecoration: 'none',
                            fontSize: '11.5px',
                            fontWeight: 600
                          }}
                        >
                          <Video size={13} />
                          <span>Join Meet</span>
                          <ExternalLink size={11} />
                        </a>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`
                        }}>
                          {meeting.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => onViewAudit(meeting)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            color: '#475569',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

function VisitActivityCadenceChart({ meetings = [], trendRange, setTrendRange, selectedRepName }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const toDate = (val) => {
    if (!val) return null;
    if (Array.isArray(val)) {
      return new Date(val[0], val[1] - 1, val[2], val[3] || 0, val[4] || 0);
    }
    return new Date(val);
  };

  const today = new Date();
  let dataPoints = [];

  if (trendRange === 'Today') {
    // 6 time buckets today: 8 AM, 10 AM, 12 PM, 2 PM, 4 PM, 6 PM
    const buckets = [
      { label: '8 AM', startH: 0, endH: 10 },
      { label: '10 AM', startH: 10, endH: 12 },
      { label: '12 PM', startH: 12, endH: 14 },
      { label: '2 PM', startH: 14, endH: 16 },
      { label: '4 PM', startH: 16, endH: 18 },
      { label: '6 PM', startH: 18, endH: 24 }
    ];

    dataPoints = buckets.map(b => {
      const matching = meetings.filter(m => {
        const d = toDate(m.scheduledStartTime);
        if (!d) return false;
        const isToday = d.toDateString() === today.toDateString();
        const h = d.getHours();
        return isToday && h >= b.startH && h < b.endH;
      });
      return {
        label: b.label,
        subLabel: 'Today',
        count: matching.length,
        meetings: matching
      };
    });
  } else if (trendRange === 'Last Month') {
    // 4 rolling calendar weeks of the past month
    const weeks = [
      { label: 'Week 1', startDaysAgo: 28, endDaysAgo: 21 },
      { label: 'Week 2', startDaysAgo: 21, endDaysAgo: 14 },
      { label: 'Week 3', startDaysAgo: 14, endDaysAgo: 7 },
      { label: 'Week 4', startDaysAgo: 7, endDaysAgo: 0 }
    ];

    dataPoints = weeks.map(w => {
      const startD = new Date(today.getTime() - w.startDaysAgo * 86400000);
      const endD = new Date(today.getTime() - w.endDaysAgo * 86400000);
      const startT = startD.getTime();
      const endT = endD.getTime();
      const matching = meetings.filter(m => {
        const d = toDate(m.scheduledStartTime);
        if (!d) return false;
        const t = d.getTime();
        return t >= startT && t <= endT;
      });
      return {
        label: w.label,
        subLabel: `${startD.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endD.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
        count: matching.length,
        meetings: matching
      };
    });
  } else {
    // Past 7 Days cadence (matching Rentellor reference)
    const dayIndices = [6, 5, 4, 3, 2, 1, 0];
    dataPoints = dayIndices.map(daysAgo => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - daysAgo);

      const matching = meetings.filter(m => {
        const d = toDate(m.scheduledStartTime);
        if (!d) return false;
        return d.toDateString() === targetDate.toDateString();
      });

      const dayName = daysAgo === 0 ? 'Today' : targetDate.toLocaleDateString(undefined, { weekday: 'short' });
      const dateName = targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      return {
        label: dayName,
        subLabel: dateName,
        count: matching.length,
        meetings: matching
      };
    });
  }

  // Calculate real mathematical coordinates
  const maxVal = Math.max(...dataPoints.map(p => p.count), 1);
  const svgWidth = 480;
  const svgHeight = 140;
  const paddingX = 35;
  const paddingYTop = 25;
  const paddingYBottom = 25;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingYTop - paddingYBottom;
  const baselineY = svgHeight - paddingYBottom;

  const points = dataPoints.map((dp, idx) => {
    const x = paddingX + (idx / (dataPoints.length - 1)) * usableWidth;
    const y = baselineY - (dp.count / maxVal) * usableHeight;
    return { ...dp, x, y };
  });

  // Build SVG path with smooth cubic curves
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;
  const totalInPeriod = dataPoints.reduce((acc, p) => acc + p.count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Chart Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Visit Activity Cadence</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#eef2ff',
              color: '#4f46e5',
              border: '1px solid #c7d2fe'
            }}>
              {totalInPeriod} visits {trendRange.toLowerCase()}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            {selectedRepName ? `Real-time activity for ${selectedRepName}` : 'Live company visit distribution across scheduled pipeline'}
          </div>
        </div>

        {/* Time Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
          {['Today', 'Last Week', 'Last Month'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setTrendRange(tab); setHoveredPoint(null); }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: trendRange === tab ? '#4f46e5' : 'transparent',
                color: trendRange === tab ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div style={{ position: 'relative', width: '100%', height: '170px' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="liveTrendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          <line x1={paddingX} y1={paddingYTop} x2={svgWidth - paddingX} y2={paddingYTop} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={paddingX} y1={(paddingYTop + baselineY) / 2} x2={svgWidth - paddingX} y2={(paddingYTop + baselineY) / 2} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={paddingX} y1={baselineY} x2={svgWidth - paddingX} y2={baselineY} stroke="#e2e8f0" strokeWidth="1" />

          {/* Gradient Filled Area */}
          <path d={areaD} fill="url(#liveTrendGradient)" />

          {/* Dynamic Curve Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => {
            const isHovered = hoveredPoint?.label === pt.label;
            const hasData = pt.count > 0;

            return (
              <g 
                key={i} 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Outer Glow Ring on Hover */}
                {isHovered && (
                  <circle cx={pt.x} cy={pt.y} r="12" fill="#4f46e5" fillOpacity="0.18" />
                )}

                {/* Point Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hasData ? 5 : 3.5}
                  fill={hasData ? '#4f46e5' : '#cbd5e1'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Value Badge if count > 0 */}
                {hasData && (
                  <text
                    x={pt.x}
                    y={pt.y - 9}
                    textAnchor="middle"
                    fill="#4f46e5"
                    fontSize="10"
                    fontWeight="800"
                  >
                    {pt.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovering over a real point */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            left: `${(hoveredPoint.x / svgWidth) * 100}%`,
            top: '0px',
            transform: 'translate(-50%, -20%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11.5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap'
          }}>
            <div style={{ fontWeight: 700 }}>
              {hoveredPoint.label} ({hoveredPoint.subLabel}): {hoveredPoint.count} {hoveredPoint.count === 1 ? 'visit' : 'visits'}
            </div>
            {hoveredPoint.meetings?.length > 0 && (
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                {hoveredPoint.meetings.map(m => m.customer?.companyName || m.customerName).slice(0, 2).join(', ')}
                {hoveredPoint.meetings.length > 2 ? ` +${hoveredPoint.meetings.length - 2} more` : ''}
              </div>
            )}
          </div>
        )}

        {/* X-Axis Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontWeight: 600,
          color: '#64748b',
          marginTop: '6px',
          padding: `0 ${paddingX - 8}px`
        }}>
          {dataPoints.map((dp, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div>{dp.label}</div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 500 }}>
                {dp.subLabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
