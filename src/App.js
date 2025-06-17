
import { useEffect, useState } from "react";

export default function TapGame() {
  const [tapCount, setTapCount] = useState(0);
  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const WebApp = window.Telegram.WebApp;
      WebApp.ready();
      WebApp.expand();
      setTelegramUser(WebApp.initDataUnsafe?.user);
    }
  }, []);

  const handleTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount % 10 === 0 && telegramUser) {
      fetch("https://your-backend.com/api/tap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          taps: newCount,
        }),
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#111', color: '#fff' }}>
      <h1>💥 Tap to Earn NTC Tokens!</h1>
      <p>Taps: {tapCount}</p>
      <button
        onClick={handleTap}
        style={{
          padding: '20px 40px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          backgroundColor: 'gold',
          color: 'black',
          borderRadius: '9999px',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}
      >
        TAP 💥
      </button>
    </div>
  );
}
