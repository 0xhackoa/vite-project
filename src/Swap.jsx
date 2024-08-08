import React from 'react'
import {
  BitcoinOTA,
  BitcoinProvider,
  BitcoinNetwork,
} from "@catalogfi/wallets";
import {
  JsonRpcSigner,
  BrowserProvider,
  JsonRpcProvider,
  Wallet,
} from "ethers";
import { BitcoinWallet, EVMWallet } from "@catalogfi/wallets";
import {
  Orderbook,
  Chains,
  Assets,
  Actions,
  parseStatus,
  TESTNET_ORDERBOOK_API,
} from "@gardenfi/orderbook";
import { GardenJS } from "@gardenfi/core";

function Swap() {

async function subscribeToOrders () {

  const provider = new BitcoinProvider(BitcoinNetwork.Testnet);
  const signer = await new BrowserProvider(window.ethereum).getSigner();

  const ota = new BitcoinOTA(provider, signer);
  console.log(ota);

  const publicKey = await ota.getPublicKey();
  console.log(publicKey.toString("hex"));

  const address1 = await ota.getAddress();
  console.log(address1);

  const signer2 = await new BrowserProvider(window.ethereum).getSigner();
  const evmWallet = new EVMWallet(signer);

  console.log(evmWallet);

  const orderbook = await Orderbook.init({
    url: TESTNET_ORDERBOOK_API, // add this line only for testnet
    signer,
  });

  const wallets = {
    [Chains.bitcoin_testnet]: ota,
    [Chains.ethereum_sepolia]: evmWallet,
  };

  const garden = new GardenJS(orderbook, wallets);

  const sendAmount = 0.0001 * 1e8;
  const receiveAmount = (1) * sendAmount;

  const orderId = await garden.swap(
    Assets.bitcoin_testnet.BTC,
    Assets.ethereum_sepolia.WBTC,
    sendAmount,
    receiveAmount
  );
  const address = await evmWallet.getAddress();

       garden.subscribeOrders(address, async (orders) => {
         const order = orders.find((order) => order.ID === orderId);
         if (!order) return;

         const action = parseStatus(order);
         if (
           action === Actions.UserCanInitiate ||
           action === Actions.UserCanRedeem
         ) {
           const swapper = garden.getSwap(order);
           const swapOutput = await swapper.next();
           console.log(
             `Completed Action ${swapOutput.action} with transaction hash: ${swapOutput.output}`
           );
           
         }
       });
      }
  

  return (
    <>
      <button onClick={subscribeToOrders}>Swap</button>
    </>
  );
}

export default Swap