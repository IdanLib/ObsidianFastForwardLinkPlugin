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
					if (value) {
						this.showSwitchToNewTabSetting = true;
						this.plugin.changeSettings(true, false);
					} else {
						this.showSwitchToNewTabSetting = false;
						this.plugin.changeSettings(false, false);
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
						if (value) {
							this.plugin.changeSettings(true, true);
						} else {
							this.plugin.changeSettings(true, false);
						}
					});
				});

		new Setting(containerEl)
			.setName("Delete Redirects Folder")
			.setDesc(
				"Before uninstalling the plugin, manually delete the `_redirects` folder to remove unnecessary files. This cannot be undone."
			)
			.addButton((button) => {
				button.setButtonText("Delete");
				button.setTooltip("Delete the Redirects folder.", { delay: 0 });
				button.setWarning();
				button.onClick((evt) => {
					const redirectsFolder =
						this.app.vault.getFolderByPath("_redirects");
					if (!redirectsFolder) {
						new Notice(
							"The _redirects folder cannot be found.",
							2000
						);
						return;
					}

					try {
						this.app.vault.delete(redirectsFolder, true);
						new Notice(
							"_redirects folder deleted successfully.",
							2000
						);
					} catch (error) {
						new Notice(
							"Could not delete the _redirects folder.",
							2000
						);
						console.error(error);
					}
				});
			});
	}
}
