'use client';
import { useEffect, useState } from 'react';
import Header from '../components/projects/Header';
import { User, UserRole as role, DB_CONFIG } from '@/settings';
import { UserService } from '@/lib/dbService';
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    if (DB_CONFIG === 'firebase') {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const firebaseUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User));
        setUsers(firebaseUsers);
      } catch (error) {
        console.error("Błąd ładowania z Firebase:", error);
      }
    } else {
      const savedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
      setUsers(savedUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  
  const updateRole = async (userId: string, newRole: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    const updatedUser = { ...userToUpdate, role: newRole as role };

    await UserService.saveUser(updatedUser);


    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    
    alert(`Zmieniono rolę użytkownika ${userToUpdate.name} na ${newRole}`);
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
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">Ładowanie danych...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">Brak zarejestrowanych użytkowników.</td></tr>
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
                          className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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