"use client";

import { useEffect, useState } from "react";
import { Search, Users, ShieldCheck, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminUser } from "@/lib/api/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ search: searchQuery || undefined });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStaff = async (user: AdminUser) => {
    setUpdatingId(user.id);
    const newStaff = !user.is_staff;
    try {
      await adminApi.updateUser(user.id, { is_staff: newStaff });
      toast.success(`User ${user.email} staff privileges ${newStaff ? "granted" : "revoked"}`);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_staff: newStaff } : u)));
    } catch (err) {
      toast.error("Failed to update user privileges");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-space-y-6">
      {/* Header & Search */}
      <div className="admin-flex-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="admin-section-title text-xl">User & Staff Directory</h2>
          <p className="admin-section-subtitle">
            Manage registered customer accounts, view order activity, and grant administrator access.
          </p>
        </div>

        <form onSubmit={handleSearch} className="admin-flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input admin-input-with-icon"
            />
          </div>
          <button
            type="submit"
            className="admin-btn admin-btn-gold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">
            <RefreshCw className="w-4 h-4 animate-spin text-[#c6a45f]" />
            <span>Loading user directory...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <Users />
            <p>No user accounts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone Number</th>
                  <th>Email Status</th>
                  <th>Orders Placed</th>
                  <th>Joined Date</th>
                  <th className="text-right">Staff Access</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-flex admin-items-center admin-gap-3">
                        <div className="admin-sidebar-avatar">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="admin-font-semibold admin-text-white">{user.email}</p>
                          <p className="admin-text-muted admin-text-xs">ID #{user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="admin-text-muted">{user.phone_number || "Not provided"}</td>

                    <td>
                      {user.is_email_verified ? (
                        <span className="admin-badge green">
                          Verified
                        </span>
                      ) : (
                        <span className="admin-text-muted admin-text-xs uppercase">Unverified</span>
                      )}
                    </td>

                    <td className="admin-font-semibold admin-text-white">{user.orders_count || 0} orders</td>

                    <td className="admin-text-muted">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="text-right">
                      <button
                        disabled={updatingId === user.id}
                        onClick={() => handleToggleStaff(user)}
                        className={`admin-btn ${
                          user.is_staff
                            ? "admin-btn-gold"
                            : "admin-btn-ghost"
                        }`}
                      >
                        {user.is_staff ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        <span>{user.is_staff ? "Administrator" : "Make Admin"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
