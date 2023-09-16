import { useEffect, useState } from "react";
import { User } from "../types/user";

export const useUsers = (roomId: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}/users`);
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [roomId]);

  const refetch = async () => {
    setLoading(true);
    fetchUsers();
  };

  return { users, loading, refetch };
};
