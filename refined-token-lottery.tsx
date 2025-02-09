"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ThemeToggle } from "./components/ThemeToggle"
import { AnimatedBackground } from "./components/AnimatedBackground"
import { motion, AnimatePresence } from "framer-motion"
import { ethers } from "ethers";

export default function RefinedTokenLottery() {
  const [tokenAmount, setTokenAmount] = useState("")
  const [tokenBalance, setTokenBalance] = useState(100)
  const [lotteryTickets, setLotteryTickets] = useState(0)
  const [isLotteryActive, setIsLotteryActive] = useState(false)
  const [lotteryResult, setLotteryResult] = useState<string | null>(null)

  const handleTokenPurchase = () => {
    const amount = Number.parseInt(tokenAmount)
    if (isNaN(amount) || amount <= 0) return
    setTokenBalance((prev) => prev + amount)
    setTokenAmount("")
  }

  const handleLotteryParticipation = () => {
    if (tokenBalance < 10) return
    setTokenBalance((prev) => prev - 10)
    setLotteryTickets((prev) => prev + 1)
    setIsLotteryActive(true)
    setTimeout(() => {
      const result = Math.random() > 0.5 ? "Won" : "Lost"
      setLotteryResult(result)
      setIsLotteryActive(false)
      if (result === "Won") setTokenBalance((prev) => prev + 20)
    }, 3000)
  }


  const handleWalletConnect = () => {
   
  }


  return (<>
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden">
      <AnimatedBackground />
      <ThemeToggle />

        <div className="max-w-7xl mx-auto relative z-10">

          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-10">
            Token Exchange & Lottery
          </h1>
          <Button
                  onClick={handleWalletConnect}
                  className="w-4xl mb-10"
                  // disabled={tokenBalance < 10 || isLotteryActive}
                >
                  Connect Wallet
                </Button>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Token Purchase Section */}
            <Card className="flex-1 border-t-4 border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Purchase Tokens</CardTitle>
                <CardDescription>Invest in our ecosystem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Enter token amount"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleTokenPurchase}>Buy</Button>
                </div>
              </CardContent>
              <CardFooter>
                <AnimatePresence>
                  <motion.p
                    key={tokenBalance}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="text-lg font-semibold"
                  >
                    Balance: {tokenBalance} tokens
                  </motion.p>
                </AnimatePresence>
              </CardFooter>
            </Card>

            {/* Lottery Section */}
            <Card className="flex-1 border-t-4 border-green-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Token Lottery</CardTitle>
                <CardDescription>Double your investment</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-4 border-gray-300 dark:border-gray-700 mb-4 flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900">
                  {isLotteryActive ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
                  ) : (
                    <span className="text-6xl">
                      {lotteryResult === "Won" ? "🎉" : lotteryResult === "Lost" ? "😢" : "🎟️"}
                    </span>
                  )}
                </div>
                <p className="mb-4 text-lg">Your tickets: {lotteryTickets}</p>
                <Button
                  onClick={handleLotteryParticipation}
                  className="w-full"
                  disabled={tokenBalance < 10 || isLotteryActive}
                >
                  {isLotteryActive ? "Drawing..." : "Try Your Luck (10 tokens)"}
                </Button>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500 dark:text-gray-400">Next draw: Real-time</p>
              </CardFooter>
            </Card>
          </div>
        </div>
    </div>
  </>
  )
}

