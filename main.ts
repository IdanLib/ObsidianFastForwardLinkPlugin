import { getLinkpath, Plugin, Notice, TFolder, TFile } from "obsidian";
import RedirectSettingsTab from "components/Settings";

// --- Setup ---
interface RedirectSettings {
	openInNewTab: boolean;
	switchToNewTab: boolean;
}

const DEFAULT_SETTINGS: RedirectSettings = {
	openInNewTab: false,
	switchToNewTab: false,
};

// --- Main Plugin Class ---
export default class RedirectPlugin extends Plugin {
	// --- Properties ---
	settings: RedirectSettings;
	redirectsFolder: TFolder | null = null;
	isMovingNote = false;
	isBypassRedirect = false;

	// --- Lifecycle methods and commands---
	async onload() {
		await this.loadSettings();

		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(async () => {
			await this.createRedirectsFolder();
			await this.redirect();
		});

		this.app.workspace.on("file-open", this.handleFileOpen);

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

		this.addCommand({
			id: "bypass-redirect",
			name: "Bypass redirect to target note",
			callback: () => {
				this.isBypassRedirect = true;
				new Notice("Bypassing redirects.");
			},
		});
	}

	onunload() {
		this.app.workspace.off("file-open", this.handleFileOpen);
	}

	// --- Event Handlers  ---
	handleFileOpen = async (file: TFile) => {
		if (this.isMovingNote) return;
		if (this.isBypassRedirect) {
			this.isBypassRedirect = false;
			return;
		}
		await this.redirect();
	};

	async changeSettings(newTab: boolean, switchToTab: boolean): Promise<void> {
		this.settings.openInNewTab = newTab;
		this.settings.switchToNewTab = switchToTab;
		await this.saveSettings();
	}

	// --- Core Logic ---
	private async redirect(): Promise<void> {
		const fileAndContent = await this.getCurrentFile();
		if (!fileAndContent) return;

		const { currentFile, content } = fileAndContent;
		const targetNoteFile = this.getTargetFile(content);
		if (!targetNoteFile) return;

		await this.moveRedirectNote(currentFile);
		await this.openTargetNote(targetNoteFile);
	}

	// --- Helper functions ---

	private async moveRedirectNote(
		redirectingNote: TFile | null
	): Promise<TFile | void> {
		if (
			!redirectingNote ||
			redirectingNote.path === `_forwards/${redirectingNote.name}`
		) {
			return;
		}

		new Notice(
			`Moving ${redirectingNote.name} to the _forwards folder.`,
			2000
		);

		if (!this.redirectsFolder) {
			await this.createRedirectsFolder();
		}

		try {
			this.isMovingNote = true;
			const redirectingNoteInFolder = await this.app.vault.copy(
				redirectingNote,
				`/_forwards/${redirectingNote.name}`
			);

			if (this.settings.openInNewTab) {
				await this.openTargetNote(redirectingNoteInFolder);
			}

			// Delay deletion to avoid race condition where the original note is deleted before the new note is fully opened in the UI.
			setTimeout(async () => {
				await this.deleteNote(redirectingNote);
				this.isMovingNote = false;
			}, 500);
		} catch (error) {
			this.isMovingNote = false;
			console.error(error);
		}
	}

	private async openTargetNote(targetNoteFile: TFile) {
		await this.app.workspace.openLinkText(
			targetNoteFile.name,
			targetNoteFile.path,
			this.settings.openInNewTab,
			{ active: this.settings.switchToNewTab }
		);
	}

	private async createRedirectsFolder() {
		try {
			this.redirectsFolder = await this.app.vault.createFolder(
				"/_forwards"
			);
		} catch (error) {
			console.warn(
				"`_forwards` folder not created or already exists.",
				error
			);
		}
	}

	private async getCurrentFile(): Promise<{
		currentFile: TFile;
		content: string;
	} | null> {
		const currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			return null;
		}
		return {
			currentFile: currentFile,
			content: (await this.getCurrentFileContent(currentFile)) || "",
		};
	}

	private async getCurrentFileContent(
		currentFile: TFile
	): Promise<string | null> {
		try {
			return await this.app.vault.read(currentFile);
		} catch (error) {
			new Notice(`Cannot read ${currentFile}.`);
			console.error(`Failed to read ${currentFile} content: `, error);
			return null;
		}
	}

	private getTargetFile(currentFileContent: string): TFile | null {
		const linkTextRegex = /::>\[\[(.*?)\]\]/i;
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

	// --- Settings Persistence ---
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
