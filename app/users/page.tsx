'use client';
import { useEffect, useState } from 'react';
import Header from '../components/projects/Header';
import { User, role } from '@/settings';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
    setUsers(savedUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = (userId: string, newRole: string) => {
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole as role } : u);
    setUsers(updated);
    localStorage.setItem('app_users', JSON.stringify(updated));

    const currentUser = JSON.parse(sessionStorage.getItem('user_info') || '{}');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-white">Zarządzanie użytkownikami</h1>
          
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
            <table className="w-full text-left">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-300">Użytkownik</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Email</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Rola</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      Brak zarejestrowanych użytkowników w bazie danych.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-850 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <span className="font-medium">{user.name}</span>
                      </td>
                      <td className="p-4 text-gray-400">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'blocked'
                            ? 'bg-red-900/30 text-red-400 border border-red-800' 
                            : 'bg-blue-900/30 text-blue-400 border border-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="guest">Guest</option>
                          <option value="admin">Admin</option>
                          <option value="developer">Developer</option>
                          <option value="devops">DevOps</option>
                          <option value="blocked">Zablokuj</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}