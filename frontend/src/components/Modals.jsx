import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Video, 
  AlertCircle, 
  History, 
  UserPlus, 
  Key, 
  Building2, 
  CheckCircle,
  RotateCcw
} from 'lucide-react';

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSubmit,
  customers = [],
  employees = [],
  currentUser
}) {
  const [meetingType, setMeetingType] = useState('PHYSICAL');
  const [googleMeetLink, setGoogleMeetLink] = useState('https://meet.google.com/new');
  const isEmployee = currentUser?.role === 'ROLE_SALES_EMPLOYEE';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div className="modal-title">Schedule New Client Visit</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Customer / Account *</label>
            <select name="customerId" className="form-select" required>
              <option value="">Select Customer Account</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.companyName} (Contact: {c.contactPerson})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Meeting Purpose *</label>
            <input 
              name="purpose" 
              className="form-input" 
              required 
              placeholder="e.g., Enterprise Platform Product Demo & Security Review" 
            />
          </div>

          {/* Meeting Format Toggle: Physical or Virtual */}
          <div className="form-group">
            <label className="form-label">Meeting Format & Google Meet</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setMeetingType('PHYSICAL')}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: meetingType === 'PHYSICAL' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                  backgroundColor: meetingType === 'PHYSICAL' ? '#eff6ff' : '#ffffff',
                  color: meetingType === 'PHYSICAL' ? '#1d4ed8' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                In-Person Visit
              </button>
              <button
                type="button"
                onClick={() => setMeetingType('VIRTUAL')}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: meetingType === 'VIRTUAL' ? '1px solid #10b981' : '1px solid #cbd5e1',
                  backgroundColor: meetingType === 'VIRTUAL' ? '#ecfdf5' : '#ffffff',
                  color: meetingType === 'VIRTUAL' ? '#047857' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Google Meet / Virtual
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Video size={14} color="#10b981" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                name="meetingLink"
                type="url"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px' }}
                placeholder="Google Meet Link (e.g. https://meet.google.com/abc-defg-hij)"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Start Time *</label>
              <input 
                name="scheduledStartTime" 
                type="datetime-local" 
                className="form-input" 
                required 
                defaultValue={new Date(Date.now() + 3600000).toISOString().slice(0, 16)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time *</label>
              <input 
                name="scheduledEndTime" 
                type="datetime-local" 
                className="form-input" 
                required 
                defaultValue={new Date(Date.now() + 7200000).toISOString().slice(0, 16)} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Meeting Location / Physical Address *</label>
            <input 
              name="locationAddress" 
              className="form-input" 
              required 
              placeholder="e.g. Customer Headquarters, Tech Park, Tower B" 
              defaultValue={meetingType === 'VIRTUAL' ? 'Virtual / Google Meet' : ''} 
            />
          </div>

          {/* Assigned Rep: Hidden if Sales Rep (strictly assigned to self), visible for Manager/Admin */}
          {!isEmployee ? (
            <div className="form-group">
              <label className="form-label">Assigned Sales Employee *</label>
              <select name="assignedEmployeeId" className="form-select" required defaultValue={currentUser?.id}>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>
          ) : (
            <input type="hidden" name="assignedEmployeeId" value={currentUser?.id} />
          )}

          <div className="form-group">
            <label className="form-label">Pre-meeting Notes</label>
            <textarea 
              name="notes" 
              className="form-textarea" 
              rows={2} 
              placeholder="Key agendas, customer requirements, demo prep..." 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule Meeting</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CheckInModal({
  meeting,
  onClose,
  onSubmit
}) {
  const [lat, setLat] = useState('37.7749');
  const [lng, setLng] = useState('-122.4194');
  const [locating, setLocating] = useState(false);

  if (!meeting) return null;

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(6));
          setLng(pos.coords.longitude.toFixed(6));
          setLocating(false);
        },
        () => {
          setLocating(false);
          alert('Could not automatically determine location. Using default coordinates.');
        }
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">GPS Geolocation Check-In</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={onSubmit}>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
            Checking in for: <b>{meeting.purpose}</b> with <b>{meeting.customerName}</b>
          </p>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Live Device Geolocation</span>
              <button 
                type="button" 
                onClick={handleDetectLocation} 
                style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                {locating ? 'Locating...' : 'Detect Coordinates'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Latitude</label>
                <input name="latitude" className="form-input" value={lat} onChange={e => setLat(e.target.value)} required />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Longitude</label>
                <input name="longitude" className="form-input" value={lng} onChange={e => setLng(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Check-in Location / Venue Name</label>
            <input 
              name="locationName" 
              className="form-input" 
              placeholder="e.g. Client Office, Tower B, Gurugram" 
              defaultValue={meeting.targetLocation || (meeting.customerName ? `${meeting.customerName} Office` : 'Client Office')} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Check-in Notes</label>
            <input name="notes" className="form-input" placeholder="e.g. Arrived on-site at client reception" defaultValue="Arrived on-site at customer office" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#d97706' }}>
              Confirm Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CompleteModal({
  meeting,
  onClose,
  onSubmit
}) {
  const [selectedOutcome, setSelectedOutcome] = useState('INTERESTED');

  if (!meeting) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Record Meeting Outcome & Check-Out</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={onSubmit}>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
            Completing: <b>{meeting.purpose}</b> with <b>{meeting.customerName}</b>
          </p>

          <div className="form-group">
            <label className="form-label">Meeting Outcome *</label>
            <select 
              name="outcome" 
              className="form-select" 
              value={selectedOutcome} 
              onChange={e => setSelectedOutcome(e.target.value)}
              required
            >
              <option value="INTERESTED">Interested</option>
              <option value="FOLLOW_UP_REQUIRED">Follow-up required</option>
              <option value="PROPOSAL_REQUESTED">Proposal requested</option>
              <option value="NOT_INTERESTED">Not interested</option>
              <option value="UNABLE_TO_MEET">Unable to meet</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Outcome Notes / Key Discussion Summary</label>
            <textarea name="outcomeNotes" className="form-textarea" rows={2} placeholder="Customer requirements, agreed next steps..." />
          </div>

          {/* Conditional Mandatory Follow-up if Outcome is FOLLOW_UP_REQUIRED */}
          {selectedOutcome === 'FOLLOW_UP_REQUIRED' && (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '14px', borderRadius: '8px', margin: '14px 0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#92400e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={16} /> Mandatory Follow-Up Action Required
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#92400e' }}>Action Item *</label>
                <input 
                  name="followUpActionItem" 
                  className="form-input" 
                  required 
                  placeholder="e.g., Deliver customized quote and implementation plan" 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#92400e' }}>Due Date *</label>
                <input 
                  name="followUpDueDate" 
                  type="date" 
                  className="form-input" 
                  required 
                  defaultValue={new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)} 
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success">Complete & Record Outcome</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ReopenModal({
  meeting,
  onClose,
  onSubmit
}) {
  if (!meeting) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Manager: Reopen Completed Meeting</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ background: '#fff1f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', marginBottom: '14px' }}>
            <div style={{ fontSize: '12.5px', color: '#991b1b', fontWeight: 600 }}>
              Manager Privilege: Reopening allows additional sessions or modified outcome logging.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mandatory Reason for Reopening *</label>
            <textarea 
              name="reason" 
              className="form-textarea" 
              rows={3} 
              required 
              placeholder="e.g. Customer called back to continue proposal review; reopening for second session." 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger">Reopen Meeting</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AuditLogsModal({
  meeting,
  auditLogs = [],
  onClose
}) {
  if (!meeting) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="#4f46e5" />
            <div className="modal-title">Meeting #{meeting.id} Audit Timeline</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          Customer: <b>{meeting.customerName}</b> | Purpose: <b>{meeting.purpose}</b>
        </div>

        {auditLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
            No audit history found for this meeting.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
            {auditLogs.map((log) => (
              <div 
                key={log.id} 
                style={{
                  borderLeft: '3px solid #6366f1',
                  paddingLeft: '12px',
                  backgroundColor: '#f8fafc',
                  padding: '10px 12px',
                  borderRadius: '0 8px 8px 0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#e0e7ff',
                    color: '#4338ca'
                  }}>
                    {log.action}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '4px' }}>
                  <b>State:</b> {log.oldStatus || 'NONE'} → <b>{log.newStatus}</b>
                </div>

                {log.details && (
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                    {log.details}
                  </div>
                )}

                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  Triggered by: {log.performedByEmail || 'System'}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
  managers = []
}) {
  const [selectedRole, setSelectedRole] = useState('ROLE_SALES_EMPLOYEE');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Admin: Provision New User Account</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input name="name" className="form-input" required placeholder="e.g. David Miller" />
          </div>

          <div className="form-group">
            <label className="form-label">Work Email Address *</label>
            <input name="email" type="email" className="form-input" required placeholder="e.g. david.miller@optronix.com" />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Password (Minimum 6 characters) *</label>
            <input name="password" type="password" className="form-input" required minLength={6} placeholder="Enter initial password" />
          </div>

          <div className="form-group">
            <label className="form-label">Role Assignment *</label>
            <select 
              name="role" 
              className="form-select" 
              required 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="ROLE_SALES_EMPLOYEE">Sales Representative (Employee)</option>
              <option value="ROLE_SALES_MANAGER">Sales Manager</option>
              <option value="ROLE_ADMIN">System Administrator</option>
            </select>
          </div>

          {selectedRole === 'ROLE_SALES_EMPLOYEE' && managers.length > 0 && (
            <div className="form-group">
              <label className="form-label">Assign Reporting Manager</label>
              <select name="managerId" className="form-select">
                <option value="">Select Reporting Manager (Optional)</option>
                {managers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create User</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ChangePasswordModal({
  user,
  onClose,
  onSubmit
}) {
  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Admin: Change Salesperson Password</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={onSubmit}>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
            Resetting password for: <b>{user.name}</b> ({user.email})
          </p>

          <div className="form-group">
            <label className="form-label">New Password (Minimum 6 characters) *</label>
            <input 
              name="newPassword" 
              type="password" 
              required 
              minLength={6} 
              className="form-input" 
              placeholder="Enter new strong password" 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddCustomerModal({
  isOpen,
  onClose,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Register New Customer Account</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input name="companyName" className="form-input" required placeholder="e.g. Apex BioTech Corp" />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Person *</label>
            <input name="contactPerson" className="form-input" required placeholder="e.g. Jennifer Walsh" />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Email *</label>
            <input name="contactEmail" type="email" className="form-input" required placeholder="jennifer@apexbio.com" />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input name="contactPhone" className="form-input" placeholder="+1 (555) 345-6789" />
          </div>

          <div className="form-group">
            <label className="form-label">Headquarters / Office Address *</label>
            <input name="address" className="form-input" required placeholder="120 Innovation Way, Suite 400" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
