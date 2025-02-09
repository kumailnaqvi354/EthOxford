"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FloatingToken } from "./components/FloatingToken"

export default function CosmicTokenLottery() {
  const [tokenAmount, setTokenAmount] = useState("")
  const [tokenBalance, setTokenBalance] = useState(100)
  const [lotteryTickets, setLotteryTickets] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [floatingTokens, setFloatingTokens] = useState<number[]>([])

  useEffect(() => {
    setFloatingTokens(Array.from({ length: 20 }, (_, i) => i))
  }, [])

  const handleTokenPurchase = () => {
    const amount = Number.parseInt(tokenAmount)
    if (isNaN(amount) || amount <= 0) return
    setTokenBalance((prev) => prev + amount)
    setTokenAmount("")
    setFloatingTokens((prev) => [...prev, prev.length])
  }

  const handleLotteryParticipation = () => {
    if (tokenBalance < 10) return
    setTokenBalance((prev) => prev - 10)
    setLotteryTickets((prev) => prev + 1)
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {floatingTokens.map((i) => (
        <FloatingToken key={i} />
      ))}
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl font-extrabold text-center text-white mb-10 animate-pulse">Cosmic Token Lottery</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Token Purchase Section */}
          <Card className="flex-1 bg-opacity-80 bg-purple-800 text-white border-2 border-purple-500">
            <CardHeader>
              <CardTitle className="text-2xl">Purchase Cosmic Tokens</CardTitle>
              <CardDescription className="text-purple-200">Fuel your cosmic journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Enter token amount"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="flex-grow bg-purple-700 text-white placeholder-purple-300"
                />
                <Button onClick={handleTokenPurchase} className="bg-yellow-400 text-purple-900 hover:bg-yellow-300">
                  Buy
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-lg text-yellow-400">Your Cosmic Balance: {tokenBalance} tokens</p>
            </CardFooter>
          </Card>

          {/* Lottery Section */}
          <Card className="flex-1 bg-opacity-80 bg-indigo-800 text-white border-2 border-indigo-500">
            <CardHeader>
              <CardTitle className="text-2xl">Celestial Lottery</CardTitle>
              <CardDescription className="text-indigo-200">Spin the cosmic wheel of fortune</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div
                className={`w-40 h-40 rounded-full border-4 border-yellow-400 mb-4 flex items-center justify-center ${isSpinning ? "animate-spin" : ""}`}
              >
                <span className="text-6xl">🌟</span>
              </div>
              <p className="mb-4 text-lg">Your cosmic tickets: {lotteryTickets}</p>
              <Button
                onClick={handleLotteryParticipation}
                className="w-full bg-yellow-400 text-indigo-900 hover:bg-yellow-300"
                disabled={tokenBalance < 10}
              >
                Spin (10 tokens)
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-indigo-200">Next celestial alignment: 24 Earth hours</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

