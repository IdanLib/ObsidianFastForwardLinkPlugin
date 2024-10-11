import RedirectPlugin from "../main";

import { App, PluginSettingTab, Setting } from "obsidian";

export default class RedirectSettingsTab extends PluginSettingTab {
	plugin: RedirectPlugin;
	showSwitchToNewTabSetting: boolean;

	constructor(app: App, plugin: RedirectPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.showSwitchToNewTabSetting = this.plugin.settings.openInNewTab;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Open target note in new tab.")
			.setDesc("Whether to open the target note in a new tab.")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.openInNewTab);
				toggle.onChange((value) => {
					if (value) {
						this.showSwitchToNewTabSetting = true;
						this.plugin.changeSettings(true, false);
					} else {
						this.showSwitchToNewTabSetting = false;
						this.plugin.changeSettings(false, false);
					}
					this.plugin.saveSettings();
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
						if (value) {
							this.plugin.changeSettings(true, true);
						} else {
							this.plugin.changeSettings(true, false);
						}
						this.plugin.saveSettings();
					});
				});

		new Setting(containerEl)
			.setName("Delete Redirects Folder")
			.setDesc(
				"Before uninstalling plugin, manually delete the `_redirects` folder to remove unnecessary files."
			)
			.addButton((button) => {
				button.setButtonText("Delete");
				button.setTooltip("Delete the Redirects folder.");
				button.onClick((evt) => {
					const redirectsFolder =
						this.app.vault.getFolderByPath("_redirects");
					if (!redirectsFolder) {
						return;
					}
					this.app.vault.delete(redirectsFolder, true);
				});
			});
	}
}
