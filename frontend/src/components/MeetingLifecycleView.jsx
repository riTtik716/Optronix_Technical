import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  ExternalLink, 
  Play, 
  Pause, 
  RotateCcw, 
  History, 
  AlertCircle, 
  ArrowRight,
  Filter,
  CheckSquare,
  Building2,
  X
} from 'lucide-react';

export default function MeetingLifecycleView({
  currentUser,
  meetings = [],
  employees = [],
  onConfirm,
  onCheckIn,
  onStart,
  onPause,
  onResume,
  onComplete,
  onReopen,
  onViewAudit
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [managerFilter, setManagerFilter] = useState('ALL');
  const [employeeFilter, setEmployeeFilter] = useState('ALL');

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  const isManager = currentUser?.role === 'ROLE_SALES_MANAGER';
  const isEmployee = currentUser?.role === 'ROLE_SALES_EMPLOYEE';

  const managers = employees.filter(e => e.role === 'ROLE_SALES_MANAGER');
  const salesReps = employees.filter(e => {
    if (e.role !== 'ROLE_SALES_EMPLOYEE') return false;
    if (isManager && e.managerId && String(e.managerId) !== String(currentUser?.id)) {
      return false;
    }
    if (isAdmin && managerFilter !== 'ALL' && String(e.managerId) !== String(managerFilter)) {
      return false;
    }
    return true;
  });

  const filteredMeetings = meetings.filter(m => {
    // Status filter
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;

    // Manager role constraint
    if (isManager && m.assignedEmployeeManagerId && String(m.assignedEmployeeManagerId) !== String(currentUser?.id)) {
      return false;
    }
    // Admin manager filter
    if (isAdmin && managerFilter !== 'ALL') {
      if (String(m.assignedEmployeeManagerId) !== String(managerFilter)) return false;
    }

    // Rep filter
    if (employeeFilter !== 'ALL' && String(m.assignedEmployeeId) !== String(employeeFilter)) {
      return false;
    }

    return true;
  });

  const getStatusStyle = (status) => {
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

  const statusCounts = {
    ALL: meetings.length,
    SCHEDULED: meetings.filter(m => m.status === 'SCHEDULED').length,
    CONFIRMED: meetings.filter(m => m.status === 'CONFIRMED').length,
    CHECKED_IN: meetings.filter(m => m.status === 'CHECKED_IN').length,
    IN_PROGRESS: meetings.filter(m => m.status === 'IN_PROGRESS').length,
    COMPLETED: meetings.filter(m => m.status === 'COMPLETED').length,
    REOPENED: meetings.filter(m => m.status === 'REOPENED').length
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Header Filters Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '18px 24px',
        border: '1px solid #eef2f6',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {/* Top: Status Tabs with Counts */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Statuses', count: statusCounts.ALL },
              { id: 'SCHEDULED', label: 'Scheduled', count: statusCounts.SCHEDULED },
              { id: 'CONFIRMED', label: 'Confirmed', count: statusCounts.CONFIRMED },
              { id: 'CHECKED_IN', label: 'Checked In', count: statusCounts.CHECKED_IN },
              { id: 'IN_PROGRESS', label: 'In Progress', count: statusCounts.IN_PROGRESS },
              { id: 'COMPLETED', label: 'Completed', count: statusCounts.COMPLETED },
              { id: 'REOPENED', label: 'Reopened', count: statusCounts.REOPENED }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: statusFilter === s.id ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                  backgroundColor: statusFilter === s.id ? '#4f46e5' : '#ffffff',
                  color: statusFilter === s.id ? '#ffffff' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{s.label}</span>
                <span style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '9999px',
                  backgroundColor: statusFilter === s.id ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: statusFilter === s.id ? '#ffffff' : '#475569'
                }}>
                  {s.count}
                </span>
              </button>
            ))}
          </div>

          {/* Admin Manager Filter */}
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Manager:</span>
              <select
                value={managerFilter}
                onChange={(e) => {
                  setManagerFilter(e.target.value);
                  setEmployeeFilter('ALL');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '12px',
                  fontWeight: 500,
                  outline: 'none'
                }}
              >
                <option value="ALL">All Managers</option>
                {managers.map(m => (
                  <option key={m.id} value={m.id}>{m.name.split(' (')[0]}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Bottom: Rep Filter Pills (Manager & Admin) */}
        {!isEmployee && salesReps.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '10px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Sales Rep:
            </span>

            <button
              onClick={() => setEmployeeFilter('ALL')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: employeeFilter === 'ALL' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                backgroundColor: employeeFilter === 'ALL' ? '#eff6ff' : '#ffffff',
                color: employeeFilter === 'ALL' ? '#1d4ed8' : '#64748b',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Reps ({meetings.length})
            </button>

            {salesReps.map((rep) => {
              const count = meetings.filter(m => String(m.assignedEmployeeId) === String(rep.id)).length;
              const isSelected = String(employeeFilter) === String(rep.id);

              return (
                <button
                  key={rep.id}
                  onClick={() => setEmployeeFilter(String(rep.id))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#4f46e5' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span>{rep.name.split(' (')[0]}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '1px 5px',
                    borderRadius: '9999px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#0f172a'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Meetings Cards Grid */}
      {filteredMeetings.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #eef2f6',
          padding: '48px 24px',
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          <Calendar size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>
            No meetings found for this filter criteria.
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
            Try resetting the rep or status filter above.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '18px'
        }}>
          {filteredMeetings.map((meeting) => {
            const statusStyle = getStatusStyle(meeting.status);
            const isAssigned = String(meeting.assignedEmployeeId) === String(currentUser?.id);
            const canOperate = isAssigned || isManager || isAdmin;
            const meetLink = meeting.meetingLink || 'https://meet.google.com/new';
            const custName = meeting.customer?.companyName || meeting.customerName || 'Customer';
            const contactPerson = meeting.customer?.contactPerson;

            return (
              <div
                key={meeting.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #eef2f6',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                {/* Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
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

                    {/* Google Meet Button */}
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        backgroundColor: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#065f46',
                        textDecoration: 'none',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      <Video size={13} />
                      <span>Join Google Meet</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 3px 0' }}>
                    {custName}
                  </h3>
                  {contactPerson && (
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '4px' }}>
                      Contact: {contactPerson}
                    </div>
                  )}
                  <p style={{ fontSize: '13px', color: '#334155', margin: 0, fontWeight: 500 }}>
                    {meeting.purpose}
                  </p>
                </div>

                {/* Details Section */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '12.5px',
                  color: '#475569',
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="#94a3b8" />
                    <span>
                      {new Date(meeting.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.scheduledEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="#94a3b8" />
                    <span>{meeting.meetingLocation || meeting.locationAddress || 'Client Site'}</span>
                  </div>

                  {/* Representative & Manager Info */}
                  {!isEmployee && (
                    <div style={{
                      marginTop: '4px',
                      paddingTop: '6px',
                      borderTop: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={13} color="#4f46e5" />
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                          Rep: {meeting.assignedEmployeeName?.split(' (')[0]}
                        </span>
                      </div>
                      {meeting.assignedEmployeeManagerName && (
                        <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600 }}>
                          Mgr: {meeting.assignedEmployeeManagerName.split(' (')[0]}
                        </span>
                      )}
                    </div>
                  )}

                  {meeting.outcome && (
                    <div style={{
                      marginTop: '4px',
                      paddingTop: '6px',
                      borderTop: '1px solid #e2e8f0',
                      fontSize: '12px'
                    }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>Outcome: </span>
                      <span style={{ color: '#4f46e5', fontWeight: 700 }}>{meeting.outcome}</span>
                      {meeting.outcomeNotes && (
                        <div style={{ fontSize: '11.5px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                          "{meeting.outcomeNotes}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Lifecycle Action Buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid #f1f5f9',
                  gap: '6px'
                }}>
                  <button
                    onClick={() => onViewAudit(meeting)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 9px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <History size={13} />
                    <span>Audit</span>
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {/* SCHEDULED -> Confirm */}
                    {meeting.status === 'SCHEDULED' && canOperate && (
                      <button
                        onClick={() => onConfirm(meeting.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#0d9488',
                          color: '#ffffff',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Confirm Visit
                      </button>
                    )}

                    {/* CONFIRMED -> Check In */}
                    {meeting.status === 'CONFIRMED' && canOperate && (
                      <button
                        onClick={() => onCheckIn(meeting)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#d97706',
                          color: '#ffffff',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <MapPin size={13} />
                        <span>Check In (GPS)</span>
                      </button>
                    )}

                    {/* CHECKED_IN -> Start */}
                    {meeting.status === 'CHECKED_IN' && canOperate && (
                      <button
                        onClick={() => onStart(meeting.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Play size={13} />
                        <span>Start Meeting</span>
                      </button>
                    )}

                    {/* IN_PROGRESS -> Pause & Complete */}
                    {meeting.status === 'IN_PROGRESS' && canOperate && (
                      <>
                        <button
                          onClick={() => onPause(meeting)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #fde68a',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Pause size={13} />
                          <span>Pause</span>
                        </button>

                        <button
                          onClick={() => onComplete(meeting)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#4f46e5',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <CheckCircle size={13} />
                          <span>Complete</span>
                        </button>
                      </>
                    )}

                    {/* REOPEN for Sales Manager & Admin */}
                    {meeting.status === 'COMPLETED' && (isManager || isAdmin) && (
                      <button
                        onClick={() => onReopen(meeting)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          backgroundColor: '#fff1f2',
                          color: '#e11d48',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <RotateCcw size={12} />
                        <span>Reopen Visit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
