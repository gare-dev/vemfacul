import { EmailProvider } from "@/context/EmailContext";
import type { AppProps } from "next/app";
import '@/styles/globals.css'
import { SnackProvider } from "@/hooks/SnackProvider";
import { CalendarDataProvider } from "@/context/CalendarDataContext";
import { OpenPopupProvider } from "@/context/OpenPopupContext";
import { PersonalEventDataProvider } from "@/context/PersonalEventPopupContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <EmailProvider>
      <PersonalEventDataProvider>
        <SnackProvider>
          <OpenPopupProvider>
            <CalendarDataProvider>
              <Component {...pageProps} />
            </CalendarDataProvider>
          </OpenPopupProvider>
        </SnackProvider>
      </PersonalEventDataProvider>
    </EmailProvider >
  )

}
