"use client";

import { useEffect, useState } from "react";

const MAX_LAMPORTS = 2_000_000_000; // 2 SOL

export default function WalletRange() {
  const [lamports, setLamports] = useState<number>(0);

  useEffect(() => {
    const getWalletBalance = async () => {
      try {
        const response = await fetch("https://cosmopolitan-black-pond.solana-mainnet.quiknode.pro/009491de794f011c8e58820de33cacf85f51a298", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: ["6gvxSJdBBbnagxJDxmG5gdD6L3w3DKg15oJEyeq9RWSz"],
          }),
        });

        const data = await response.json();
        if (data?.result?.value !== undefined) {
          setLamports(data.result.value);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    getWalletBalance();
    const interval = setInterval(getWalletBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  const percentage: number = Math.min((lamports / MAX_LAMPORTS) * 100, 100);
  const sol: string = (lamports / 1_000_000_000).toFixed(4);
  const targetSol = (MAX_LAMPORTS / 1_000_000_000).toFixed(2);

  return (
    <div className="rounded-2xl p-6 max-w-md mx-auto shadow-lg mt-10">
      {/* <h2 className="text-pink-600 text-xl font-bold mb-4">Wallet Balance</h2> */}

      <div className="w-full h-6 bg-pink-200 rounded-full overflow-hidden mb-2 shadow-inner">
        <div
          className="h-full bg-pink-500 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-pink-700 font-medium mb-4">
        <span>{sol} SOL</span>
        <span>{targetSol} SOL</span>
      </div>

      <p className="text-pink-600 text-sm">
        {percentage.toFixed(2)}% of target reached
      </p>
    </div>
  );
}
