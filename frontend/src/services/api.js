const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const CLOUDFLARE_BACKEND = 'https://luxury-spouse-pod-cafe.trycloudflare.com/api';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (isLocalhost ? 'http://localhost:8080/api' : CLOUDFLARE_BACKEND);

class ApiService {
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async request(endpoint, options = {}) {
    let token = this.getAccessToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token expiration & automatic refresh
    if (response.status === 401 && this.getRefreshToken()) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
        response = await fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        this.clearTokens();
        window.location.reload();
      }
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || 'API error');
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        this.setTokens(data.accessToken, data.refreshToken);
        return true;
      }
    } catch {
      // refresh failed
    }
    return false;
  }

  // Auth APIs
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  logout() {
    return this.request('/auth/logout', { method: 'POST' })
      .finally(() => this.clearTokens());
  }

  getMe() {
    return this.request('/auth/me');
  }

  getSalesEmployees() {
    return this.request('/auth/sales-employees');
  }

  // Admin APIs: User Management & Session Timestamps
  getAllUsers() {
    return this.request('/auth/users');
  }

  createUser(data) {
    return this.request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  deleteUser(userId) {
    return this.request(`/auth/users/${userId}`, {
      method: 'DELETE',
    });
  }

  changeUserPassword(userId, newPassword) {
    return this.request(`/auth/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
  }

  getUserActivities() {
    return this.request('/auth/activities');
  }

  logActivity(activityType, details) {
    return this.request('/auth/activity', {
      method: 'POST',
      body: JSON.stringify({ activityType, details }),
    });
  }

  // Customers
  getCustomers() {
    return this.request('/customers');
  }

  createCustomer(data) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Meetings
  getMyMeetings() {
    return this.request('/meetings');
  }

  getTeamMeetings() {
    return this.request('/meetings');
  }

  getAllMeetings() {
    return this.request('/meetings');
  }

  getMeetingById(id) {
    return this.request(`/meetings/${id}`);
  }

  createMeeting(data) {
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  confirmMeeting(id) {
    return this.request(`/meetings/${id}/confirm`, { method: 'PATCH' });
  }

  checkIn(id, data) {
    return this.request(`/meetings/${id}/check-in`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  startMeeting(id) {
    return this.request(`/meetings/${id}/start`, { method: 'PATCH' });
  }

  pauseMeeting(id, data) {
    return this.request(`/meetings/${id}/pause`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  resumeMeeting(id, data) {
    return this.request(`/meetings/${id}/resume`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  completeMeeting(id, data) {
    return this.request(`/meetings/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  reopenMeeting(id, reason) {
    return this.request(`/meetings/${id}/reopen`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  getAuditLogs(id) {
    return this.request(`/meetings/${id}/audit-logs`);
  }

  // Follow-ups
  getFollowUps(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/follow-ups${query ? '?' + query : ''}`);
  }

  completeFollowUp(id) {
    return this.request(`/follow-ups/${id}/complete`, { method: 'PATCH' });
  }
}

export const api = new ApiService();
