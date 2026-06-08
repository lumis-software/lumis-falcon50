import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { GuestProfile, Role, UserProfile } from "@/types/auth";

const GUEST: GuestProfile = {
  userId: "guest",
  email: "",
  name: "Guest Pilot",
  role: "pilot",
};

interface AuthState {
  /** Backend present? Drives whether auth/sync features are available. */
  backendEnabled: boolean;
  loading: boolean;
  session: Session | null;
  /** The authenticated profile, or the local guest profile in offline mode. */
  profile: UserProfile | GuestProfile;
  role: Role;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const backendEnabled = isSupabaseConfigured;
  const [loading, setLoading] = useState(backendEnabled);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | GuestProfile>(GUEST);

  useEffect(() => {
    if (!backendEnabled || !supabase) return;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [backendEnabled]);

  useEffect(() => {
    if (!backendEnabled || !supabase) return;
    if (!session) {
      setProfile(GUEST);
      return;
    }
    let active = true;
    supabase
      .from("profiles")
      .select("user_id,email,name,role,phone,certs,ratings")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setProfile(
          data
            ? {
                userId: data.user_id,
                email: data.email,
                name: data.name ?? session.user.email ?? "Pilot",
                role: (data.role as Role) ?? "pilot",
                phone: data.phone ?? undefined,
                certs: data.certs ?? undefined,
                ratings: data.ratings ?? undefined,
              }
            : {
                userId: session.user.id,
                email: session.user.email ?? "",
                name: session.user.email ?? "Pilot",
                role: "pilot",
              },
        );
      });
    return () => {
      active = false;
    };
  }, [backendEnabled, session]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: "Backend not configured." };
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return error ? { error: error.message } : {};
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setProfile(GUEST);
  }, []);

  const isGuest = profile.userId === "guest";

  const value = useMemo<AuthState>(
    () => ({
      backendEnabled,
      loading,
      session,
      profile,
      role: profile.role,
      isGuest,
      signIn,
      signOut,
    }),
    [backendEnabled, loading, session, profile, isGuest, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthState {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
