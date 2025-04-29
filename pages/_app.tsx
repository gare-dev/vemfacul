import { EmailProvider } from "@/context/EmailContext";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EmailProvider>
      <Component {...pageProps} />
    </EmailProvider>
  )

}
