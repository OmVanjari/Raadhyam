import React, { useState } from 'react';
import UserDashboardLayout from './UserDashboardLayout';
import UserDashboardHome from './UserDashboardHome';
import UserCoursesPage from './UserCoursesPage';
import UserEnrolledCoursesPage from './UserEnrolledCoursesPage';
import UserNotesPage from './UserNotesPage';
import UserProfilePage from './UserProfilePage';

const UserMain = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':     return <UserDashboardHome setActiveTab={setActiveTab} />;
      case 'enrolled': return <UserEnrolledCoursesPage setActiveTab={setActiveTab} />;
      case 'explore':  return <UserCoursesPage />;
      case 'notes':    return <UserNotesPage />;
      case 'profile':  return <UserProfilePage />;
      default:         return <UserDashboardHome setActiveTab={setActiveTab} />;
    }
  };

  return (
    <UserDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </UserDashboardLayout>
  );
};

export default UserMain;
