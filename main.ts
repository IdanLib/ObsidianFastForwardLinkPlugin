import { getLinkpath, Plugin, Notice, TFolder, TFile } from "obsidian";
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

	redirectRef = async (file: TFile) => {
		await this.redirect();
	};

	async changeSettings(newTab: boolean, switchToTab: boolean): Promise<void> {
		this.settings.openInNewTab = newTab;
		this.settings.switchToNewTab = switchToTab;
		await this.saveSettings();
	}

	private async createRedirectsFolder() {
		try {
			this.redirectsFolder = await this.app.vault.createFolder(
				"/_forwards"
			);
		} catch (error) {
			console.warn(error);
		}
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

		await this.app.workspace.openLinkText(
			targetNoteFile.name,
			targetNoteFile.path,
			this.settings.openInNewTab,
			{ active: this.settings.switchToNewTab }
		);

		if (currentFile.path === `_forwards/${currentFile.name}`) {
			new Notice(`${currentFile.name} is in the _forwards folder.`, 2000);
			return;
		}

		await this.moveRedirectNote(currentFile);
	}

	private async getCurrentFileContent(
		currentFile: TFile
	): Promise<string | null> {
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
			return null;
		}
		const targetNoteFile = this.app.metadataCache.getFirstLinkpathDest(
			getLinkpath(targetNoteName),
			""
		);

		if (!targetNoteFile) {
			new Notice(
				"Target note not found. Create one and try again.",
				3500
			);
			console.error(
				`No target note file found for target: ${targetNoteName}. You can create one manually and try again.`
			);
			return null;
		}

		return targetNoteFile;
	}

	private async moveRedirectNote(
		redirectingNote: TFile | null
	): Promise<TFile | void> {
		if (!redirectingNote) {
			return;
		}

		if (!this.redirectsFolder) {
			await this.createRedirectsFolder();
		}

		try {
			const redirectingNoteInFolder = await this.app.vault.copy(
				redirectingNote,
				`/_forwards/${redirectingNote.name}`
			);

			if (this.settings.openInNewTab) {
				// Turn off event handler to avoid opening the target note twice
				this.app.workspace.off("file-open", this.redirectRef);

				await this.app.workspace
					.getLeaf()
					.openFile(redirectingNoteInFolder, {
						active: this.settings.switchToNewTab,
					});

				this.app.workspace.on("file-open", this.redirectRef);
			}

			setTimeout(async () => {
				await this.deleteNote(redirectingNote);
			}, 500);
		} catch (error) {
			console.error(error);
		}
	}

	private async deleteNote(orgRedirectingNote: TFile): Promise<void> {
		try {
			await this.app.fileManager.trashFile(orgRedirectingNote);
		} catch (error) {
			new Notice(
				"Failed to delete directing note from original location. Please delete manually.",
				4500
			);
			console.error(error);
		}
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(async () => {
			await this.createRedirectsFolder();
			await this.redirect();
		});

		this.app.workspace.on("file-open", this.redirectRef);

		this.addCommand({
			id: "paste-redirect-syntax",
			name: "Paste redirect syntax onto selection",
			editorCallback: (editor, view) => {
				const selection = editor.getSelection();
				editor.replaceSelection(`::>[[${selection}]]`);
				const { ch, line } = editor.getCursor();
				if (!selection) {
					editor.setCursor({
						ch: ch - 2,
						line: line,
					});
				}
			},
		});
	}

	onunload() {
		this.app.workspace.off("file-open", this.redirectRef);
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
