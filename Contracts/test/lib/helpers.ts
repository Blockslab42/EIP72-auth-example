import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet, BigNumber } from "ethers";

export interface IShippingData {
  user: string;
  ammount: BigNumber;
  timestamp: BigNumber;
}

export const signShippingData = async (
  signer: SignerWithAddress | Wallet,
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
