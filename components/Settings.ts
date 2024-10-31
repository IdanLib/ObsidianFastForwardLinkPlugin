import RedirectPlugin from "../main";
import { App, Notice, PluginSettingTab, Setting } from "obsidian";

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
					this.showSwitchToNewTabSetting = value;
					this.plugin.changeSettings(value, false);
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
						this.plugin.changeSettings(true, value);
					});
				});

		new Setting(containerEl)
			.setName("Delete the _forwards Folder")
			.setDesc(
				"Before uninstalling the plugin, manually delete the `_forwards` folder to remove unnecessary files. This cannot be undone."
			)
			.addButton((button) => {
				button.setButtonText("Delete");
				button.setTooltip("Delete the _forwards folder.");
				button.setWarning();
				button.onClick((evt) => {
					const forwardsFolder =
						this.app.vault.getFolderByPath("_forwards");
					if (!forwardsFolder) {
						new Notice(
							"The _forwards folder cannot be found.",
							2000
						);
						return;
					}

					try {
						this.app.vault.delete(forwardsFolder, true);
						new Notice(
							"_forwards folder deleted successfully.",
							2000
						);
						this.plugin.redirectsFolder = null;
					} catch (error) {
						new Notice(
							"Could not delete the _forwards folder.",
							2000
						);
						console.error(error);
					}
				});
			});
	}
}
