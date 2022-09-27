import type { NextPage } from "next";
import { ethers, Wallet, BigNumber } from "ethers";
import contractABI from "../../WalletHelpers/TestFIN.json";
import {
  contractAddress,
  targetChainId,
} from "../../WalletHelpers/contractVariables";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

// const Provider = new ethers.providers.JsonRpcProvider(provider)
// const SignerReal = Provider.getSigner()
// const contract = new ethers.Contract(contractAddress, contractABI, SignerReal)

export interface IShippingData {
  user: string;
  ammount: BigNumber;
  timestamp: BigNumber;
}

export const signShippingData = async (
  signer: Wallet,
  sigdata: IShippingData
) => {
  const domain = {
    name: "Ether Mail",
    version: "1",
    chainId: 111,
    verifyingContract: process.env.VERIFYING_CONTRACT,
  };
  const types = {
    Voucher: [
      { name: "user", type: "address" },
      { name: "ammount", type: "uint256" },
      { name: "timestamp", type: "uint256" },
    ],
  };

  return await signer._signTypedData(domain, types, { ...sigdata });
};

const data: IShippingData = {
  user: "0x70997970C51812dc3A010C7d01b50e0d17dc79C7",
  ammount: ethers.BigNumber.from("10"),
  timestamp: ethers.BigNumber.from(Math.floor(Date.now() / 1000).toString()),
};

const Claim: NextPage = () => {
  const { account, provider, chainId } = useWeb3React();
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [r, setR] = useState<any>();
  const [s, setS] = useState<any>();
  const [v, setV] = useState<any>();

  useEffect(() => {
    if (!!provider && chainId == targetChainId) {
      const getSigner = provider.getSigner();

      setSigner(getSigner);
      setContract(new ethers.Contract(contractAddress, contractABI, getSigner));
    }
  }, [provider, chainId]);

  useEffect(() => {
    if (account) {
      getBalance(account);
    }
  }, [signer]);

  async function claim() {
    console.log("claim start");
    if (v && r && s) {
      contract.claim(data, v, r, s);
    }
  }

  async function getBalance(addr: string) {
    setBalance(await (await contract.balanceOf(addr)).toString());
  }

  async function generateSign() {
    let privateKey = process.env.SIGNER;
    let signer = new ethers.Wallet(privateKey);
    let signature = await signShippingData(signer, data);
    console.log(signature);
    signature = signature.substr(2);
    setR("0x" + signature.slice(0, 64));
    setS("0x" + signature.slice(64, 128));
    setV("0x" + signature.slice(128, 130));
  }

  return (
    <div>
      <ConnectWallet></ConnectWallet>
      {account && (
        <div>
          <button onClick={() => getBalance(account)}>Refresh</button>
          <p>{balance} ICE</p>
        </div>
      )}
      <button onClick={generateSign}>Generate a sign</button>
      <button onClick={claim}>claim</button>
      <div></div>
    </div>
  );
};

export default Claim;
