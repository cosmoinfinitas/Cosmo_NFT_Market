import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftmarketaddress, nftaddress } from "../config";

import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
const truncate = (input, len) =>
	input.length > len ? `${input.substring(0, len)}...` : input;

export default function CreatorDashboard() {
	const [nfts, setNfts] = useState([]);
	const [sold, setSold] = useState([]);
	const [loadingState, setLoadingState] = useState("not-loaded");
	useEffect(() => {
		loadNFTs();
	}, []);
	async function loadNFTs() {
		const web3Modal = new Web3Modal({
			network: "mainnet",
			cacheProvider: true,
		});
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const marketContract = new ethers.Contract(
			nftmarket	address,
			Market.abi,
			signer
		);
		const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
		const data = await marketContract.fetchItemsCreated();

		const items = await Promise.all(
			data.map(async (i) => {
				const tokenUri = await tokenContract.tokenURI(i.tokenId);
				const meta = await axios.get(tokenUri);
				let price = ethers.utils.formatUnits(i.price.toString(), "ether");
				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					sold: i.sold,
					image: meta.data.image,
				};
				return item;
			})
		);
		/* create a filtered array of items that have been sold */
		const soldItems = items.filter((i) => i.sold);
		setSold(soldItems);
		setNfts(items);
		setLoadingState("loaded");
	}
	if (loadingState === "loaded" && !nfts.length)
		return <h1 className="py-10 px-20 text-3xl">No assets created</h1>;
	return (
		<div className="bg-black h-screen">
			<div className="p-4">
				<h2 className="text-2xl py-2 text-white font-extrabold pb-10">
					Items Created
				</h2>
				<div className=" flex space-x-5">
					{nfts.map((nft, i) => (
						<div key={i} className="border shadow rounded-xl overflow-hidden">
							<img
								src={nft.image}
								className="rounded max-h-36 border-b-2 border-slate-600 pl-6 pr-2 pb-2"
							/>
							<div className="p-4 bg-black">
								<p className="text-xl font-bold text-white">
									Price - {nft.price} MATIC
								</p>
								<p className=" text-white">
									NFT Seller: {truncate(nft.seller, 6)}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="px-4">
				{Boolean(sold.length) && (
					<div>
						<h2 className="text-2xl py-2 text-white font-extrabold pb-10 pt-5">
							Items sold
						</h2>
						<div className="flex space-x-5">
							{sold.map((nft, i) => (
								<div
									key={i}
									className="border shadow rounded-xl overflow-hidden"
								>
									<img
										src={nft.image}
										className="rounded max-h-36 border-b-2 border-slate-600 pl-6 pr-4 pb-2"
									/>
									<div className="p-4 bg-black">
										<p className="text-xl font-bold text-white">
											Price - {nft.price} MATIC
										</p>
										<p className="text-white">
											Owner now: {truncate(nft.owner, 5)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
