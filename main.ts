import { getLinkpath, Plugin, Notice, TFolder, TFile } from "obsidian";
import RedirectSettingsTab from "components/Settings";
import { log } from "console";

interface RedirectSettings {
	openInNewTab: boolean;
	switchToNewTab: boolean;
	redirectsFolder: TFolder | null;
}

const DEFAULT_SETTINGS: RedirectSettings = {
	openInNewTab: false,
	switchToNewTab: false,
	redirectsFolder: null,
};

// class Leaf extends WorkspaceLeaf {
// 	async openFile(file: TFile, openState?: OpenViewState): Promise<void> {
// 		return;
// 	}
// }

export default class RedirectPlugin extends Plugin {
	settings: RedirectSettings;

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
				this.settings.redirectsFolder =
					await this.app.vault.createFolder("/_redirects");
			} catch (error) {
				new Notice("Failed to create the _redirects folder.", 3000);
				console.warn(error);
			}
		} else {
			new Notice("_redirects folder found.", 2000);
		}

		this.settings.redirectsFolder = currentRedirectsFolder as TFolder;
		// console.log(
		// 	"line 55, this.settings.redirectsFolder: ",
		// 	this.settings.redirectsFolder
		// );
	}

	private async redirect() {
		const currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			return;
		}
		const currentFileContent = (await this.getCurrentFileContent(
			currentFile
		)) as string;

		const targetNoteFile = this.getTargetFile(currentFileContent);

		if (!targetNoteFile) {
			return;
		}

		// const updatedRedirectingNote =
		await this.moveRedirectNoteToRedirectsFolder(currentFile);

		// console.log("currentFile: ", currentFile);
		// console.log(
		// 	"updatedRedirectingNote in redirect function: ",
		// 	updatedRedirectingNote
		// );

		// if (this.settings.openInNewTab && !updatedRedirectingNote) {
		// 	return;
		// }

		await this.app.workspace.openLinkText(
			targetNoteFile.name,
			targetNoteFile.path,
			this.settings.openInNewTab,
			{ active: this.settings.switchToNewTab }
		);

		// }
	}

	private async getCurrentFileContent(
		currentFile: TFile
	): Promise<string | null> {
		// if (!currentFile) {
		// 	console.error("No active file found!");
		// 	return null;
		// }

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

		if (!this.settings.redirectsFolder) {
			await this.createRedirectsFolder();

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
					`Failed to copy ${redirectingNote.name} to the _redirects folder.`,
					2000
				);
				// }
				console.warn(error);
				// return;
			}

			const redirectingNoteInFolder = await this.deleteNote(
				redirectingNote
			);

			if (!redirectingNoteInFolder) {
				return;
			}

			await this.app.workspace.openLinkText(
				redirectingNoteInFolder.name,
				redirectingNoteInFolder.path
			);

			return redirectingNoteInFolder;
		}
	}

	private async deleteNote(orgRedirectingNote: TFile): Promise<TFile | void> {
		let updatedRedirectingNote = orgRedirectingNote;

		if (
			orgRedirectingNote.path === `_redirects/${orgRedirectingNote.name}`
		) {
			new Notice(
				`${orgRedirectingNote.name} is in the _redirects folder.`,
				2000
			);
			return;
		}

		if (this.settings.openInNewTab) {
			updatedRedirectingNote = Object.create(orgRedirectingNote);
			updatedRedirectingNote.path = `_redirects/${orgRedirectingNote.path}`;
		}

		try {
			await this.app.vault.delete(orgRedirectingNote);
		} catch (error) {
			new Notice(
				"Failed to delete directing note from original location. Please delete manually."
			);
			console.error(error);
		}

		return updatedRedirectingNote;
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(async () => {
			await this.createRedirectsFolder();
			await this.redirect();
		});

		this.app.workspace.on("file-open", async (leaf) => {
			await this.redirect();
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
