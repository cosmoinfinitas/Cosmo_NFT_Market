import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export default function Home() {
  const [nfts, setnfts] = useState([]);
  const [loadingState, setloadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/WdDPcNEp13tbJjIVhcDSDgjQe1-l_HSQ"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          tokenid: i.tokenId.toNumber(),
          price,
          name: meta.data.name,
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          description: meta.data.description,
        };
        return item;
      })
    );
    setnfts(items);
    setloadingState("loaded");
  }

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const tx = await contract.createMarketSale(nftaddress, nft.tokenid, {
      value: price,
    });

    await tx.wait();

    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className=" px-20 py-10 text-3xl ">No Items in the Marketplace</h1>
    );

  return (
    <div className="flex float-left h-screen bg-black w-full">
      <div>
        <div className="text-white font-extrabold text-5xl pt-5 pb-1 border-b-2 border-slate-400 flex">
          Collection Available
          <div className=" font-thin pl-3 text-lg pt-5">
            (These are Test NFTs only for Tests)
          </div>
        </div>
        <div className="pl-10 pt-10">
          <div className="grid gap-4 gap-y-8 md:grid-cols-2 lg:grid-cols-5 mb-16">
            {nfts.map((nft, i) => (
              <div
                key={i}
                className="bg-slate-900 rounded-md overflow-hidden relative shadow-md"
              >
                <div>
                  <img
                    className="w-full pr-5 pl-5 pb-4 pt-12 rounded-3xl border-b-2 border-slate-700 transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
                    src={nft.image}
                    alt="Recipe Title"
                  />
                </div>
                <div className="pr-4 pl-4 pt-2 pb-4">
                  <h2 className="text-black font-bold text-green-400">
                    {nft.name}
                  </h2>
                  <div className="flex justify-between mt-4 mb-4 text-gray-500">
                    <div className="flex justify-items-start">
                      <svg
                        width="32px"
                        height="32px"
                        viewBox="0 0 96 96"
                        fill="currentColor"
                        color="#fff"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48zM58.014 29.759L68.002 24 78 29.764l-.044.026v35.79l-9.941 5.727-.014.028-.018-.01-.025.015v-.03l-9.953-5.736v-12.74L47.99 58.566l-.008.005-.005-.013-9.98-5.75v12.76L28 71.329v-.043l-.006.046L18 65.569V29.758l.005.002L28.001 24l29.968 17.283.036-.005v-11.52h.009z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <span className="ml-1 lg:text-xl pl-3">{nft.price}</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="ml-1 lg:text-xl">1-2</span>
                    </div>
                  </div>
                  <p className="text-sm mb-2 text-gray-500">
                    {truncate(nft.description, 10)}
                  </p>
                  <button
                    className="bg-blue-500/0  text-white font-bold  rounded"
                    onClick={() => buyNFT(nft)}
                  >
                    Buy Now
                  </button>
                </div>
                <div className="absolute top-0 right-0 mt-4 mr-4 bg-green-400 text-white rounded-full pt-1 pb-1 pl-4 pr-5 text-xs uppercase">
                  <span>Medium</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
