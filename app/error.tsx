"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Bir hata oluştu</h1>
        <p className="text-muted-foreground max-w-md">
          Beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">Hata kodu: {error.digest}</p>
        )}
      </div>
      <Button onClick={reset}>Sayfayı Yenile</Button>
    </div>
  );
}
