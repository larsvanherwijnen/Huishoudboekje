import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";
import { signOut } from "firebase/auth";

export function useUser() {
  const [user, loading, error] = useAuthState(auth);

  function logout() {
    return signOut(auth);
  }
  return { user, loading, error, logout };
}
