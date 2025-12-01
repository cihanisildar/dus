"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SignInPage } from "@/components/sign-in";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Kayıt başarısız oldu");
        return;
      }

      // Success - redirect to login to sign in
      router.push("/login?registered=true");
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignInPage
      title={
        <span className="font-light text-foreground tracking-tighter">
          Hesap Oluştur
        </span>
      }
      description="DUS yolculuğunuza bugün başlayın"
      heroImageSrc="/images/Gemini_Generated_Image_15zbmx15zbmx15zb.png"
      onSignIn={handleRegister}
      onGoogleSignIn={() => signIn("google", { callbackUrl: "/dashboard" })}
      onResetPassword={undefined}
      onCreateAccount={() => router.push("/login")}
      error={error}
      isLoading={isLoading}
      labels={{
        email: "E-posta",
        emailPlaceholder: "ornek@email.com",
        password: "Şifre",
        passwordPlaceholder: "En az 8 karakter",
        rememberMe: "Kullanım koşullarını kabul ediyorum",
        submitButton: isLoading ? "Kaydediliyor..." : "Kayıt Ol",
        orContinueWith: "veya",
        googleButton: "Google ile Kayıt Ol",
        newUserText: "Zaten hesabınız var mı?",
        createAccountLink: "Giriş Yap",
      }}
    />
  );
}

