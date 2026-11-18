import React from 'react';
import { 
  Calendar, CheckCircle, Clock, MapPin, Users, Shield, 
  ArrowRight, AlertCircle, Plus, Play, Pause, RotateCcw, 
  CheckSquare, TrendingUp, Sparkles, UserCheck, Key
} from 'lucide-react';

export default function DashboardView({
  currentUser,
  meetings,
  followUps,
  customers,
  allUsers,
  userActivities,
  onScheduleClick,
  onAddCustomerClick,
  onCheckIn,
  onStart,
  onPause,
  onResume,
  onComplete,
  onReopen,
  onViewAudit
}) {
  const isEmployee = currentUser?.role === 'ROLE_SALES_EMPLOYEE';
  const isManager = currentUser?.role === 'ROLE_SALES_MANAGER';
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  // Calculate stats based on role
  const totalMeetings = meetings.length;
  const inProgressMeetings = meetings.filter(m => m.status === 'IN_PROGRESS' || m.status === 'CHECKED_IN').length;
  const completedMeetings = meetings.filter(m => m.status === 'COMPLETED').length;
  const pendingFollowUps = followUps.filter(f => f.status === 'PENDING').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Hero Scope Banner tailored to Role */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px 28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Welcome back, {currentUser?.name}
            </h1>
            <span style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: isAdmin ? '#fef3c7' : isManager ? '#f3e8ff' : '#eff6ff',
              color: isAdmin ? '#92400e' : isManager ? '#6b21a8' : '#1e40af',
              border: `1px solid ${isAdmin ? '#fde68a' : isManager ? '#e9d5ff' : '#bfdbfe'}`
            }}>
              {currentUser?.role?.replace('ROLE_', '')}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '650px' }}>
            {isEmployee && 'Personal Sales Workspace: You have access strictly to your own assigned meetings, GPS check-ins, and personal follow-ups.'}
            {isManager && 'Sales Management Workspace: You have complete oversight of all team members’ visits, active GPS sessions, and permission to reopen completed meetings.'}
            {isAdmin && 'Executive System & Security Console: Global access across all sales accounts, company meetings, live login/logout timestamps, and credential controls.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-primary" 
            onClick={onScheduleClick}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <Plus size={16} /> Schedule Visit
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onAddCustomerClick}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <Users size={16} /> Add Customer
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Metric 1 */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              {isEmployee ? 'My Scheduled Visits' : isManager ? 'Team Total Visits' : 'Company Meetings'}
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{totalMeetings}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            {isEmployee ? 'Assigned specifically to you' : 'Across all registered customers'}
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              {isEmployee ? 'My Active Visits' : 'Visits In Progress'}
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669' }}>{inProgressMeetings}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Checked in & ongoing in field
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Completed Visits
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#7c3aed' }}>{completedMeetings}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Outcomes & notes logged
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              {isEmployee ? 'My Pending Tasks' : isManager ? 'Team Pending Tasks' : 'System Audit Events'}
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#d97706' }}>
              <CheckSquare size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#d97706' }}>
            {isAdmin ? (userActivities?.length || 0) : pendingFollowUps}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            {isAdmin ? 'Logged user & security events' : 'Mandatory follow-up items'}
          </div>
        </div>
      </div>

      {/* 3. Recent Meetings / Live Visits Overview */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {isEmployee ? 'My Recent Sales Visits & Activities' : isManager ? 'Team Sales Visits & Live Field Status' : 'All Enterprise Visits Overview'}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
              Showing {meetings.length} visits visible under your <b>{currentUser?.role?.replace('ROLE_', '')}</b> security scope.
            </p>
          </div>
        </div>

        {meetings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: '13px' }}>
            No sales visits found for this account. Click "Schedule Visit" to create one.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {meetings.map((m) => {
              const statusClass = 
                m.status === 'COMPLETED' ? 'badge-completed' :
                m.status === 'IN_PROGRESS' || m.status === 'CHECKED_IN' ? 'badge-in-progress' :
                m.status === 'CONFIRMED' ? 'badge-confirmed' :
                m.status === 'REOPENED' ? 'badge-reopened' : 'badge-scheduled';

              return (
                <div key={m.id} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  <div>
                    {/* Top Status & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span className={`badge ${statusClass}`} style={{ fontSize: '11px', fontWeight: 700 }}>
                        {m.status}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                        {new Date(m.scheduledStartTime).toLocaleDateString()} {new Date(m.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Purpose & Customer */}
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                      {m.purpose}
                    </h3>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', marginBottom: '10px' }}>
                      🏢 {m.customer?.companyName} <span style={{ color: '#64748b', fontWeight: 400 }}>({m.customer?.contactPerson})</span>
                    </div>

                    {/* Assigned Salesperson (Vital for Manager & Admin visibility) */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      fontSize: '12px',
                      marginBottom: '10px',
                      border: '1px solid #f1f5f9'
                    }}>
                      <div style={{ color: '#475569' }}>
                        👤 <b>Assigned Rep:</b> {m.assignedEmployeeName} <span style={{ color: '#94a3b8' }}>({m.assignedEmployeeEmail})</span>
                      </div>
                      <div style={{ color: '#64748b', marginTop: '2px' }}>
                        📍 <b>Location:</b> {m.meetingLocation}
                      </div>
                    </div>

                    {/* Multi-session info if present */}
                    {m.sessions && m.sessions.length > 0 && (
                      <div style={{ fontSize: '11px', color: '#059669', marginBottom: '10px', fontWeight: 600 }}>
                        ⏱️ {m.sessions.length} visit session(s) recorded ({m.totalDurationMinutes || 0} mins logged)
                      </div>
                    )}

                    {/* Outcome if completed */}
                    {m.outcome && (
                      <div style={{ fontSize: '12px', color: '#4338ca', backgroundColor: '#eef2ff', padding: '6px 10px', borderRadius: '6px', marginBottom: '10px' }}>
                        🎯 <b>Outcome:</b> {m.outcome}
                        {m.outcomeNotes && <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{m.outcomeNotes}</div>}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    {m.status === 'SCHEDULED' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => onConfirm(m.id)}>
                        Confirm
                      </button>
                    )}

                    {(m.status === 'SCHEDULED' || m.status === 'CONFIRMED') && (
                      <button className="btn btn-primary btn-sm" onClick={() => onCheckIn(m)}>
                        <Play size={13} /> Check In (GPS)
                      </button>
                    )}

                    {m.status === 'CHECKED_IN' && (
                      <button className="btn btn-primary btn-sm" onClick={() => onStart(m.id)}>
                        Start Discussions
                      </button>
                    )}

                    {m.status === 'IN_PROGRESS' && (
                      <>
                        <button className="btn btn-secondary btn-sm" onClick={() => onPause(m)} title="Open-ended scenario: pause & return later">
                          <Pause size={13} /> Pause Visit
                        </button>
                        <button className="btn btn-success btn-sm" onClick={() => onComplete(m)}>
                          <CheckCircle size={13} /> Complete Visit
                        </button>
                      </>
                    )}

                    {m.status === 'PAUSED' && (
                      <button className="btn btn-primary btn-sm" onClick={() => onResume(m)} title="Resume visit later in day">
                        <Play size={13} /> Resume Visit
                      </button>
                    )}

                    {m.status === 'COMPLETED' && (isManager || isAdmin) && (
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => onReopen(m)}
                        title="Manager privilege: Reopen with mandatory audit log"
                      >
                        <RotateCcw size={13} /> Reopen (Manager)
                      </button>
                    )}

                    {m.auditLogs && m.auditLogs.length > 0 && (
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => onViewAudit(m.auditLogs)}
                        style={{ marginLeft: 'auto' }}
                      >
                        Audit ({m.auditLogs.length})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
