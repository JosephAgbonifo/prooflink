import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createStorage } from "wagmi";

// Flare Coston2 testnet
export const flareChain = {
  id: 114, // Flare Coston2 testnet chain ID
  name: "Coston2",
  network: "coston2",
  nativeCurrency: { name: "C2FLR", symbol: "C2FLR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://coston2-api.flare.network/ext/C/rpc"] },
  },
  blockExplorers: {
    default: {
      name: "Coston2 Explorer",
      url: "https://coston2-explorer.flare.network",
    },
  },
} as const;

export const chains = [flareChain];

// RainbowKit and wagmi config
export const config = getDefaultConfig({
  appName: "Prooflink",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "Project_ID", // Replace with your WalletConnect project ID
  chains: [flareChain],
  ssr: false, // Disable SSR to enable auto-connect
  storage: createStorage({ storage: typeof window !== 'undefined' ? window.localStorage : undefined }),
});
