import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2, MailX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type State =
  | "validating"
  | "valid"
  | "already_unsubscribed"
  | "invalid"
  | "submitting"
  | "success"
  | "error";

const UnsubscribePage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("validating");

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setState("invalid");
        return;
      }
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: supabaseAnonKey } }
        );
        const data = await res.json();
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already_unsubscribed");
        else setState("invalid");
      } catch {
        setState("invalid");
      }
    };
    validate();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setState("submitting");
    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } }
      );
      if (error) throw error;
      if (data?.success) setState("success");
      else if (data?.reason === "already_unsubscribed") setState("already_unsubscribed");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Unsubscribe | Winteriors Decor LLC</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="py-20 md:py-28 bg-background min-h-[60vh] flex items-center">
        <div className="container-custom max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl shadow-card border border-border/50 p-10 md:p-12 text-center"
          >
            {state === "validating" && (
              <>
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-5 animate-spin" />
                <h1 className="text-2xl font-bold font-poppins mb-2">Verifying…</h1>
                <p className="text-muted-foreground">Please wait a moment.</p>
              </>
            )}

            {state === "valid" && (
              <>
                <MailX className="w-14 h-14 text-primary mx-auto mb-5" />
                <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-3">
                  Unsubscribe from emails
                </h1>
                <p className="text-muted-foreground mb-8">
                  You will no longer receive notification emails from Winteriors
                  Decor LLC. You can re-subscribe by contacting us at any time.
                </p>
                <Button
                  size="lg"
                  onClick={handleConfirm}
                  className="bg-primary hover:bg-primary/90 h-12 px-8"
                >
                  Confirm Unsubscribe
                </Button>
              </>
            )}

            {state === "submitting" && (
              <>
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-5 animate-spin" />
                <h1 className="text-2xl font-bold font-poppins mb-2">
                  Processing…
                </h1>
              </>
            )}

            {state === "success" && (
              <>
                <CheckCircle className="w-14 h-14 text-primary mx-auto mb-5" />
                <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-3">
                  You've been unsubscribed
                </h1>
                <p className="text-muted-foreground">
                  We've removed your email from our notification list.
                </p>
              </>
            )}

            {state === "already_unsubscribed" && (
              <>
                <CheckCircle className="w-14 h-14 text-muted-foreground mx-auto mb-5" />
                <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-3">
                  Already unsubscribed
                </h1>
                <p className="text-muted-foreground">
                  This email is already removed from our notification list.
                </p>
              </>
            )}

            {state === "invalid" && (
              <>
                <AlertCircle className="w-14 h-14 text-destructive mx-auto mb-5" />
                <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-3">
                  Invalid or expired link
                </h1>
                <p className="text-muted-foreground">
                  This unsubscribe link is no longer valid. Please contact us if
                  you'd like to update your email preferences.
                </p>
              </>
            )}

            {state === "error" && (
              <>
                <AlertCircle className="w-14 h-14 text-destructive mx-auto mb-5" />
                <h1 className="text-2xl md:text-3xl font-bold font-poppins mb-3">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground mb-6">
                  We couldn't process your request. Please try again.
                </p>
                <Button onClick={handleConfirm} variant="outline">
                  Try again
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default UnsubscribePage;
