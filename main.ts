import {
	getLinkpath,
	MarkdownView,
	Plugin,
	Notice,
	TFolder,
	TFile,
} from "obsidian";
import RedirectSettingsTab from "components/Settings";

interface RedirectSettings {
	openInNewTab: boolean;
	switchToNewTab: boolean;
	// changeSettings(newTab: boolean, switchToTab: boolean): void;
}

const DEFAULT_SETTINGS: RedirectSettings = {
	openInNewTab: false,
	switchToNewTab: false,
	// changeSettings: function (newTab, switchToTab) {
	// 	// this is probably a bad idea because it alters properties of the instance as it is being initialized.
	// 	this.openInNewTab = newTab;
	// 	this.switchToNewTab = switchToTab;
	// },
};

export default class RedirectPlugin extends Plugin {
	settings: RedirectSettings;
	redirectsFolder: TFolder | null = null;

	changeSettings(newTab: boolean, switchToTab: boolean): void {
		this.settings.openInNewTab = newTab;
		this.settings.switchToNewTab = switchToTab;
	}

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(async () => {
			// const folders = this.app.vault.getAllFolders();
			// console.log(folders);
			// console.log(folders.find((folder) => folder.name === "_redirects"));
			try {
				this.redirectsFolder = await this.app.vault.createFolder(
					"/_redirects"
				);
				console.log(this.redirectsFolder);
			} catch (error) {
				// Nofity user that folder already exists
				new Notice("The `_redirects` folder exists.", 3000);
				console.error(error);
			}
		});

		// If first note is a redirecting note
		this.app.workspace.onLayoutReady(() => {
			this.redirect();
		});

		// Redirecting on active note change
		this.app.workspace.on("active-leaf-change", (leaf) => {
			this.redirect();
		});
	}

	redirect() {
		const currentMdView =
			this.app.workspace.getActiveViewOfType(MarkdownView);

		const linkTextRegex = /::>\[\[(.*[\w\s]*)\]\]/i;
		const targetNoteName = currentMdView
			?.getViewData()
			.match(linkTextRegex)
			?.at(1);

		if (!targetNoteName) {
			return;
		}

		const targetNotePath = this.app.metadataCache.getFirstLinkpathDest(
			getLinkpath(targetNoteName),
			""
		);

		this.app.workspace.openLinkText(
			targetNoteName,
			targetNotePath?.path as string,
			this.settings.openInNewTab,
			{ active: this.settings.switchToNewTab }
		);

		this.moveRedirectNoteToRedirectsFolder();
	}

	async moveRedirectNoteToRedirectsFolder() {
		console.log("in move function");

		const redirectingNote = this.app.workspace.getActiveFile() as TFile;
		console.log("redirectingNote: ", redirectingNote);
		try {
			const movedFile = await this.app.vault.copy(
				redirectingNote,
				`/_redirects/${redirectingNote.name}`
			);
			console.log(movedFile);
			// Tell user via Notice that redirecting note already exists in _redirects. Move manually?
		} catch (error) {
			console.log(error);
			console.log(redirectingNote);
			new Notice(
				`${redirectingNote.name} is already in the _redirects folder.`,
				3000
			);
		}

		// MAKE SURE TO NOT REMOVE THE REDIRECTING NOTE WHEN CLICKED INSIDE THE _REDIRECTS FOLDER!
		if (redirectingNote.path === `_redirects/${redirectingNote.name}`) {
			// console.log("yes we're in the redirects folder");
			return;
		}
		await this.app.vault.delete(redirectingNote);
	}

	onunload() {}

	async loadSettings() {
		console.log("loading data");
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		console.log("saving data");
		await this.saveData(this.settings);
	}
}
