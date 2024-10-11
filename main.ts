import {
	getLinkpath,
	MarkdownView,
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

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(async () => {
			try {
				this.redirectsFolder = await this.app.vault.createFolder(
					"/_redirects"
				);
			} catch (error) {
				new Notice("The _redirects folder exists.", 3000);
				console.info(error);
			}
		});

		// this.app.workspace.onLayoutReady(() => {
		// 	this.redirect();
		// });

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

		const currentFileContent = await this.getCurrentFileContent();

		console.log(
			"in async redirect function, currentFileContent: ",
			currentFileContent
		);

		const targetNoteFile = this.getTargetFilePath(currentFileContent);

		console.log("targetNoteFile: ", targetNoteFile);

		// this.app.workspace.openLinkText(
		// 	targetNoteName,
		// 	targetNoteFile?.path as string,
		// 	this.settings.openInNewTab,
		// 	{ active: this.settings.switchToNewTab }
		// );

		// this.moveRedirectNoteToRedirectsFolder(redirectingNote);
	}
	getTargetFilePath(currentFileContent: string | null) {
		const linkTextRegex = /::>\[\[(.*[\w\s]*)\]\]/i;
		const targetNoteName = currentFileContent?.match(linkTextRegex)?.at(1);

		if (!targetNoteName) {
			return null;
		}

		return this.app.metadataCache.getFirstLinkpathDest(
			getLinkpath(targetNoteName),
			""
		);
	}

	async getCurrentFileContent() {
		const currentFile = this.app.workspace.getActiveFile();
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
