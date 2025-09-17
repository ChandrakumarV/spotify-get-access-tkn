import axios from "axios";
import { useEffect, useState } from "react";
import { redirectUri } from "./App";

const LS_KEY = "spotify-auth-config";

export default function Callback() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [token, setToken] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        setError("No code found in URL");
        return;
      }

      const saved = localStorage.getItem(LS_KEY);
      if (!saved) {
        setError("No client credentials found in localStorage");
        return;
      }

      const { clientId, clientSecret } = JSON.parse(saved);
      if (!redirectUri) {
        setError("Redirect URI missing in config");
        return;
      }

      try {
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        });

        const res = await axios.post(
          "https://accounts.spotify.com/api/token",
          body.toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        setToken(res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.error_description || err.message);
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Spotify Callback</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {token ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBlock: "8px",
            }}
          >
            <h3>Access Token</h3>
            <button
              onClick={() => navigator.clipboard.writeText(token.access_token)}
              style={{
                right: "8px",
                top: "8px",
                backgroundColor: "lightgray",
                // color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Copy
            </button>
          </div>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#1DB954", // Spotify green
              color: "white",
              borderRadius: "6px",
              fontFamily: "monospace",
              wordBreak: "break-all",
            }}
          >
            <code>{token.access_token}</code>
          </div>

          <h2 style={{ marginTop: "20px" }}>Token Info</h2>

          <div
            style={{
              backgroundColor: "#f4f4f4",
              padding: "12px",
              borderRadius: "6px",
              fontFamily: "monospace",
              wordBreak: "break-all",
              overflowX: "auto",
            }}
          >
            <pre>{JSON.stringify(token, null, 2)}</pre>
          </div>
        </>
      ) : (
        !error && <p>Exchanging code for token...</p>
      )}
    </div>
  );
}
