import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Video, 
  ExternalLink,
  Users,
  CheckCircle,
  Plus,
  Filter
} from 'lucide-react';

export default function CalendarScheduleView({
  currentUser,
  meetings = [],
  employees = [],
  onScheduleClick,
  onViewAudit
}) {
  const [selectedRep, setSelectedRep] = useState('ALL');
  const [selectedManager, setSelectedManager] = useState('ALL');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  const isManager = currentUser?.role === 'ROLE_SALES_MANAGER';
  const isEmployee = currentUser?.role === 'ROLE_SALES_EMPLOYEE';

  const managers = employees.filter(e => e.role === 'ROLE_SALES_MANAGER');
  const salesReps = employees.filter(e => {
    if (e.role !== 'ROLE_SALES_EMPLOYEE') return false;
    if (isManager && e.managerId && String(e.managerId) !== String(currentUser?.id)) {
      return false;
    }
    if (isAdmin && selectedManager !== 'ALL' && String(e.managerId) !== String(selectedManager)) {
      return false;
    }
    return true;
  });

  // Calculate days of current viewed week
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) + (currentWeekOffset * 7); // Monday
  startOfWeek.setDate(diff);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Filter meetings by selected manager and rep
  const filteredMeetings = meetings.filter(m => {
    if (isManager && m.assignedEmployeeManagerId && String(m.assignedEmployeeManagerId) !== String(currentUser?.id)) {
      return false;
    }
    if (isAdmin && selectedManager !== 'ALL') {
      if (String(m.assignedEmployeeManagerId) !== String(selectedManager)) return false;
    }
    if (selectedRep !== 'ALL') {
      if (String(m.assignedEmployeeId) !== String(selectedRep)) return false;
    }
    return true;
  });

  const getMeetingsForDay = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return filteredMeetings.filter(m => {
      if (!m.scheduledStartTime) return false;
      return m.scheduledStartTime.startsWith(dateStr);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return { bg: '#e0f2fe', text: '#0369a1' };
      case 'CONFIRMED': return { bg: '#ccfbf1', text: '#0f766e' };
      case 'CHECKED_IN': return { bg: '#fef3c7', text: '#b45309' };
      case 'IN_PROGRESS': return { bg: '#dcfce7', text: '#15803d' };
      case 'COMPLETED': return { bg: '#ede9fe', text: '#6d28d9' };
      case 'REOPENED': return { bg: '#fee2e2', text: '#b91c1c' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Calendar Header Controls */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid #eef2f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarIcon size={20} />
          </div>

          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Schedule & Virtual Google Meet Rooms ({filteredMeetings.length} Visits)
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b' }}>
              {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Week Prev / Next Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '12px' }}>
            <button
              onClick={() => setCurrentWeekOffset(prev => prev - 1)}
              style={{
                padding: '6px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentWeekOffset(0)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              This Week
            </button>
            <button
              onClick={() => setCurrentWeekOffset(prev => prev + 1)}
              style={{
                padding: '6px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Admin Manager Filter */}
          {isAdmin && (
            <select
              value={selectedManager}
              onChange={(e) => {
                setSelectedManager(e.target.value);
                setSelectedRep('ALL');
              }}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                outline: 'none',
                fontWeight: 500
              }}
            >
              <option value="ALL">All Managers</option>
              {managers.map(m => (
                <option key={m.id} value={m.id}>{m.name.split(' (')[0]}</option>
              ))}
            </select>
          )}

          {/* Rep filter for Manager and Admin */}
          {!isEmployee && (
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                outline: 'none',
                fontWeight: 500
              }}
            >
              <option value="ALL">All Team Reps ({meetings.length})</option>
              {salesReps.map(emp => {
                const count = meetings.filter(m => String(m.assignedEmployeeId) === String(emp.id)).length;
                return (
                  <option key={emp.id} value={emp.id}>
                    {emp.name.split(' (')[0]} ({count} visits)
                  </option>
                );
              })}
            </select>
          )}

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
              cursor: 'pointer'
            }}
          >
            <Plus size={15} />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* 7-Day Week Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '12px'
      }}>
        {weekDays.map((date, idx) => {
          const isCurrentDay = date.toDateString() === today.toDateString();
          const dayMeetings = getMeetingsForDay(date);

          return (
            <div
              key={idx}
              style={{
                backgroundColor: isCurrentDay ? '#f8fafc' : '#ffffff',
                borderRadius: '14px',
                border: isCurrentDay ? '2px solid #6366f1' : '1px solid #eef2f6',
                padding: '14px',
                minHeight: '260px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              {/* Day Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '10px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '10px'
              }}>
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isCurrentDay ? '#4f46e5' : '#64748b'
                  }}>
                    {date.toLocaleDateString(undefined, { weekday: 'short' })}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: isCurrentDay ? '#4f46e5' : '#0f172a'
                  }}>
                    {date.getDate()}
                  </div>
                </div>

                {dayMeetings.length > 0 && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    backgroundColor: '#e0e7ff',
                    color: '#4338ca',
                    padding: '2px 7px',
                    borderRadius: '9999px'
                  }}>
                    {dayMeetings.length}
                  </span>
                )}
              </div>

              {/* Meetings List for Day */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {dayMeetings.length === 0 ? (
                  <div style={{
                    fontSize: '11.5px',
                    color: '#cbd5e1',
                    textAlign: 'center',
                    marginTop: '20px'
                  }}>
                    No visits
                  </div>
                ) : (
                  dayMeetings.map((m) => {
                    const statusColor = getStatusColor(m.status);
                    const meetLink = m.meetingLink || 'https://meet.google.com/new';
                    const custName = m.customer?.companyName || m.customerName || 'Customer';

                    return (
                      <div
                        key={m.id}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: '4px',
                            backgroundColor: statusColor.bg,
                            color: statusColor.text
                          }}>
                            {m.status}
                          </span>
                          <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>
                            {new Date(m.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                          {custName}
                        </div>

                        <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.purpose}
                        </div>

                        {!isEmployee && (
                          <div style={{
                            fontSize: '10px',
                            color: '#4f46e5',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span>Rep: {m.assignedEmployeeName?.split(' (')[0]}</span>
                            {m.assignedEmployeeManagerName && (
                              <span style={{ color: '#94a3b8' }}>
                                (Mgr: {m.assignedEmployeeManagerName.split(' (')[0]})
                              </span>
                            )}
                          </div>
                        )}

                        {/* Google Meet Button */}
                        <a
                          href={meetLink}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            padding: '4px 6px',
                            backgroundColor: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            borderRadius: '6px',
                            color: '#065f46',
                            textDecoration: 'none',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            marginTop: '2px'
                          }}
                        >
                          <Video size={12} />
                          <span>Join Meet</span>
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
