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

		this.app.workspace.on("active-leaf-change", (leaf) => {
			console.log(leaf);
			// this.test();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RedirectSettingsTab(this.app, this));

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
	}
}
