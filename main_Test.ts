import test from "node:test";
import {
	App,
	Editor,
	FileView,
	getLinkpath,
	MarkdownView,
	Modal,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";

interface RedirectSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: RedirectSettings = {
	mySetting: "EDIT",
};

export default class RedirectPlugin extends Plugin {
	settings: RedirectSettings;

	addRedirectCount(): string {
		const markdownView =
			this.app.workspace.getActiveViewOfType(MarkdownView);
		// console.log(markdownView);
		if (!markdownView) {
			return "";
		}
		return "0 redirects";
	}

	async onload() {
		await this.loadSettings();

		// Adds the referring note count
		// this.app.workspace.onLayoutReady(() => {
		// 	const statusBarItemEl = this.addStatusBarItem();
		// 	// 	setIcon(statusBarItemEl, "corner-up-left");

		this.app.workspace.on("active-leaf-change", (leaf) => {
			// 		statusBarItemEl.setText(this.addRedirectCount());
			this.test();
		});

		// 	this.app.workspace.on("editor-change", () => {
		// 		setIcon(statusBarItemEl, "corner-up-left");

		// 		statusBarItemEl.setText(this.addRedirectCount());
		// 	});
		// });

		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Open sample modal (simple)",
		// 	callback: () => {
		// 		new RedirectModal(this.app).open();
		// 	},
		// 	hotkeys: [{ key: "m", modifiers: ["Alt", "Ctrl", "Meta"] }],
		// });

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "paste-your-mama",
			name: "Pastes 'your mama!' on a selection.",

			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection("your mama!");
			},
			hotkeys: [{ key: "v", modifiers: ["Ctrl", "Alt", "Meta"] }],
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RedirectSettingsTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );

		this.app.workspace.onLayoutReady(() => {
			// this.getTargetFile();
			this.test();
		});
	}
	test() {
		const currentFile = this.app.workspace.getActiveFile();
		console.log("currentFile: ", currentFile);

		const currentMdView =
			this.app.workspace.getActiveViewOfType(MarkdownView);

		console.log(
			"currentMdView.getViewData: ",
			currentMdView?.getViewData()
		);

		const linkTextRegex = /::>\[\[(.*[\w\s]*)\]\]/i;
		const targetNoteName = currentMdView
			?.getViewData()
			.match(linkTextRegex)
			?.at(1);

		console.log("redirectTargetText: ", targetNoteName);

		if (targetNoteName) {
			const targetNotePath = this.app.metadataCache.getFirstLinkpathDest(
				getLinkpath(targetNoteName as string),
				""
			);
			console.log("targetNotePath: ", targetNotePath);
			this.app.workspace.openLinkText(
				targetNoteName || "",
				targetNotePath?.path as string
			);
		} else {
			console.log("no redirect found");
		}
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

	getTargetFile(): TFile | null {
		// const currentFile = this.app.workspace.getActiveFile();
		const targetFile = this.app.vault.getFileByPath("_redirects/js.md");
		console.log(targetFile);

		this.app.workspace.openLinkText(
			targetFile?.name as string,
			targetFile?.path as string,
			false,
			{
				active: false,
			}
		);
		return targetFile;
	}
}

// class File extends FileView {
// 	constructor(leaf: WorkspaceLeaf) {
// 		super(leaf);
// 	}

// 	getViewType(): string {
// 		return "FileView";
// 	}

// 	getFile() {
// 		console.log(this.getDisplayText());
// 	}
// }

// class RedirectModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText("Define redirect here?");
// 	}

// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

class RedirectSettingsTab extends PluginSettingTab {
	plugin: RedirectPlugin;

	constructor(app: App, plugin: RedirectPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Automatic Redirect to Synonym")
			.setDesc("Whether to automatically redirect to the target note.")
			.addToggle((toggle) => {
				toggle.setValue(true);
				toggle.setTooltip("Well whaddaya know...");
				toggle.onChange((value) => {
					console.log(value);
					if (value) {
						console.log("true");
					} else {
						console.log("false");
					}
				});
			});

		// .addText((text) =>
		// 	text
		// 		.setPlaceholder("Enter your secret")
		// 		.setValue(this.plugin.settings.mySetting)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.mySetting = value;
		// 			await this.plugin.saveSettings();
		// 		})
		// );
	}
}
