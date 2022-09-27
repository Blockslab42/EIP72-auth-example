import type { NextPage } from 'next'
import { ethers, Wallet, BigNumber } from 'ethers'
import contractABI from '../../WalletHelpers/TestFIN.json'
import {
  contractAddress,
  targetChainId,
} from '../../WalletHelpers/contractVariables'
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import axios from 'axios'

export interface IData {
  user: string
  timestamp: Number
}

const Auth: NextPage = () => {
  const { account, provider, chainId } = useWeb3React()
  const [signer, setSigner] = useState<any>(null)
  const [contract, setContract] = useState<any>(null)

  const [sig, setSig] = useState<any>(null)

  useEffect(() => {
    if (!!provider && chainId == targetChainId) {
      const getSigner = provider.getSigner()
      setSigner(getSigner)
      setContract(new ethers.Contract(contractAddress, contractABI, getSigner))
    }
  }, [provider, chainId])

  useEffect(() => {
    if (!account) return
    console.log('account set')
    auth()
  }, [account])

  async function auth() {
    if (account) {
      if ((await contract.balanceOf(account)) > 0) {
        console.log('Access allowed')
      } else {
        console.log('Access declined')
      }
    }
  }

  async function claim() {
    console.log('go claim')
    const answer = await axios.post('api/signatureClaim', {
      user: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    })

    const signature = answer.data.sign.substr(2)
    const r = '0x' + signature.slice(0, 64)
    const s = '0x' + signature.slice(64, 128)
    const v = '0x' + signature.slice(128, 130)
    // contract.claim(answer.data.dataSigned, v, r, s)
  }

  return (
    <div>
      <ConnectWallet></ConnectWallet>
      {account ? (
        <div>
          <p>Your are connected</p>
          <button onClick={claim}>Claim</button>
        </div>
      ) : (
        <p>Your are not connected</p>
      )}
      <button onClick={claim}>Claim</button>
    </div>
  )
}

export default Auth
