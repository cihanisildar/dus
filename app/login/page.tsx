"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SignInPage } from "@/components/sign-in";
import { useUser } from "@/hooks/useUser";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  // Redirect if already authenticated - use useEffect to avoid redirect loops
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message === "Invalid login credentials"
          ? "Geçersiz e-posta veya şifre"
          : signInError.message);
        return;
      }

      if (!data.user) {
        setError("Giriş başarısız");
        return;
      }

      // Success - let useEffect handle redirect after auth state updates
      // Not calling router.push() here - useEffect will redirect when user state is set
    } catch (err) {
      setError("Giriş yapılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setError("Google ile giriş başarısız");
      }
    } catch (err) {
      setError("Google ile giriş yapılırken bir hata oluştu");
    }
  };

  // Show success message if just registered
  const justRegistered = searchParams?.get("registered") === "true";

  return (
    <div>
      {justRegistered && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
          Kayıt başarılı! Şimdi giriş yapabilirsiniz.
        </div>
      )}
      <SignInPage
        title={
          <span className="font-light text-foreground tracking-tighter">
            Hoş Geldiniz
          </span>
        }
        description="Hesabınıza giriş yapın ve DUS yolculuğunuza devam edin"
        heroImageSrc="/images/Gemini_Generated_Image_15zbmx15zbmx15zb.png"
        onSignIn={handleLogin}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={() => router.push("/forgot-password")}
        onCreateAccount={() => router.push("/register")}
        error={error}
        isLoading={isLoading}
        labels={{
          email: "E-posta",
          emailPlaceholder: "E-posta adresinizi girin",
          password: "Şifre",
          passwordPlaceholder: "Şifrenizi girin",
          rememberMe: "Oturumu açık tut",
          resetPassword: "Şifremi Unuttum?",
          submitButton: isLoading ? "Giriş yapılıyor..." : "Giriş Yap",
          orContinueWith: "veya",
          googleButton: "Google ile Giriş Yap",
          newUserText: "Hesabınız yok mu?",
          createAccountLink: "Kayıt Ol",
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <LoginContent />
    </Suspense>
  );
}

