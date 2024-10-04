// import RedirectPlugin from "../main";

import { Vault } from "obsidian";

export default async function vault() {
	console.log("in vault function");
	const vaultEl = new Vault();
	console.log("vaultEl: ", vaultEl);
	// await vaultEl.createFolder("./test_folder");
	const allFolders = vaultEl.getAllFolders(true);
	allFolders.forEach((folder) => console.log("folder: ", folder));
}
