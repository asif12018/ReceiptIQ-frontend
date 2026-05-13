import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface AdminStats {
  totalUsers: number;
  totalReceipts: number;
  totalGoals: number;
  usersOverTime: { name: string; users: number }[];
  message: string;
}

export interface UserListDTO {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch(`${API}/users/admin/stats`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch admin stats");
      return json.data;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery<UserListDTO[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch(`${API}/users/admin/users`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch users");
      return json.data;
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ targetUserId, role }: { targetUserId: string; role: "USER" | "ADMIN" }) => {
      const res = await fetch(`${API}/users/admin/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetUserId, role }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to update role");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`${API}/users/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete user");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
};

export interface SystemInfo {
  aiLogs: { id: string; action: string; tokens: number; createdAt: string }[];
  dailyQuota: number;
  settings: {
    newRegistrations: boolean;
    maintenanceMode: boolean;
    systemPrompt: string;
  };
}

export const useAdminSystemInfo = () => {
  return useQuery<SystemInfo>({
    queryKey: ["admin-system-info"],
    queryFn: async () => {
      const res = await fetch(`${API}/users/admin/system-info`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch system info");
      return json.data;
    },
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<SystemInfo["settings"]>) => {
      const res = await fetch(`${API}/users/admin/system-info`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to update system settings");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-system-info"] });
    },
  });
};
