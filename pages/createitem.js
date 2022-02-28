import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

function createitem() {
	const [fileUrl, setfileUrl] = useState(null);
	const [formInput, setformInput] = useState({
		price: "",
		name: "",
		description: "",
	});
	const router = useRouter();

	async function onChange(e) {
		const file = e.target.files[0];
		try {
			const added = await client.add(file, {
				progress: (prog) => console.log(`received: ${prog}`),
			});
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;
			setfileUrl(url);
		} catch (e) {
			console.log(e);
		}
	}

	async function createMarket() {
		const { name, description, price } = formInput;
		if (!name || !description || !price || !fileUrl) return;

		const data = JSON.stringify({
			name,
			description,
			image: fileUrl,
		});
		try {
			const added = await client.add(data);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;

			createSale(url);
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
	}

	async function createSale(url) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
		let transaction = await contract.createToken(url);
		let tx = await transaction.wait();
		let event = tx.events[0];
		let value = event.args[2];
		let tokenId = value.toNumber();
		const price = ethers.utils.parseUnits(formInput.price, "ether");

		contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);
		let listingPrice = await contract.getListingPrice();
		listingPrice = listingPrice.toString();

		transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
			value: listingPrice,
		});
		await transaction.wait();
		router.push("/");
	}

	return (
		<div className="flex justify-center bg-black overflow-hidden">
			<div className="w-1/2 flex flex-col pb-12 ">
				<div>
					<div className=" text-white font-extrabold text-4xl pb-6 pt-4">
						Create your own NFT
					</div>
				</div>
				<div className=" w-96">
					<div className="text-black font-extrabold pb-3">
						<div className=" text-white">Name</div>
						<input
							placeholder="Name of the Asset"
							className="mt-2 border rounded px-64 py-4"
							onChange={(e) =>
								setformInput({ ...formInput, name: e.target.value })
							}
						/>
					</div>
				</div>

				<div>
					<div className="text-black font-extrabold">
						<div className=" text-white"> Description </div>
						<textarea
							placeholder="Description of the item"
							className="mt-2 border rounded px-64 pt-7 text-"
							onChange={(e) =>
								setformInput({ ...formInput, description: e.target.value })
							}
						/>
					</div>
				</div>

				<div className=" text-black pt-3 font-extrabold flex float-left">
					<div className="flex justify-center pb-3">
						<div class="mb-3 xl:w-96">
							<div className=" text-white"> Price</div>
							<input
								className="mt-2 border rounded p-4 w-fit"
								placeholder="Enter price for one piece"
								onChange={(e) =>
									setformInput({ ...formInput, price: e.target.value })
								}
							/>
							<select
								className="form-select
                    text-base
                    font-normal
                    text-white
                    bg-black bg-clip-padding bg-no-repeat
                    pl-5
                    border-none
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-white focus:bg-black focus:outline-none"
								aria-label="Default select example"
							>
								<option selected>MATIC </option>
								<option value="1">ETH</option>
								<option value="2">WETH</option>
								<option value="3">BNB</option>
							</select>
						</div>
					</div>
				</div>
				<div className="pt-3 flex float-left mr-60">
					<div className="rounded-lg shadow-xl bg-black lg:w-1/2">
						<div className="m-4">
							<label className="inline-block mb-2 text-blue-500">
								Upload Image(jpg,png,svg,jpeg,gif)
							</label>
							<div className="flex items-center justify-center w-full">
								<label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-black hover:border-blue-300">
									<div className="flex flex-col items-center justify-center pt-7">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-12 h-12 text-blue-400 group-hover:text-gray-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
												clip-rule="evenodd"
											/>
										</svg>
										<p className="pt-1 text-sm tracking-wider text-blue-400 group-hover:text-blue-600">
											Select a file
										</p>
									</div>
									<input
										type="file"
										className="opacity-0"
										onChange={onChange}
									/>
								</label>
							</div>
						</div>
					</div>

					<div className=" pl-28 text-white">
						Preview
						{fileUrl && (
							<img className="rounded mt-4" width="600" src={fileUrl} />
						)}
					</div>
				</div>
				<div className="pt-5">
					<button
						onClick={createMarket}
						className="font-bold mt-4 bg-blue-500 text-white rounded px-4 py-2 w-40 animate-pulse"
					>
						Create item
					</button>
				</div>
			</div>
		</div>
	);
}
export default createitem;
