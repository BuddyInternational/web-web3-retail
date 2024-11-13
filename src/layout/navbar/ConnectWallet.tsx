import { Button, Skeleton, Tooltip } from "@mui/material";
import {
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaRegCopy, FaEthereum } from "react-icons/fa";
import {
  checkExistingVanityAddress,
  generateAndSaveVanityAddress,
  generateVanityWallet,
  storeVanityWallet,
} from "../../api/vanityAPI";
import { useVanityContext } from "../../context/VanityContext";
import { SiPolygon } from "react-icons/si";
import { toast } from "react-toastify";
import { useGullyBuddyNotifier } from "../../utils/GullyBuddyNotifier";
import { ethers } from "ethers";
import axios from "axios";
import { saveAs } from "file-saver";

// 1. Get projectId
const projectId: any = process.env.REACT_APP_WALLET_PROJECT_ID;

// 2. Set chains
const chains = [
  {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  },
  {
    chainId: 137,
    name: "Polygon",
    currency: "Matic",
    explorerUrl: "https://polygonscan.com/",
    rpcUrl: "https://polygon-rpc.com/",
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
    currency: "ETH",
    explorerUrl: "https://arbiscan.io/",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  {
    chainId: 8453,
    name: "Base Mainnet",
    currency: "ETH",
    explorerUrl: "https://base.blockscout.com/",
    rpcUrl: "https://mainnet.base.org",
  },
  {
    chainId: 11155111,
    name: "Sepolia Testnet",
    currency: "SepoliaETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://sepolia.infura.io/v3/",
  },
  {
    chainId: 80002,
    name: "POLYGON AMOY TESTNET",
    currency: "MATIC",
    explorerUrl: "https://www.oklink.com/amoy",
    rpcUrl: "https://rpc-amoy.polygon.technology/",
  },
  {
    chainId: 31337,
    name: "Localhost",
    currency: "HETH",
    explorerUrl: "",
    rpcUrl: "http://localhost:8545",
  },
  {
    chainId: 84532,
    name: "Base Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia-explorer.base.org",
    rpcUrl: "https://sepolia.base.org",
  },
];

// 3. Create a metadata object
// For set Localnet
// const metadata = {
//   name: "Demo",
//   description: "Demo",
//   url: "http://localhost:3000/", // origin must match your domain & subdomain
//   icons: [""],
// };

// For set production
const metadata = {
  name: "gully",
  description: "gully",
  url: "https://gully.buddies.international/", // origin must match your domain & subdomain
  icons: [""],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
  auth: {
    email: false,
    socials: [],
    showWallets: false,
    walletFeatures: false,
  },
});

// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

// vanity address suffix
const vanity_suffix: string | undefined = process.env.REACT_APP_VANITY_SUFFIX;

// 6. Interface to get vanity details
interface VanityData {
  walletAddress: string;
  vanityAddress: string;
  vanityPrivateKey: string;
  createdAt: string;
}

export default function App() {
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useWeb3ModalAccount();
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);
  const { vanityAddress, setVanityAddress } = useVanityContext();
  const [isLoading, setIsLoading] = useState(false);
  const { notifyGullyBuddy } = useGullyBuddyNotifier();
  const { walletProvider } = useWeb3ModalProvider();

  // Server API Base URL
  const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

  // Function to fetch data from the backend
  const downloadVanityData = async () => {
    try {
      const response = await axios.get(`${server_api_base_url}/api/vanity/downloadVanityAddress`);
    
      // Check if response.data exists and is an array
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log("Setting data", response.data.data);

        const csv = convertToCSV(response.data.data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "data.csv");
      } else {
        console.log("No data found");
        alert("No data to download");
          return;
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Function to convert data to CSV format
  const convertToCSV = (array: VanityData[]) => {
    const headers = Object.keys(array[0]).join(",") + "\n";
    const rows = array.map((obj) => Object.values(obj).join(",")).join("\n");
    return headers + rows;
  };

  useEffect(() => {
    const handleWalletConnect = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        // Create ethers provider using the current wallet provider
        const ethersProvider = new ethers.BrowserProvider(walletProvider!);
        // console.log("---ethersProvider",);

        // Check the current network
        const network = await ethersProvider.getNetwork();
        const isMainnet = network.chainId === BigInt(1); // Ethereum Mainnet

        if (!isMainnet) {
          // User is not on Mainnet, show a warning
          toast.warning(
            "Please switch to the Ethereum Mainnet to generate a vanity address."
          );
          disconnect(); // Disconnect from the wallet
          setIsLoading(false);
          return;
        }

        // Check if the wallet already has a vanity address
        const existingAddress = await checkExistingVanityAddress(address);
        console.log("existingAddress", existingAddress);

        if (existingAddress != null) {
          setVanityAddress(existingAddress.vanityAddress);
        } else {
          // If no vanity address exists, generate and save a new one
          console.log("--------");

          // const generatedAddress: any = await generateAndSaveVanityAddress(
          //   vanity_suffix!,
          //   address
          // );

          const generateResponse = await generateVanityWallet(
            vanity_suffix!,
            1
          );

          // if (!!generatedAddress?.data[0]?.address) {
          //   setVanityAddress(generatedAddress?.data[0]?.address);
          //   try {
          //     const sender = address!;
          //     const message = `
          //     User with Wallet Address **${address}** has generated a new Vanity Address: **${
          //       generatedAddress?.data[0]?.address || "N/A"
          //     }**.
          //   `; // Send notification
          //     console.log("message----------------", message);
          //     const notificationResult = await notifyGullyBuddy(
          //       sender,
          //       message
          //     );
          //     if (notificationResult && notificationResult.hash) {
          //       toast.success("Notification sent to Buddyinternational.eth");
          //     }
          //   } catch (error: any) {
          //     toast.error("Error sending notification:", error);
          //   }
          // }

          if (generateResponse?.data?.[0]?.address) {
            const generatedAddress = generateResponse.data[0];
            // Store the generated address using the helper function
            const sender = address!;
            const message = `User with Wallet Address **${address}** has generated a new Vanity Address: **${
              generatedAddress.address || "N/A"
            }**.`;
            const notificationResult = await notifyGullyBuddy(sender, message);
            console.log("notificationResult", notificationResult);
            if (notificationResult && notificationResult.hash) {
              await storeVanityWallet(
                address,
                generatedAddress.address,
                generatedAddress.privKey
              );
              setVanityAddress(generatedAddress.address);
              toast.success("Notification sent to Buddyinternational.eth");
            } else {
              setIsLoading(false);
              toast.error("Error sending notification");
              return;
            }
          }
        }
        setIsLoading(false);
      }
    };

    handleWalletConnect();
  }, [isConnected, address, vanityAddress, setVanityAddress]);

  return (
    <>
      <div className="flex sm:items-center md:justify-between md:flex-row sm:flex-col-reverse">
        {/* connected vanity address */}
        <div className="sm:py-1 md:py-2 md:pl-14 sm:pl-0 flex md:flex-row sm:flex-col md:gap-3 sm:gap-1 justify-center">
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={50}
              // animation="wave"
              // sx={{ bgcolor: "red" }}
            />
          ) : (
            <>
              <div className="text-[#5692D9] font-normal font-sans text-base">
                Vanity Address :
              </div>
              <div className="flex flex-col">
                <div className="text-white flex gap-3 font-normal font-sans text-sm">
                  <span className="mt-1">
                    {vanityAddress?.slice(0, 6)}... {vanityAddress?.slice(-4)}
                  </span>
                  <span className="">
                    {isAddressCopied ? (
                      <FaCheck className="mt-1 text-green-500 cursor-pointer" />
                    ) : (
                      <FaRegCopy
                        onClick={() => {
                          navigator.clipboard.writeText(vanityAddress || "");
                          setIsAddressCopied(true);
                          clearTimeout(copyAddressTimeoutRef.current);
                          copyAddressTimeoutRef.current = setTimeout(() => {
                            setIsAddressCopied(false);
                          }, 1000);
                        }}
                        className="text-[#5692D9] font-thin mt-1 cursor-pointer"
                        data-tip="Copy Vanity Address"
                        data-tip-content=".tooltip"
                      />
                    )}
                  </span>
                  {/* Etherscan Link */}
                  <Tooltip title="View on Etherscan" arrow>
                    <a
                      href={`https://etherscan.io/address/${vanityAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5692D9] mt-1 cursor-pointer"
                      data-tip="View on Etherscan"
                    >
                      <FaEthereum />
                    </a>
                  </Tooltip>
                  {/* Polygonscan Link */}
                  <Tooltip title="View on Polygonscan" arrow>
                    <a
                      href={`https://polygonscan.com/address/${vanityAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5692D9] mt-1 cursor-pointer"
                      data-tip="View on Polygonscan"
                    >
                      <SiPolygon />
                    </a>
                  </Tooltip>
                  <Tooltip title="CDE" arrow>
                    <a
                      href={`/#`}
                      // target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5692D9] mt-1 cursor-pointer"
                      data-tip="CDE"
                      onClick={() => {
                        alert("Prestige this Account");
                      }}
                    >
                      <img src="/CDE.svg" className="h-4 w-auto" alt="CDE" />
                    </a>
                  </Tooltip>
                </div>
                <div>
                  <hr className="border-t border-gray-600 w-full mt-2" />
                </div>
              </div>
            </>
          )}
        </div>
        {/* connect/disconnect button */}
        <div className="flex flex-row justify-end px-2 py-6 mx-5">
          {!isConnected ? (
            <w3m-button />
          ) : (
            <div className="flex gap-3 sm:flex-col md:flex-row items-center ">
              <w3m-network-button />
              <Button
                variant="contained"
                onClick={() => {
                  setVanityAddress(
                    "0x0000000000000000000000000000000000000000"
                  );
                  disconnect();
                }}
                sx={{
                  borderRadius: "22px",
                  textTransform: "capitalize",
                  background: "#5773FF",
                }}
              >
                Disconnect Wallet
              </Button>
            </div>
          )}
        </div>
        <div className="sm:py-1 md:py-2 md:pl-14 sm:pl-0 flex md:flex-row sm:flex-col md:gap-3 sm:gap-1 justify-center">
          <Button
            variant="contained"
            onClick={downloadVanityData}
            sx={{
              borderRadius: "22px",
              textTransform: "capitalize",
              background: "#5773FF",
              mx: "10px",
            }}
          >
            Download Vanity Data
          </Button>
        </div>
      </div>
    </>
  );
}
