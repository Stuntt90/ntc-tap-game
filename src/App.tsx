import React, { useState, useEffect } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import Info from './icons/Info';
import Settings from './icons/Settings';
import mainCharacter from './images/mainCharacter.png';
import binanceLogo from './images/binanceLogo.png';
import dailyCipher from './images/dailyCipher.png';
import dailyCombo from './images/dailyCombo.png';
import dailyReward from './images/dailyReward.png';
import dollarCoin from './images/dollarCoin.png';
import { FaExchangeAlt, FaHammer, FaUserFriends, FaCoins, FaGift } from 'react-icons/fa';

const App: React.FC = () => {
  const levelNames = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Epic", "Legendary", "Master", "GrandMaster", "Lord"];
  const levelMinPoints = [0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000];

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(22749365);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const pointsToAdd = 11;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const [activeTab, setActiveTab] = useState("Exchange");

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);
    if (now.getUTCHours() >= targetHour) target.setUTCDate(target.getUTCDate() + 1);
    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPoints((prevPoints) => prevPoints + 1);
          return 30 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => { card.style.transform = ''; }, 100);
    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) return 100;
    const currentMin = levelMinPoints[levelIndex];
    const nextMin = levelMinPoints[levelIndex + 1];
    return Math.min(((points - currentMin) / (nextMin - currentMin)) * 100, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points]);

  const tabs = ["Exchange", "Mine", "Friends", "Earn", "Airdrop"];
  const renderTabContent = () => {
    return (
      <>
        <div className="px-4 mt-6 flex justify-between gap-2">
          {[dailyReward, dailyCipher, dailyCombo].map((icon, i) => (
            <div key={i} className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
              <div className="dot"></div>
              <img src={icon} alt="icon" className="mx-auto w-12 h-12" />
              <p className="text-[10px] text-center mt-1">
                {["Daily reward", "Daily cipher", "Daily combo"][i]}
              </p>
              <p className="text-[10px] text-center mt-2 text-gray-400">
                {[dailyRewardTimeLeft, dailyCipherTimeLeft, dailyComboTimeLeft][i]}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center py-4">Current Tab: {activeTab}</p>
      </>
    );
  };

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        {renderTabContent()}
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white border-t border-gray-700 flex justify-around py-3 z-20">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center text-xs ${activeTab === tab ? 'text-yellow-400' : 'text-white'}`}
            >
              {tab === "Exchange" && <FaExchangeAlt className="text-xl" />}
              {tab === "Mine" && <FaHammer className="text-xl" />}
              {tab === "Friends" && <FaUserFriends className="text-xl" />}
              {tab === "Earn" && <FaCoins className="text-xl" />}
              {tab === "Airdrop" && <FaGift className="text-xl" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>
        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
            style={{ top: `${click.y - 42}px`, left: `${click.x - 28}px`, animation: 'float 1s ease-out' }}
            onAnimationEnd={() => handleAnimationEnd(click.id)}
          >
            {pointsToAdd}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
