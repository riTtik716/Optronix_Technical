import React from 'react';
import { CheckSquare, Clock, AlertCircle, CheckCircle, Calendar, User } from 'lucide-react';

export default function FollowUpsView({
  currentUser,
  followUps = [],
  onCompleteFollowUp
}) {
  const isEmployee = currentUser?.role === 'ROLE_SALES_EMPLOYEE';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid #eef2f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckSquare size={18} />
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Mandatory Follow-Up Tasks ({followUps.length})
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Action items automatically assigned when a visit concludes with outcome: "Follow-up required".
          </p>
        </div>
      </div>

      {/* Follow-Ups Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #eef2f6',
        padding: '22px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {followUps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
            <CheckCircle size={36} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
            <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>All caught up!</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>No pending follow-ups required at this moment.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Action Item</th>
                  <th style={{ padding: '10px 12px' }}>Customer & Meeting</th>
                  <th style={{ padding: '10px 12px' }}>Due Date</th>
                  {!isEmployee && <th style={{ padding: '10px 12px' }}>Owner</th>}
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((fu) => (
                  <tr key={fu.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 600, color: '#0f172a' }}>
                      {fu.actionItem}
                    </td>

                    <td style={{ padding: '14px 12px', color: '#475569' }}>
                      <div>{fu.customerName || 'Customer Account'}</div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Meeting #{fu.meetingId}</div>
                    </td>

                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 600 }}>
                        <Clock size={13} />
                        <span>{fu.dueDate}</span>
                      </div>
                    </td>

                    {!isEmployee && (
                      <td style={{ padding: '14px 12px', color: '#334155' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={13} color="#64748b" />
                          <span>{fu.ownerName || 'Sales Rep'}</span>
                        </div>
                      </td>
                    )}

                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: fu.status === 'COMPLETED' ? '#ecfdf5' : '#fef3c7',
                        color: fu.status === 'COMPLETED' ? '#047857' : '#b45309',
                        border: `1px solid ${fu.status === 'COMPLETED' ? '#a7f3d0' : '#fde68a'}`
                      }}>
                        {fu.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      {fu.status !== 'COMPLETED' && (
                        <button
                          onClick={() => onCompleteFollowUp(fu.id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#16a34a',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Mark Done
                        </button>
                      )}
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
