"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import logo from '../public/logo.png';
import twitter from '../public/twitter.png';
import telegram from '../public/telegram.png';
import web from '../public/web.png';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatAddress } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import WalletRange from '@/components/walletRange';

export default function Home() {

  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, chains } = useSwitchChain();

  const connector = connectors[0];

  const textRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    const text = textRef.current?.innerText;
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('Wallet address copied to clipboard.');
        })
        .catch((err) => {
          console.error('Error copying text: ', err);
        });
    } else {
      console.warn('No text to copy');
    }
  };

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  // const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

  const endDate = new Date('2025-06-10T00:00:00Z').getTime();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // SVG Icons
 // const MetamaskIcon = () => (
  //  <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
  //    <path d="M16 3L3 17l6 11 6-6 6 6 6-11z" fill="#FCC32E" />
  //  </svg>
  // );

 // const TrustWalletIcon = () => (
 //   <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
 //     <circle cx="16" cy="16" r="14" fill="#00B4AC" />
 //   </svg>
 // );

//  const PhantomIcon = () => (
//    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
//      <path d="M9 10v14l7-5 7 5V10H9z" fill="#9A6DFF" />
//    </svg>
//  );


  return (

    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans relative overflow-hidden">

      {/* Background Glow Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute w-16 h-16 bg-pink-400 opacity-60 blur-xl rounded-full animate-[float_25s_linear_infinite]" style={{ top: '20%', left: '20%' }}></div>
        <div className="absolute w-16 h-16 bg-pink-500 opacity-60 blur-xl rounded-full animate-[float_25s_linear_infinite]" style={{ top: '40%', left: '60%', animationDelay: '5s' }}></div>
        <div className="absolute w-16 h-16 bg-purple-500 opacity-60 blur-xl rounded-full animate-[float_25s_linear_infinite]" style={{ top: '70%', left: '40%', animationDelay: '10s' }}></div>
        <div className="absolute w-16 h-16 bg-indigo-400 opacity-60 blur-xl rounded-full animate-[float_25s_linear_infinite]" style={{ top: '80%', left: '80%', animationDelay: '15s' }}></div>
        <div className="absolute w-16 h-16 bg-violet-300 opacity-60 blur-xl rounded-full animate-[float_25s_linear_infinite]" style={{ top: '10%', left: '50%', animationDelay: '20s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4 bg-black/20 backdrop-blur-md rounded-lg mx-6 mt-6 border border-pink-500/20">
        <h1 className="text-2xl font-bold text-pink-400">MeenahCoin</h1>

        {isConnected ? (
        <div className="flex-col md:flex-row flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white h-fit md:px-3 py-2 rounded-2xl font-semibold flex justify-center  items-center gap-1">
              {chain?.name.split(" ").slice(0, 2).join(" ")} <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full justify-center rounded-2xl">
              {chains.map(
                (c) =>
                  c.id !== chain?.id && (
                    <DropdownMenuItem
                      key={c.id}
                      onClick={() => switchChain({ chainId: c.id })}
                      className="cursor-pointer w-full flex justify-center rounded-2xl font-semibold"
                    >
                      {c.name}
                    </DropdownMenuItem>
                  )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white h-fit px-7 py-2 rounded-2xl font-semibold flex items-center gap-1">
              {formatAddress(address)} <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full flex justify-center rounded-2xl">
              <DropdownMenuItem
                onClick={() => disconnect()}
                className="text-red-400 cursor-pointer w-full flex justify-center rounded-2xl font-semibold"
              >
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector })}
          className="bg-pink-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-pink-300 transition-all duration-300"
        >
          Connect Wallet
        </button>
      )}

      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pt-12 pb-20 max-w-7xl mx-auto">
        {/* Flexbox container for left and right columns */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <section className="w-full md:w-1/2">
            <article className="bg-black/10 p-6 rounded-xl shadow-lg border border-pink-500/10">
              <Image src={logo} alt="Crypto Coin" className="rounded-lg w-full mb-4" />
              <h2 className="text-2xl font-bold flex items-center">
                MeenahCoin <span className="text-xs bg-pink-400 text-black px-3 py-1 rounded-full ml-3">Audited</span>
              </h2>
              <div className="flex my-4 text-pink-400 text-xl space-x-4">
                <a href="https://meenahcoin.space" target="_blank" rel="noopener noreferrer">
                  <Image src={web} alt="Website" width={50} height={50} />
                </a>
                <a href="https://x.com/OinMeenah" target="_blank" rel="noopener noreferrer">
                  <Image src={twitter} alt="Twitter" width={50} height={50} />
                </a>
                <a href="https://t.me/meenahg91" target="_blank" rel="noopener noreferrer">
                  <Image src={telegram} alt="Telegram" width={50} height={50} />
                </a>
              </div>
              <h2 className="text-2xl mt-4 font-bold">The Revolution Has Begun</h2>
              <p className="mt-2">
                MeenahCoin (MNK) isnt just another cryptocurrency — it is a powerful movement to reshape how digital assets are exchanged and traded.
                Built on the Solana blockchain, MeenahCoin offers lightning-fast, low-cost, and secure transactions accessible to everyone.
              </p>
              <h2 className="text-xl mt-6">Why MeenahCoin?</h2>
              <ul className="space-y-4 mt-4">
                <li className="bg-slate-900 p-4 rounded-md">
                  <strong className="text-pink-400">⚡ Speed Like Never Before:</strong> Up to 65,000 transactions per second on Solana — real-time performance with no delays.
                </li>
                <li className="bg-slate-900 p-4 rounded-md">
                  <strong className="text-pink-400">💸 Ultra-Low Fees:</strong> Enjoy near-zero fees for all your transactions and interactions.
                </li>
                <li className="bg-slate-900 p-4 rounded-md">
                  <strong className="text-pink-400">🌍 Decentralized and Transparent:</strong> Full control, open protocols, and secure technology.
                </li>
                <li className="bg-slate-900 p-4 rounded-md">
                  <strong className="text-pink-400">🔧 Real Utility:</strong> Powering remittances, e-commerce, DeFi, NFTs, and more.
                </li>
              </ul>
              <h2 className="text-xl mt-6">Our Mission</h2>
              <p>
                We are building a borderless, inclusive financial future. MeenahCoin empowers individuals, businesses, and communities — bridging the gap between opportunity and innovation.
              </p>
            </article>
          </section>

          {/* Right Column */}
          <section className="w-full md:w-1/2 space-y-6">
            {/* Countdown Card */}
            <article className="bg-black/10 p-6 rounded-xl shadow-lg border border-pink-500/10">
              <h2 className="text-xl font-semibold mb-2 text-center mb-4">Ending In</h2>
              <div className="flex justify-center gap-2 text-xl font-bold">
                <span className="bg-pink-400 text-black px-3 py-1 rounded-lg">{timeLeft.days}d</span>
                <span className="bg-pink-400 text-black px-3 py-1 rounded-lg">{timeLeft.hours}h</span>
                <span className="bg-pink-400 text-black px-3 py-1 rounded-lg">{timeLeft.minutes}m</span>
                <span className="bg-pink-400 text-black px-3 py-1 rounded-lg">{timeLeft.seconds}s</span>
              </div>
              <p className="text-center mt-4 text-pink-400 font-bold glow-text">Presale Round 2</p>
              <WalletRange />
            </article>

            {/* Presale Details Card */}
            <article className="bg-black/10 p-6 rounded-xl shadow-lg border border-pink-500/10">
              <h3 className="text-lg font-semibold mb-4">Presale Details</h3>
              <ul className="divide-y divide-pink-500/20">
                {[
                  ["Token Name:", "Meenah Coin"],
                  ["Token Symbol:", "MNK$"],
                  ["Status:", "Live"],
                  ["Sale Type:", "Fair Lunch"],
                  ["Presale Tokens:", "450,000,000"],
                  ["Liquidity:", "23%"],
                  ["Lock:", "2 Months"],
                  ["Token For Liquidity:", "200,000,000"],
                  ["Softcap:", "1 SOL"],
                  ["Hardcap:", "500 SOL"],
                ].map(([label, value], index) => (
                  <li key={index} className="flex justify-between py-2">
                    <span>{label}</span>
                    <span className="text-pink-400">{value}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* After Presale Card */}
            <article className="bg-black/10 p-6 rounded-xl shadow-lg border border-pink-500/10">
              <h3 className="text-lg font-semibold mb-2">After the Presale</h3>
              <p>
                Once the presale ends, tokens will be distributed, and liquidity will be locked. Stay connected with our channels for listing announcements.
              </p>
              <p className="mt-4 color-pink-400 font-bold text-center mb-4">
                If you cannot connect to the wallet, please use the <span className='text-pink-500'>SOL ADDRESS</span> below to send funds:
              </p>
              <h2 className='text-center text-5xl mb-4'>👇🏼👇🏼</h2>
              <p className="text-pink-400 rounded bg-blue-800 mt-2 break-all p-4 bg-light text-center" onClick={copyToClipboard}><span ref={textRef} className='font-bold'>6gvxSJdBBbnagxJDxmG5gdD6L3w3DKg15oJEyeq9RWSz</span><br /> <span className='text-white text-2sm'>Click to copy</span></p>
              {/* <p className='text-center'>Click to copy</p> */}
            </article>
            
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-gray-500">
        <p>&copy; 2025 MeenahCoin. All rights reserved.</p>
        <p className="mt-2">
          Designed and Developed by{' '}
          <a href="https://wa.me/08092782431 " className="text-pink-400 no-underline" target="_blank" rel="noopener noreferrer">
            AB Software
          </a>
        </p>
      </footer>

      <style jsx global>{`
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }
    
            .animate-float {
              animation: float 25s linear infinite;
            }
    
            .animate-fade-in-down {
              animation: fadeInDown 0.3s ease-out forwards;
            }
    
            @keyframes fadeInDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
    </div>
  );
}
