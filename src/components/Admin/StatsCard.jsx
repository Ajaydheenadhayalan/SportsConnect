import React from 'react';
import styles from './Admin.module.css';

const StatsCard = ({ label, value, icon, trend }) => {
  const getIcon = () => {
    switch(icon) {
      case 'users':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'check':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'online':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        );
      case 'new':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      default:
        return icon;
    }
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div>
          <div className={styles.statLabel}>{label}</div>
        </div>
        <div className={styles.statIcon}>
          {getIcon()}
        </div>
      </div>
      <div className={styles.statValue}>{value}</div>
      {trend && (
        <div className={`${styles.statTrend} ${trend.isNegative ? styles.negative : ''}`}>
          {trend.isNegative ? '↓' : '↑'} {trend.text}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
