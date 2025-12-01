"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { SignInPage } from "@/components/sign-in";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Success - Redirect based on account status will be handled by dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Giriş yapılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
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
        onGoogleSignIn={() => signIn("google", { callbackUrl: "/dashboard" })}
        onResetPassword={() => router.push("/forgot-password")}
        onCreateAccount={() => router.push("/register")}
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

