import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const url = useMemo(() => new URL(window.location.href), []);
  const errorFromProvider = url.searchParams.get("error_description") || url.searchParams.get("error");

  useEffect(() => {
    if (errorFromProvider) {
      setError(decodeURIComponent(errorFromProvider));
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        // If we have an OAuth code, exchange it for a session.
        if (url.searchParams.get("code")) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) throw error;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (cancelled) return;

        if (data.session) {
          // Clear the callback params from the URL by navigating with replace.
          navigate("/", { replace: true });
        } else {
          navigate("/auth", { replace: true });
        }
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Authentication failed");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate, url, errorFromProvider]);

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold uppercase">Signing you in…</h1>

        {error ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button className="w-full" onClick={() => navigate("/auth", { replace: true })}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-border border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Finishing authentication…</p>
          </div>
        )}
      </div>
    </div>
  );
}
