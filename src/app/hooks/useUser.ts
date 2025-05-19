import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";

export function useUser() {
  const [user, loading, error] = useAuthState(auth);
  return { user, loading, error };
}