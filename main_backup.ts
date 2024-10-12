import {
	getLinkpath,
	Plugin,
	Notice,
	TFolder,
	TFile,
	FileView,
	TextFileView,
} from "obsidian";
import RedirectSettingsTab from "components/Settings";

interface RedirectSettings {
	openInNewTab: boolean;
	switchToNewTab: boolean;
}

const DEFAULT_SETTINGS: RedirectSettings = {
	openInNewTab: false,
	switchToNewTab: false,
};

export default class RedirectPlugin extends Plugin {
	settings: RedirectSettings;
	redirectsFolder: TFolder | null = null;

	changeSettings(newTab: boolean, switchToTab: boolean): void {
		this.settings.openInNewTab = newTab;
		this.settings.switchToNewTab = switchToTab;
	}

	async createRedirectsFolder() {
		try {
			this.redirectsFolder = await this.app.vault.createFolder(
				"/_redirects"
			);
		} catch (error) {
			new Notice("The _redirects folder exists.", 3000);
			console.info(error);
		}
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(async () => {
			await this.createRedirectsFolder();
		});

		this.app.workspace.onLayoutReady(() => {
			this.redirect();
		});

		this.app.workspace.on("file-open", (leaf) => {
			this.redirect();
		});
	}

	// redirect() {
	// 	console.log("redirect called");

	// 	const currentMdView =
	// 		this.app.workspace.getActiveViewOfType(MarkdownView);

	// 	console.log("in redirect function, currentMdView: ", currentMdView);

	// 	const redirectingNote = currentMdView?.file as TFile | null;

	// 	console.log("in redirect function, redirectingNote: ", redirectingNote);

	// 	// setTimeout(() => {
	// 	const redirectingNoteContent = currentMdView?.getViewData();
	// 	console.log("redirectingNoteContent: ", redirectingNoteContent);
	// 	// }, 100); // Adjust the delay as necessary (100ms or more)

	// 	const linkTextRegex = /::>\[\[(.*[\w\s]*)\]\]/i;
	// 	const targetNoteName = currentMdView
	// 		?.getViewData()
	// 		.match(linkTextRegex)
	// 		?.at(1);
	// 	console.log("targetNoteName: ", targetNoteName);

	// 	if (!targetNoteName) {
	// 		return;
	// 	}

	// 	const targetNoteFile = this.app.metadataCache.getFirstLinkpathDest(
	// 		getLinkpath(targetNoteName),
	// 		""
	// 	);

	// 	console.log("targetNoteFile: ", targetNoteFile);

	// 	this.app.workspace.openLinkText(
	// 		targetNoteName,
	// 		targetNoteFile?.path as string,
	// 		this.settings.openInNewTab,
	// 		{ active: this.settings.switchToNewTab }
	// 	);

	// 	// this.moveRedirectNoteToRedirectsFolder(redirectingNote);
	// }

	async redirect() {
		console.log("async redirect called");
		const currentFile = this.app.workspace.getActiveFile();

		const currentFileContent = await this.getCurrentFileContent(
			currentFile
		);

		console.log(
			"in async redirect function, currentFileContent: ",
			currentFileContent
		);

		if (!currentFileContent) {
			console.error(
				"Failed to load file content or no content available."
			);
			return; // Safely exit if file content is unavailable
		}

		const targetNoteFile = this.getTargetFilePath(currentFileContent);

		console.log("targetNoteFile: ", targetNoteFile);

		// TODO if not target note exists, create it
		if (!targetNoteFile) {
			console.error("No target note file found.");
			return; // Safely exit if target file is not found
		}

		await this.app.workspace.openLinkText(
			targetNoteFile.basename,
			targetNoteFile.path,
			this.settings.openInNewTab,
			{ active: this.settings.switchToNewTab }
		);

		this.moveRedirectNoteToRedirectsFolder(currentFile);
	}

	getTargetFilePath(currentFileContent: string | null) {
		const linkTextRegex = /::>\[\[(.*[\w\s]*)\]\]/i;
		const targetNoteName = currentFileContent?.match(linkTextRegex)?.at(1);

		console.log("targetNoteName: ", targetNoteName);
		if (!targetNoteName) {
			return null;
		}

		return this.app.metadataCache.getFirstLinkpathDest(
			getLinkpath(targetNoteName),
			""
		);
	}

	getCurrentFileContent(currentFile: TFile | null) {
		// const currentFile = this.app.workspace.getActiveFile();

		if (!currentFile) {
			console.error("No active file found!");
			return null;
		}

		return this.app.vault.read(currentFile);
	}

	async moveRedirectNoteToRedirectsFolder(redirectingNote: TFile | null) {
		// const redirectingNote = this.app.workspace.getActiveFile() as TFile;

		if (!redirectingNote) {
			return;
		}

		console.log(
			"in moveRedirectNoteToRedirectsFolder, redirectingNote: ",
			redirectingNote
		);

		await this.createRedirectsFolder();
		try {
			await this.app.vault.copy(
				redirectingNote,
				`/_redirects/${redirectingNote.name}`
			);
		} catch (error) {
			console.error(error);
			new Notice(
				`${redirectingNote.name} cannot be moved to the _redirects folder.`,
				2000
			);
			return;
		}

		if (redirectingNote.path === `_redirects/${redirectingNote.name}`) {
			new Notice(
				`${redirectingNote.name} is in the _redirects folder.`,
				2000
			);
			return;
		}
		await this.app.vault.delete(redirectingNote);
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
