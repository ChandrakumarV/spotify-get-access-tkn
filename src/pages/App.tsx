import { useEffect, useState } from "react";

const LS_KEY = "spotify-auth-config";
export const redirectUri = `${window.location.origin}/Callback`;

export default function App() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [scopes, setScopes] = useState<string[]>([]);
  const [newScope, setNewScope] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setClientId(parsed.clientId || "");
      setClientSecret(parsed.clientSecret || "");
      setScopes(parsed.scopes || []);
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ clientId, clientSecret, scopes })
    );
    alert("Saved to localStorage!");
  };

  const addScope = () => {
    if (newScope && !scopes.includes(newScope)) {
      setScopes([...scopes, newScope]);
      setNewScope("");
    }
  };

  const deleteScope = (scope: string) => {
    setScopes((prevScopes) => prevScopes.filter((scp) => scp !== scope));
  };
  const startAuth = () => {
    if (!clientId) {
      alert("Please fill in Client ID and Redirect URI");
      return;
    }

    const scopeStr = encodeURIComponent(scopes.join(" "));
    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&show_dialog=true&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopeStr}`;
    window.location.href = url;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: "8px" }}>Spotify OAuth</h1>
      <p>
        This tool lets you quickly generate Spotify access tokens for testing.
        Your credentials are stored only in your browser (localStorage) and are
        never shared.
      </p>
      <p style={{ color: "red", marginTop: "12px", marginBottom: "8px" }}>
        Note: Add this Callback URL to your Spotify Developer Dashboard.
      </p>
      <p
        style={{
          backgroundColor: "#eeeeee",
          borderRadius: 4,
          padding: "2px 8px",
          fontSize: 14,
          width: "fit-content",
        }}
      >
        {" "}
        {redirectUri}
      </p>
      <br />
      <div>
        <label style={{ display: "inline-block", marginBottom: "4px" }}>
          Client ID:
        </label>
        <br />
        <input
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <br />
      <div>
        <label style={{ display: "inline-block", marginBottom: "4px" }}>
          Client Secret:
        </label>
        <br />
        <input
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <br />
      <div>
        <label style={{ display: "inline-block", marginBottom: "4px" }}>
          Scopes:
        </label>
        <br />
        <div style={{ marginBottom: "12px" }}>
          <input
            value={newScope}
            onChange={(e) => setNewScope(e.target.value)}
            placeholder="e.g. user-read-email"
          />
          <button onClick={addScope} className="btn">
            Add
          </button>
        </div>
        <ul>
          {scopes.map((s) => (
            <li key={s}>
              {s}{" "}
              <button
                className="delBtn"
                style={{ marginLeft: "12px" }}
                onClick={() => {
                  deleteScope(s);
                }}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>

      <br />
      <hr />
      <br />

      <button className="btn" onClick={saveConfig}>
        Save Config
      </button>
      <button className="btn" onClick={startAuth} style={{ marginLeft: 10 }}>
        Start Auth
      </button>
    </div>
  );
}
