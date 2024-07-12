// ./app/page.tsx
import { fetchAccessToken } from "@humeai/voice";
import EviVoice from "~/components/evi/EviVoice";

export default async function Page() {
  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    secretKey: String(process.env.HUME_SECRET_KEY),
  });

  if (!accessToken) {
    throw new Error();
  }

  return <EviVoice accessToken={accessToken} />;
}
