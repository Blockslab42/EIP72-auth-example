import { ethers } from "hardhat";

import { IShippingData, signShippingData } from "./lib/helpers";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Token contract", function () {
  it("===== TEST =====", async function () {
    const Token = await ethers.getContractFactory("verify");

    const contract = await Token.deploy();

    let privateKey = process.env.SIGNER;

    let signer = new ethers.Wallet(privateKey);

    const data: IShippingData = {
      user: signer.address,
      ammount: ethers.BigNumber.from("10"),
      timestamp: ethers.BigNumber.from(
        Math.floor(Date.now() / 1000).toString()
      ),
    };

    let signature: string;
    signature = await signShippingData(signer, data);

    console.log("signature", signature);

    signature = signature.substr(2);
    let r = "0x" + signature.slice(0, 64);
    let s = "0x" + signature.slice(64, 128);
    let v = "0x" + signature.slice(128, 130);

    await contract.claim(data, v, r, s);
  });
});
