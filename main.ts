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
			console.log("active-leaf-change: ", leaf);
			this.test();
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

		console.log("redirectTargetNote: ", targetNoteName);

		if (targetNoteName) {
			const targetNotePath = this.app.metadataCache.getFirstLinkpathDest(
				getLinkpath(targetNoteName),
				""
			);
			console.log("targetNotePath: ", targetNotePath);
			this.app.workspace.openLinkText(
				targetNoteName || "",
				targetNotePath?.path as string
				// true,
				// { active: true }
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

	// getTargetFile(): TFile | null {
	// 	// const currentFile = this.app.workspace.getActiveFile();
	// 	const targetFile = this.app.vault.getFileByPath("_redirects/js.md");
	// 	console.log(targetFile);

	// 	this.app.workspace.openLinkText(
	// 		targetFile?.name as string,
	// 		targetFile?.path as string,
	// 		false,
	// 		{
	// 			active: false,
	// 		}
	// 	);
	// 	return targetFile;
	// }
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

		new Setting(containerEl)
			.setName("Open target note in new tab.")
			.setDesc("Whether to open the target note in a new tab.")
			.addToggle((toggle) => {
				toggle.setValue(true);
				// toggle.setTooltip("");
				toggle.onChange((value) => {
					console.log(value);
					if (value) {
						console.log("Yes, open target note in new tab.");
						// show the next setting: a toggle whether to automatically change view to the new tab
					} else {
						console.log("No, open target note in same tab.");
						// hide the next setting: a toggle whether to automatically change view to the new tab. Also make sure to DISABLE THE DEPENDENT OPTION - whether to switch to the new tab
					}
				});
			});
		// .clear(); // Clears (ie removes) whatever the setting instance contains (in this case, the toggle switch)

		new Setting(containerEl)
			.setName("Switch view to new tab.")
			.setDesc(
				"When the target note opens in a new tab, whether to switch view to the new tab."
			)
			.addToggle((toggle) => {
				toggle.setValue(true);
				// toggle.setTooltip("");
				toggle.onChange((value) => {
					console.log(value);
					if (value) {
						console.log("Yes, switch to new tab.");
						// show the next setting: a toggle whether to automatically change view to the new tab
					} else {
						console.log("No, switch to new tab.");
						// hide the next setting: a toggle whether to automatically change view to the new tab
					}
				});
			});
		// .clear(); // Clears (ie removes) whatever the setting instance contains (in this case, the toggle switch)
	}
}
