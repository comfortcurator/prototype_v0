export const dynamic = "force-dynamic";

import { prisma } from "@/lib/server";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">User directory</h1>
        <p className="text-sm text-slate-500">
          Review host accounts, contact details, and access tiers.
        </p>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-100">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.3em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {user.createdAt.toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

