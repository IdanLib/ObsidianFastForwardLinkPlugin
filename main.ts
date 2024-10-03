import { getLinkpath, MarkdownView, Plugin } from "obsidian";

import RedirectSettingsTab from "components/Settings";

interface RedirectSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: RedirectSettings = {
	mySetting: "EDIT",
};

export default class RedirectPlugin extends Plugin {
	settings: RedirectSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		this.app.workspace.on("active-leaf-change", (leaf) => {
			console.log("active-leaf-change: ", leaf);
			this.redirect(false, false);
		});

		// This adds a settings tab so the user can configure various aspects of the plugin

		this.app.workspace.onLayoutReady(() => {
			this.redirect(false, false);
		});
	}

	redirect(newTab: boolean, viewNewTab: boolean) {
		// const currentFile = this.app.workspace.getActiveFile();
		// console.log("currentFile: ", currentFile);

		const currentMdView =
			this.app.workspace.getActiveViewOfType(MarkdownView);

		// console.log(
		// 	"currentMdView.getViewData: ",
		// 	currentMdView?.getViewData()
		// );

		const linkTextRegex = /::>\[\[(.*[\w\s]*)\]\]/i;
		const targetNoteName = currentMdView
			?.getViewData()
			.match(linkTextRegex)
			?.at(1);

		// console.log("redirectTargetNote: ", targetNoteName);

		if (!targetNoteName) {
			return;
		}

		const targetNotePath = this.app.metadataCache.getFirstLinkpathDest(
			getLinkpath(targetNoteName),
			""
		);
		// console.log("targetNotePath: ", targetNotePath);
		this.app.workspace.openLinkText(
			targetNoteName || "",
			targetNotePath?.path as string,
			newTab,
			{ active: viewNewTab }
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
