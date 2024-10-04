import RedirectPlugin from "../main";

import { App, PluginSettingTab, Setting } from "obsidian";

export default class RedirectSettingsTab extends PluginSettingTab {
	plugin: RedirectPlugin;
	showViewActiveTabSetting: boolean;
	openTargetNoteInNewTabState: boolean;

	constructor(app: App, plugin: RedirectPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.showViewActiveTabSetting = false;
		this.openTargetNoteInNewTabState = false;
	}

	// hide() {
	// 	console.log("Calling hide()");
	// }

	display(): void {
		const { containerEl } = this;
		console.log("display() called");
		containerEl.empty();

		// new Setting(containerEl)
		// 	.setName("Automatic Redirect to Synonym")
		// 	.setDesc("Whether to automatically redirect to the target note.")
		// 	.addToggle((toggle) => {
		// 		toggle.setValue(true);
		// 		toggle.setTooltip(
		// 			"Automatically redirects you to the target note."
		// 		);
		// 		toggle.onChange((value) => {
		// 			console.log(value);
		// 			if (value) {
		// 				console.log("true");
		// 			} else {
		// 				console.log("false");
		// 			}
		// 		});
		// 	});

		new Setting(containerEl)
			.setName("Open target note in new tab.")
			.setDesc("Whether to open the target note in a new tab.")
			.addToggle((toggle) => {
				toggle.setValue(this.openTargetNoteInNewTabState);
				// toggle.setTooltip("");
				toggle.onChange((value) => {
					// console.log(value);
					if (value) {
						console.log("Yes, open target note in new tab.");
						this.openTargetNoteInNewTabState = value;
						this.showViewActiveTabSetting = true;
						// show the next setting: a toggle whether to automatically change view to the new tab
						this.display();
					} else {
						console.log("No, open target note in same tab.");
						this.openTargetNoteInNewTabState = false;
						this.showViewActiveTabSetting = false;
						// viewActiveTabSetting(false);
						this.display();
					}
				});
			});

		// function viewActiveTabSetting(show: boolean) {
		// console.log("in viewActiveTabSetting");
		if (!this.showViewActiveTabSetting) {
			return;
		}

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
	}
}
// }
