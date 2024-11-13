import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers } from "ethers";

const domain: string | undefined = process.env.REACT_APP_ETHEREUM_DOMAIN;

// Custom Hook to manage notification
export const useGullyBuddyNotifier = () => {
  const { walletProvider } = useWeb3ModalProvider();
  
  // Ensure walletProvider is defined before using it
  if (!walletProvider) {
    console.error("Wallet provider is not initialized.");
    return {
      notifyGullyBuddy: () => Promise.reject("Provider not initialized"),
    };
  }
  const ethersProvider = new ethers.BrowserProvider(
    walletProvider as ethers.Eip1193Provider
  );

  // Notify GullyBuddy
  const notifyGullyBuddy = async (sender: string, content: string) => {
    console.log(
      `Notifying Buddyinternational.eth Sender: ${sender}, Content: ${content}`
    );

    // // Check the network
    // const network = await ethersProvider.getNetwork();
    // if (network.chainId !== BigInt(1)) { // Ethereum Mainnet
    //   toast.warning("Please switch to Ethereum Mainnet Network");
    //   return false;
    // }
    console.log("domain!", domain!);

    const gullyBuddyAddress = await resolveENSName(domain!);
    console.log("ENS Name :", gullyBuddyAddress);

    if (gullyBuddyAddress) {
      console.log(
        `Resolved address for Buddyinternational.eth: ${gullyBuddyAddress}`
      );
      const transactionResult = await sendNotificationTransaction(
        gullyBuddyAddress,
        content
      );
      return transactionResult;
    } else {
      console.error("Failed to resolve Buddyinternational.eth");
      // toast.warning("Please switch to Ethereum Mainnet Network");
      return false;
    }
  };

  const resolveENSName = async (ensName: string) => {
    try {
      const ensAddress = await ethersProvider.resolveName(ensName);
      console.log("ENS Domain address----------", ensAddress);
      return ensAddress;
    } catch (error) {
      console.error(`Error resolving ENS name ${ensName}:`, error);
      return null;
    }
  };

  const sendNotificationTransaction = async (
    toAddress: string,
    messageContent: string
  ) => {
    try {
      const signer = await ethersProvider.getSigner();
      const encodedMessage = ethers.hexlify(ethers.toUtf8Bytes(messageContent));

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: 0,
        data: encodedMessage,
      });

      await tx.wait();
      console.log(
        "Notification transaction sent to Buddyinternational.eth:",
        tx
      );
      return tx;
    } catch (error) {
      console.error("Error sending notification transaction:", error);
      return false;
    }
  };

  return { notifyGullyBuddy };
};
