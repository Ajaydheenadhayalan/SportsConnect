import React from 'react';
import styles from './Admin.module.css';

const UserDetailsModal = ({ user, onClose, onUpdate, onDelete }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleActive = async () => {
    if (onUpdate) {
      await onUpdate(user._id, { isActive: !user.isActive });
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      if (onDelete) {
        await onDelete(user._id);
      }
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>User Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Full Name</span>
            <span className={styles.detailValue}>{user.fullName}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Username</span>
            <span className={styles.detailValue}>@{user.username}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Email</span>
            <span className={styles.detailValue}>{user.email}</span>
          </div>

          {user.phone && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Phone</span>
              <span className={styles.detailValue}>{user.phone}</span>
            </div>
          )}

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Status</span>
            <span className={styles.detailValue}>
              <span className={`${styles.badge} ${user.isActive ? styles.active : styles.inactive}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </span>
          </div>

          {user.location && (user.location.city || user.location.state) && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Location</span>
              <span className={styles.detailValue}>
                {[user.location.city, user.location.state, user.location.country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}

          {user.sports && user.sports.length > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Sports</span>
              <span className={styles.detailValue}>{user.sports.join(', ')}</span>
            </div>
          )}

          {user.bio && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Bio</span>
              <span className={styles.detailValue}>{user.bio}</span>
            </div>
          )}

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Joined</span>
            <span className={styles.detailValue}>{formatDate(user.createdAt)}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Last Login</span>
            <span className={styles.detailValue}>{formatDate(user.lastLogin)}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>User ID</span>
            <span className={styles.detailValue} style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              {user._id}
            </span>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              className={styles.actionButton}
              onClick={handleToggleActive}
            >
              {user.isActive ? 'Deactivate' : 'Activate'} Account
            </button>
            <button
              className={`${styles.actionButton} ${styles.danger}`}
              onClick={handleDelete}
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
