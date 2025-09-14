import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthWrapper({ children }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return null; // or a spinner

  // If you later want to force login, render a Login component when !session.
  return children;
}
