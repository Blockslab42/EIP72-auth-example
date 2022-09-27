// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BigNumber, ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export interface IShippingData {
  user: string;
  ammount: BigNumber;
  timestamp: BigNumber;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const body = req.body;

    const privateKey = process.env.SIGNER;
    const signer = new ethers.Wallet(privateKey);

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

    const data: IShippingData = {
      user: body.user,
      ammount: ethers.BigNumber.from("10"),
      timestamp: ethers.BigNumber.from(
        Math.floor(Date.now() / 1000).toString()
      ),
    };

    const signature = await signer._signTypedData(domain, types, { ...data });
    res.status(200).json({ sign: signature, dataSigned: data });
  }
}
