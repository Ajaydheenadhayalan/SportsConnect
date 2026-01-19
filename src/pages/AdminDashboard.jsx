import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats, getUsers, updateUser, deleteUser, exportUsers, adminLogout, getAdminToken } from '../services/adminService';
import StatsCard from '../components/Admin/StatsCard';
import UserDetailsModal from '../components/Admin/UserDetailsModal';
import styles from '../components/Admin/Admin.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in (check cookies first, then localStorage)
    const adminToken = getAdminToken();
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    loadDashboardData();
  }, [navigate, currentPage, searchTerm, statusFilter]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsData = await getStats();
      setStats(statsData);

      // Load users
      const usersData = await getUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      setUsers(usersData.users);
      setTotalPages(usersData.pagination.pages);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      if (error.message.includes('token') || error.message.includes('auth')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await updateUser(userId, updates);
      setSelectedUser(null);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setSelectedUser(null);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user: ' + error.message);
    }
  };

  const handleExport = async (format) => {
    try {
      await exportUsers(format);
    } catch (error) {
      console.error('Failed to export users:', error);
      alert('Failed to export users: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isUserOnline = (lastLogin) => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return new Date(lastLogin) >= fifteenMinutesAgo;
  };

  if (loading && !stats) {
    return (
      <div className={styles.adminDashboard}>
        <div className={styles.loading}>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.dashboardContainer}>
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.headerTitle}>Admin Dashboard</h1>
            <p className={styles.headerSubtitle}>SportsConnect Platform Management</p>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className={styles.statsGrid}>
            <StatsCard
              label="Total Users"
              value={stats.totalUsers}
              icon="users"
              trend={stats.newUsersThisWeek > 0 ? { text: `+${stats.newUsersThisWeek} this week`, isNegative: false } : null}
            />
            <StatsCard
              label="Active Users"
              value={stats.activeUsers}
              icon="check"
            />
            <StatsCard
              label="Online Now"
              value={stats.onlineUsers}
              icon="online"
            />
            <StatsCard
              label="New Today"
              value={stats.newUsersToday}
              icon="new"
            />
          </div>
        )}

        {/* User Table */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>User Management</h2>
            <div className={styles.tableControls}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="online">Online Now</option>
              </select>
              <button
                className={styles.exportButton}
                onClick={() => handleExport('csv')}
              >
                Export CSV
              </button>
              <button
                className={styles.exportButton}
                onClick={() => handleExport('json')}
              >
                Export JSON
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading users...</div>
          ) : users.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No users found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {getInitials(user.fullName)}
                          </div>
                          <div className={styles.userDetails}>
                            <div className={styles.userName}>{user.fullName}</div>
                            <div className={styles.userEmail}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>@{user.username}</td>
                      <td>
                        <span className={`${styles.badge} ${user.isActive ? styles.active : styles.inactive}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {isUserOnline(user.lastLogin) && (
                          <span className={`${styles.badge} ${styles.online}`} style={{ marginLeft: '8px' }}>
                            Online
                          </span>
                        )}
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleViewUser(user)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageButton}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  
                  <span className={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    className={styles.pageButton}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
