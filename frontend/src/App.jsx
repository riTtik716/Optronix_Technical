import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import ExecutiveDashboardView from './components/ExecutiveDashboardView';
import MeetingLifecycleView from './components/MeetingLifecycleView';
import CalendarScheduleView from './components/CalendarScheduleView';
import UserManagementView from './components/UserManagementView';
import FollowUpsView from './components/FollowUpsView';
import CustomersView from './components/CustomersView';
import {
  ScheduleMeetingModal,
  CheckInModal,
  CompleteModal,
  ReopenModal,
  AuditLogsModal,
  AddUserModal,
  ChangePasswordModal,
  AddCustomerModal
} from './components/Modals';

const PRESET_ACCOUNTS = [
  { name: 'Alex Rivera (Sales Rep)', email: 'employee@optronix.com', pass: 'password123', role: 'ROLE_SALES_EMPLOYEE' },
  { name: 'Sarah Jenkins (Sales Manager)', email: 'manager@optronix.com', pass: 'password123', role: 'ROLE_SALES_MANAGER' },
  { name: 'Marcus Sterling (System Admin)', email: 'admin@optronix.com', pass: 'password123', role: 'ROLE_ADMIN' }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [showReopenModal, setShowReopenModal] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  // Track when user closes the browser tab / dashboard
  useEffect(() => {
    const handleBeforeUnload = () => {
      const token = api.getAccessToken();
      if (token) {
        navigator.sendBeacon('http://localhost:8080/api/auth/activity', JSON.stringify({
          activityType: 'DASHBOARD_CLOSED',
          details: 'User closed dashboard / browser window'
        }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const checkAuth = async () => {
    const token = api.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const user = await api.getMe();
      setCurrentUser(user);
      await loadInitialData(user);
    } catch {
      api.clearTokens();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      api.clearTokens();
    }
    setCurrentUser(null);
    setMeetings([]);
    setFollowUps([]);
    setActiveTab('dashboard');
  };

  const handleSwitchAccount = async (targetEmail) => {
    const acc = PRESET_ACCOUNTS.find(a => a.email === targetEmail);
    if (!acc) return;
    try {
      setLoading(true);
      const res = await api.login(acc.email, acc.pass);
      api.setTokens(res.accessToken, res.refreshToken);
      setCurrentUser(res.user);
      setActiveTab('dashboard');
      await loadInitialData(res.user);
    } catch (err) {
      alert('Failed to switch demo account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async (user = currentUser) => {
    if (!user) return;
    try {
      const [custList, empList, fuList, meetList] = await Promise.all([
        api.getCustomers().catch(() => []),
        api.getSalesEmployees().catch(() => []),
        api.getFollowUps().catch(() => []),
        api.getAllMeetings().catch(() => [])
      ]);
      setCustomers(custList);
      setEmployees(empList);
      setFollowUps(fuList);
      setMeetings(meetList);

      if (user.role === 'ROLE_ADMIN') {
        await loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAdminData = async () => {
    try {
      const [users, activities] = await Promise.all([
        api.getAllUsers().catch(() => []),
        api.getUserActivities().catch(() => [])
      ]);
      setAllUsers(users);
      setUserActivities(activities);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshMeetings = async () => {
    try {
      const updated = await api.getAllMeetings();
      setMeetings(updated);
      const updatedFu = await api.getFollowUps();
      setFollowUps(updatedFu);
    } catch (err) {
      console.error(err);
    }
  };

  // Schedule Meeting Handler
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await api.createMeeting({
        customerId: Number(form.customerId.value),
        purpose: form.purpose.value,
        scheduledStartTime: form.scheduledStartTime.value,
        scheduledEndTime: form.scheduledEndTime.value,
        locationAddress: form.locationAddress.value,
        meetingLink: form.meetingLink?.value || 'https://meet.google.com/new',
        assignedEmployeeId: Number(form.assignedEmployeeId.value),
        notes: form.notes.value
      });
      setShowScheduleModal(false);
      await refreshMeetings();
    } catch (err) {
      alert('Failed to schedule meeting: ' + err.message);
    }
  };

  // Confirm Meeting
  const handleConfirm = async (id) => {
    try {
      await api.confirmMeeting(id);
      await refreshMeetings();
    } catch (err) {
      alert(err.message);
    }
  };

  // Check In Submit
  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await api.checkIn(showCheckInModal.id, {
        latitude: Number(form.latitude.value),
        longitude: Number(form.longitude.value),
        locationName: form.locationName ? form.locationName.value : (showCheckInModal.targetLocation || 'On-site Office'),
        notes: form.notes.value
      });
      setShowCheckInModal(null);
      await refreshMeetings();
    } catch (err) {
      alert(err.message);
    }
  };

  // Start Meeting
  const handleStart = async (id) => {
    try {
      await api.startMeeting(id);
      await refreshMeetings();
    } catch (err) {
      alert(err.message);
    }
  };

  // Pause Meeting (Deliberately Open-Ended Scenario: returning later at 3:00 PM)
  const handlePause = async (meeting) => {
    const reason = prompt('Reason for pausing visit (e.g. Customer requested return at 3:00 PM):', 'Customer requested return at 3:00 PM');
    if (reason === null) return;
    try {
      await api.pauseMeeting(meeting.id, {
        notes: reason
      });
      await refreshMeetings();
    } catch (err) {
      alert(err.message);
    }
  };

  // Resume Meeting
  const handleResume = async (meeting) => {
    try {
      await api.resumeMeeting(meeting.id, {
        notes: 'Resumed meeting session on-site'
      });
      await refreshMeetings();
    } catch (err) {
      alert(err.message);
    }
  };

  // Complete Meeting
  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const outcome = form.outcome.value;
    const outcomeNotes = form.outcomeNotes.value;

    const req = {
      outcome,
      outcomeNotes
    };

    if (outcome === 'FOLLOW_UP_REQUIRED') {
      req.followUpActionItem = form.followUpActionItem.value;
      req.followUpDueDate = form.followUpDueDate.value;
    }

    try {
      await api.completeMeeting(showCompleteModal.id, req);
      setShowCompleteModal(null);
      await refreshMeetings();
    } catch (err) {
      alert(err.message);
    }
  };

  // Reopen Meeting (Manager / Admin)
  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    const reason = e.target.reason.value;
    try {
      await api.reopenMeeting(showReopenModal.id, reason);
      setShowReopenModal(null);
      await refreshMeetings();
    } catch (err) {
      alert(err.message);
    }
  };

  // View Audit Logs
  const handleViewAudit = async (meeting) => {
    try {
      const logs = await api.getAuditLogs(meeting.id);
      setShowAuditModal({ meeting, logs });
    } catch (err) {
      alert('Could not fetch audit logs: ' + err.message);
    }
  };

  // Admin Add User
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await api.createUser({
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
        role: form.role.value,
        managerId: form.managerId?.value ? Number(form.managerId.value) : null
      });
      alert('New user created successfully!');
      setShowAddUserModal(false);
      await loadAdminData();
      const updatedEmps = await api.getSalesEmployees();
      setEmployees(updatedEmps);
    } catch (err) {
      alert('Failed to create user: ' + err.message);
    }
  };

  // Admin Delete User
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${user.name} (${user.email})?`)) {
      return;
    }
    try {
      await api.deleteUser(user.id);
      alert('User deleted successfully.');
      await loadAdminData();
      const updatedEmps = await api.getSalesEmployees();
      setEmployees(updatedEmps);
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  // Admin Change Password
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const newPass = e.target.newPassword.value;
    try {
      await api.changeUserPassword(showChangePasswordModal.id, newPass);
      alert(`Password successfully changed for ${showChangePasswordModal.name}!`);
      setShowChangePasswordModal(null);
      await loadAdminData();
    } catch (err) {
      alert('Failed to change password: ' + err.message);
    }
  };

  // Add Customer
  const handleAddCustomerSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await api.createCustomer({
        companyName: form.companyName.value,
        contactPerson: form.contactPerson.value,
        contactEmail: form.contactEmail.value,
        contactPhone: form.contactPhone.value,
        address: form.address.value
      });
      setShowAddCustomerModal(false);
      const updated = await api.getCustomers();
      setCustomers(updated);
    } catch (err) {
      alert('Failed to add customer: ' + err.message);
    }
  };

  // Complete Follow Up
  const handleCompleteFollowUp = async (id) => {
    try {
      await api.completeFollowUp(id);
      const updated = await api.getFollowUps();
      setFollowUps(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter meetings by search query
  const searchedMeetings = meetings.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.customerName?.toLowerCase().includes(q) ||
      m.purpose?.toLowerCase().includes(q) ||
      m.assignedEmployeeName?.toLowerCase().includes(q) ||
      m.locationAddress?.toLowerCase().includes(q)
    );
  });

  if (loading && !currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0e1120',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #6366f1',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 14px auto'
          }}></div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Loading Optronix Console...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={async (user) => {
          setCurrentUser(user);
          await loadInitialData(user);
        }}
      />
    );
  }

  const pendingFollowUpsCount = followUps.filter(f => f.status === 'PENDING').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f8' }}>
      
      {/* 1. Left Dark Sidebar (Rentellor Inspired) */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onSwitchAccount={handleSwitchAccount}
        presetAccounts={PRESET_ACCOUNTS}
        pendingFollowUpsCount={pendingFollowUpsCount}
      />

      {/* 2. Right Main Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto', maxHeight: '100vh' }}>
        
        {/* Top Header Bar */}
        <TopHeader
          activeTab={activeTab}
          currentUser={currentUser}
          onScheduleClick={() => setShowScheduleModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Content Views */}
        <main style={{ padding: '28px', maxWidth: '1400px', width: '100%', boxSizing: 'border-box' }}>
          
          {activeTab === 'dashboard' && (
            <ExecutiveDashboardView
              currentUser={currentUser}
              meetings={searchedMeetings}
              followUps={followUps}
              customers={customers}
              employees={employees}
              onScheduleClick={() => setShowScheduleModal(true)}
              onAddCustomerClick={() => setShowAddCustomerModal(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onCheckIn={(meeting) => setShowCheckInModal(meeting)}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onComplete={(meeting) => setShowCompleteModal(meeting)}
              onViewAudit={handleViewAudit}
            />
          )}

          {activeTab === 'meetings' && (
            <MeetingLifecycleView
              currentUser={currentUser}
              meetings={searchedMeetings}
              employees={employees}
              onConfirm={handleConfirm}
              onCheckIn={(meeting) => setShowCheckInModal(meeting)}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onComplete={(meeting) => setShowCompleteModal(meeting)}
              onReopen={(meeting) => setShowReopenModal(meeting)}
              onViewAudit={handleViewAudit}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarScheduleView
              currentUser={currentUser}
              meetings={searchedMeetings}
              employees={employees}
              onScheduleClick={() => setShowScheduleModal(true)}
              onViewAudit={handleViewAudit}
            />
          )}

          {activeTab === 'users' && currentUser?.role === 'ROLE_ADMIN' && (
            <UserManagementView
              allUsers={allUsers}
              userActivities={userActivities}
              onOpenAddUser={() => setShowAddUserModal(true)}
              onOpenChangePassword={(user) => setShowChangePasswordModal(user)}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'followups' && (
            <FollowUpsView
              currentUser={currentUser}
              followUps={followUps}
              onCompleteFollowUp={handleCompleteFollowUp}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              onOpenAddCustomer={() => setShowAddCustomerModal(true)}
            />
          )}

        </main>
      </div>

      {/* 3. Modals */}
      <ScheduleMeetingModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSubmit={handleScheduleSubmit}
        customers={customers}
        employees={employees}
        currentUser={currentUser}
      />

      <CheckInModal
        meeting={showCheckInModal}
        onClose={() => setShowCheckInModal(null)}
        onSubmit={handleCheckInSubmit}
      />

      <CompleteModal
        meeting={showCompleteModal}
        onClose={() => setShowCompleteModal(null)}
        onSubmit={handleCompleteSubmit}
      />

      <ReopenModal
        meeting={showReopenModal}
        onClose={() => setShowReopenModal(null)}
        onSubmit={handleReopenSubmit}
      />

      <AuditLogsModal
        meeting={showAuditModal?.meeting}
        auditLogs={showAuditModal?.logs || []}
        onClose={() => setShowAuditModal(null)}
      />

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUserSubmit}
        managers={employees.filter(e => e.role === 'ROLE_SALES_MANAGER')}
      />

      <ChangePasswordModal
        user={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(null)}
        onSubmit={handleChangePasswordSubmit}
      />

      <AddCustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onSubmit={handleAddCustomerSubmit}
      />

    </div>
  );
}
