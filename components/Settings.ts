import RedirectPlugin from "../main";

import { App, PluginSettingTab, Setting } from "obsidian";
// https://github.com/IdanLib/ObsidianRedirectPlugin/pull/4

export default class RedirectSettingsTab extends PluginSettingTab {
	plugin: RedirectPlugin;
	showSwitchToNewTabSetting: boolean;
	// openTargetNoteInNewTab: boolean;
	// switchToNewTab: boolean;

	constructor(app: App, plugin: RedirectPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		// this.openTargetNoteInNewTab = plugin.settings.openInNewTab; // Whether to open target note in new tab
		this.showSwitchToNewTabSetting = false; // When the target note opens in a new tab, whether to show the setting that controls automatically switching to the new tab.
		// this.switchToNewTab = plugin.settings.switchToNewTab; // Whether to switch to the new tab with the target note
	}

	display(): void {
		const { containerEl } = this;
		console.log("display() called");
		containerEl.empty();

		new Setting(containerEl)
			.setName("Open target note in new tab.")
			.setDesc("Whether to open the target note in a new tab.")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.openInNewTab);
				// toggle.setTooltip("");
				toggle.onChange((value) => {
					if (value) {
						console.log("Yes, open target note in new tab.");
						this.showSwitchToNewTabSetting = true;
						this.plugin.settings.changeSettings(true, false);
					} else {
						console.log("No, open target note in same tab.");
						this.showSwitchToNewTabSetting = false;
						this.plugin.settings.changeSettings(false, false);
					}
					this.display();
				});
			});

		this.showSwitchToNewTabSetting &&
			new Setting(containerEl)
				.setName("Switch view to new tab.")
				.setDesc(
					"When the target note opens in a new tab, whether to switch view to the new tab."
				)
				.addToggle((toggle) => {
					toggle.setValue(this.plugin.settings.switchToNewTab);
					toggle.onChange((value) => {
						console.log(value);
						if (value) {
							console.log("Yes, switch to the new tab.");
							this.plugin.settings.changeSettings(true, true);
						} else {
							console.log("No, don't switch to the new tab.");
							this.plugin.settings.changeSettings(true, true);
						}
					});
				});

		new Setting(containerEl)
			.setName("Delete Redirects Folder")
			.setDesc(
				"Before uninstalling plugin, manually delete the `_redirects` folder to remove unnecessary files."
			)
			.addButton((button) => {
				// console.log("button clicked");
				// console.log("button: ", button);
				button.setButtonText("Delete");
				button.setTooltip("Delete the Redirects folder.");
				button.onClick((evt) => {
					const redirectsFolder =
						this.app.vault.getFolderByPath("_redirects");
					if (!redirectsFolder) {
						return;
					}
					console.log("redirectsFolder: ", redirectsFolder);
					this.app.vault.delete(redirectsFolder, true);
				});
			});
	}
}
