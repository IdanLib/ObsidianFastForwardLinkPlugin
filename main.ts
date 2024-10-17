import {
	getLinkpath,
	Plugin,
	Notice,
	TFolder,
	TFile,
	WorkspaceLeaf,
	OpenViewState,
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

// class Leaf extends WorkspaceLeaf {
// 	async openFile(file: TFile, openState?: OpenViewState): Promise<void> {
// 		return;
// 	}
// }

export default class RedirectPlugin extends Plugin {
	settings: RedirectSettings;
	redirectsFolder: TFolder | null = null;

	async changeSettings(newTab: boolean, switchToTab: boolean): Promise<void> {
		this.settings.openInNewTab = newTab;
		this.settings.switchToNewTab = switchToTab;
		await this.saveSettings();
	}

	private async createRedirectsFolder() {
		const currentRedirectsFolder =
			this.app.vault.getAbstractFileByPath("/_redirects");

		if (!currentRedirectsFolder) {
			try {
				this.redirectsFolder = await this.app.vault.createFolder(
					"/_redirects"
				);
			} catch (error) {
				new Notice("Failed to create the _redirects folder.", 3000);
				console.warn(error);
			}
		} else {
			// this.redirectsFolder = currentRedirectsFolder as TFolder;
			// new Notice("_redirects folder found.", 2000);
		}
	}

	private async redirect() {
		const currentFile = this.app.workspace.getActiveFile();
		const currentFileContent = await this.getCurrentFileContent(
			currentFile
		);

		if (!currentFileContent) {
			console.error(
				"Failed to load file content or no content available."
			);
			return;
		}

		const targetNoteFile = this.getTargetFile(currentFileContent);

		// console.log("targetNoteFile: ", targetNoteFile);

		if (!targetNoteFile) {
			// console.info("No target note file found.");
			return;
		}

		// console.log("this.settings: ", this.settings);

		const updatedRedirectingNote =
			await this.moveRedirectNoteToRedirectsFolder(currentFile);

		console.log(
			"updatedRedirectingNote returned from the move function: ",
			updatedRedirectingNote
		);
		if (updatedRedirectingNote) {
			// MOVE TO MOVE FILE FUNCTION, THAT'S LOGICALLY PART OF THE MOVING MECHANISM
			await this.app.workspace.openLinkText(
				updatedRedirectingNote.name,
				updatedRedirectingNote.path
			);
		}

		// await this.app.workspace.openLinkText(
		// 	targetNoteFile.name,
		// 	targetNoteFile.path,
		// 	this.settings.openInNewTab,
		// 	{ active: this.settings.switchToNewTab }
		// );
	}

	private async getCurrentFileContent(
		currentFile: TFile | null
	): Promise<string | null> {
		if (!currentFile) {
			console.error("No active file found!");
			return null;
		}

		try {
			return await this.app.vault.read(currentFile);
		} catch (error) {
			new Notice(`Cannot read ${currentFile}.`);
			console.error(
				console.error(`Failed to read ${currentFile} content: `, error)
			);
			return null;
		}
	}

	private getTargetFile(currentFileContent: string): TFile | null {
		const linkTextRegex = /::>\[\[(.*[\w\s]*)\]\]/i;
		const targetNoteName = currentFileContent.match(linkTextRegex)?.at(1);

		if (!targetNoteName) {
			console.info("No redirect syntax found.");
			return null;
		}
		const targetNoteFile = this.app.metadataCache.getFirstLinkpathDest(
			getLinkpath(targetNoteName),
			""
		);

		if (!targetNoteFile) {
			console.error(
				`No target note file found for target: ${targetNoteName}`
			);
			return null;
		}

		return targetNoteFile;
	}

	private async moveRedirectNoteToRedirectsFolder(
		redirectingNote: TFile | null
	): Promise<TFile | void> {
		if (!redirectingNote) {
			return;
		}

		if (!this.redirectsFolder) {
			await this.createRedirectsFolder();
		}

		try {
			await this.app.vault.copy(
				redirectingNote,
				`/_redirects/${redirectingNote.name}`
			);
		} catch (error) {
			// if (error.message.includes("Folder already exists.")) {
			// 	new Notice(
			// 		`File "${redirectingNote.name}" already exists in the _redirects folder.`,
			// 		2000
			// 	);
			// } else {
			new Notice(
				`Failed to move ${redirectingNote.name} to the _redirects folder.`,
				2000
			);
			// }
			console.warn(error);
			// return;
		}

		console.log("redirectingNote.path: ", redirectingNote.path);

		if (redirectingNote.path === `_redirects/${redirectingNote.name}`) {
			new Notice(
				`${redirectingNote.name} is in the _redirects folder.`,
				2000
			);
			return;
		}

		console.log("redirectingNote.path: ", redirectingNote.path);
		const updatedRedirectingNote = await this.deleteNote(redirectingNote);
		console.log("updatedRedirectingNote: ", updatedRedirectingNote);
		return updatedRedirectingNote;
	}

	private async deleteNote(orgRedirectingNote: TFile) {
		let updatedRedirectingNote = orgRedirectingNote;

		if (this.settings.openInNewTab) {
			updatedRedirectingNote = Object.create(orgRedirectingNote);
			console.log(
				"orgRedirectingNote after copying: ",
				orgRedirectingNote
			);

			updatedRedirectingNote.path = `_redirects/${orgRedirectingNote.path}`;

			console.log("updatedRedirectingNote: ", updatedRedirectingNote);
		}

		try {
			await this.app.vault.delete(orgRedirectingNote);
		} catch (error) {
			new Notice(
				"Failed to delete directing note from original location. Please delete manually."
			);
			console.error(error);
		}
		console.log("deleted the original redirecting note");

		return updatedRedirectingNote; // return to caller to open re-open directing tab in tab
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(async () => {
			await this.createRedirectsFolder();
			this.redirect();
		});

		this.app.workspace.on("file-open", (leaf) => {
			this.redirect();
		});
	}

	onunload() {
		this.app.workspace.off("file-open", this.redirect);
	}

	async loadSettings() {
		try {
			this.settings = Object.assign(
				{},
				DEFAULT_SETTINGS,
				await this.loadData()
			);
		} catch (error) {
			console.error("Failed to load settings: ", error);
		}
	}

	async saveSettings() {
		try {
			await this.saveData(this.settings);
		} catch (error) {
			console.error("Failed to save settings: ", error);
		}
	}
}
