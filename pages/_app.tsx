import { EmailProvider } from "@/context/EmailContext";
import type { AppProps } from "next/app";
import '@/styles/globals.css'
import { SnackProvider } from "@/hooks/SnackProvider";
import { CalendarDataProvider } from "@/context/CalendarDataContext";
import { OpenPopupProvider } from "@/context/OpenPopupContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <EmailProvider>
      <SnackProvider>
        <OpenPopupProvider>
          <CalendarDataProvider>
            <Component {...pageProps} />
          </CalendarDataProvider>
        </OpenPopupProvider>
      </SnackProvider>
    </EmailProvider >
  )

}
