import { EmailProvider } from "@/context/EmailContext";
import type { AppProps } from "next/app";
import '@/styles/globals.css'
import { SnackProvider } from "@/hooks/SnackProvider";
import { CalendarDataProvider } from "@/context/CalendarDataContext";
import { OpenPopupProvider } from "@/context/OpenPopupContext";
import { PersonalEventDataProvider } from "@/context/PersonalEventPopupContext";
import AlertProvider from "@/context/AlertContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingBar from "@/components/LoadingBar";


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      setProgress(10); // começa com 10%

      // intervalo para simular avanço
      const id = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + 5; // avança de 5 em 5
          }
          return prev; // trava no 90%
        });
      }, 200);

      setIntervalId(id);
    };

    const handleComplete = () => {
      // termina carregamento
      setProgress(100);

      // limpa o intervalo
      if (intervalId) clearInterval(intervalId);

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 400); // esconde suavemente
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);

      if (intervalId) clearInterval(intervalId);
    };
  }, [router, intervalId]);

  return (
    <AlertProvider>
      <EmailProvider>
        <PersonalEventDataProvider>
          <SnackProvider>
            <OpenPopupProvider>
              <CalendarDataProvider>
                {loading && <LoadingBar progress={progress} />}
                <Component {...pageProps} />
              </CalendarDataProvider>
            </OpenPopupProvider>
          </SnackProvider>
        </PersonalEventDataProvider>
      </EmailProvider >
    </AlertProvider>
  )

}
