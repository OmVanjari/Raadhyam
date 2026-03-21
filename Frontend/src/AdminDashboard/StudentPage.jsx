import React from 'react';
import { Users } from 'lucide-react';

const StudentsPage = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
        <p className="text-gray-600">Manage student enrollments and progress</p>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <Users size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Students Management</h3>
      <p className="text-gray-600">Student management features coming soon</p>
    </div>
  </div>
);

export default StudentsPage;