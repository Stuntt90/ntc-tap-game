
import { useEffect, useState } from "react";
import { WebApp } from "@twa-dev/react";

export default function TapGame() {
  const [tapCount, setTapCount] = useState(0);
  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    setTelegramUser(WebApp.initDataUnsafe?.user);
  }, []);

  const handleTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    // Optional: send to your backend every 10 taps
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">💥 Tap to Earn NTC Coins!</h1>
      <p className="text-lg mb-6">Taps: {tapCount}</p>
      <button
        onClick={handleTap}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full shadow-lg text-xl"
      >
        TAP 💥
      </button>
    </div>
  );
}
