"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ThemeToggle } from "./components/ThemeToggle"
import { AnimatedBackground } from "./components/AnimatedBackground"
import { motion, AnimatePresence } from "framer-motion"
import { ethers } from "ethers";
import { FLR_ABI, FLR_ADDRESS,LOTTER_ABI,LOTTERY_ADDRESS } from "@/lib/contract"
import { parseUnits } from "ethers/lib/utils"
declare global {
  interface Window {
    ethereum?: any; // You can replace 'any' with a more specific type later
  }
}


export default function RefinedTokenLottery() {
  const [tokenAmount, setTokenAmount] = useState("")
  const [tokenBalance, setTokenBalance] = useState(100)
  const [lotteryTickets, setLotteryTickets] = useState(0)
  const [isLotteryActive, setIsLotteryActive] = useState(false)
  const [lotteryResult, setLotteryResult] = useState<string | null>(null)

  const handleTokenPurchase = async () => {
    const amount = Number.parseInt(tokenAmount)
    const provider: any = new ethers.providers.Web3Provider(window['ethereum'])

    const Contract = new ethers.Contract(FLR_ADDRESS, FLR_ABI, provider);
    const signer = provider.getSigner()
    // console.log("Debug", await signer.getAddress());
    const contractWithSigner = Contract.connect(signer);

    const tx = await contractWithSigner.BuyToken(parseUnits(amount.toString(), "ether"), { value: parseUnits(".1", 'ether') })
    await tx.await();
    let bal = await Contract.balanceOf(await signer.getAddress());
    setTokenBalance(bal.toString());

  }

  const handleLotteryParticipation = async() => {
    const provider: any = new ethers.providers.Web3Provider(window['ethereum'])

    const TokenContract = new ethers.Contract(FLR_ADDRESS, FLR_ABI, provider);
    const signer = provider.getSigner()
    // console.log("Debug", await signer.getAddress());
    const tokenContractWithSigner = TokenContract.connect(signer);

    const tx1 = await tokenContractWithSigner.approve(LOTTERY_ADDRESS, parseUnits("1000", "ether"));
    await tx1.wait();
    const Contract = new ethers.Contract(LOTTERY_ADDRESS, LOTTER_ABI, provider);
    // console.log("Debug", await signer.getAddress());
    const contractWithSigner = Contract.connect(signer);
    const tx = await contractWithSigner.buyTicket({value: parseUnits(".1", 'ether') })
    await tx.wait();

  }


  const handleWalletConnect = async () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    // const provider: any = new ethers.providers.Web3Provider(window['ethereum'])
    const provider: any = new ethers.providers.Web3Provider(window['ethereum'])

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()
    const Contract = new ethers.Contract(FLR_ADDRESS, FLR_ABI, provider);

    let bal = await Contract.balanceOf(await signer.getAddress());
    setTokenBalance(bal.toString());


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
          {tokenBalance ? "Connected" : "Connect Wallet"}
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
              {/* <p className="mb-4 text-lg">Your tickets: {lotteryTickets}</p> */}
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

