# FastForwardLink

Fast-forward from multiple links to a single target note.

 <img src="fastforwardlink.jpeg" alt="Girl in a jacket" width="400">

## Introduction

FastForwardLink helps you write faster, keep your notes interconnected, and reduce navigation friction in your vault. This plugin allows you to set multiple links to open a single target note, effectively creating synonymous links. Use custom link abbreviations to type faster, establish conceptual connections between terms, navigate between notes quicker, and keep your vault organized.

For example, when discussing photo editing software, `ps` is often shorthand for `photoshop`. Without FastForwardLink, the link `[[ps]]` would navigate to a note titled `ps`. But with FastForwardLink, the `[[ps]]` link forwards you directly to your target note `photoshop` (or any other specified note).

Here are some examples of how you might set up FastForwardLink:

-   `ps` > `photoshop`
-   `js` > `javascript`
-   `tay tay` > `taylor swift`
-   `46` > `joe biden`
-   `e=mc2` > `Einstein's special theory of relativity`
-   `favorite film` > `bill and ted's bogus journey`

### FastForwardLink Plugin Demo

![demo](./plugin_demo.gif)

## Version Updates

### Version 1.1

Some improvements include:

-   You can now temporarily by pass forwarding with a designated command!
-   Source code refactored and better organized for future conributors.
-   Better robust event and error handling and messaging.

## Features

-   **Multiple Links, One Target**: Set multiple links to redirect to a single target note for quick navigation between related topics or abbreviations. Organize synonyms or alternate spellings for easier access.

-   **Quick-Paste Command**: Set target notes on the fly without breaking your writing flow. In the Obsidian command palette, select **Paste redirect syntax onto selection** to quickly create a forwarding link.

-   **Organized Vault**: Streamline vault navigation by unifying concepts, perfect for efficient, clutter-free notes.

-   **Easy Management**: Forwarding notes are automatically moved to a designated folder for easy review, management, or removal.

-   **Flexible Forwarding Options**:

    -   Open the target note in the same tab.
    -   Open the target note in a new tab while remaining on the original note.
    -   Open the target note in a new tab and switch to it automatically.

-   **Remove Forwarding Notes in One Click**: Easily delete all redirecting notes with a single click using plugin settings.

## Installation and Use

### Manual Installation

To manually install FastForwardLink:

1. [Download the following plugin files](https://github.com/IdanLib/ObsidianFastForwardLinkPlugin):

    - `data.json`
    - `main.js`
    - `manifest.json`

2. Copy these file to your vault's plugins folder at `{VaultFolder}/.obsidian/plugins/FastForwardLink`.
3. In Obsidian, go to **Settings** > **Community Plugins** and enable **FastForwardLink**.

The plugin is now ready for use.

### Create a Fast-Forward Link

To create a fast-forwarding link:

1. Create or open the note you want to fast-forward to a target note. For example, a note titled `ps`.
2. In the note, type the target note's title wrapped in the forwarding syntax: `::>[[target-note]]`. For example, to forward from `ps` to `photoshop`, include `::>[[photoshop]]` in the `ps` note.

Clicking the `ps` link in any note now opens the `photoshop` note.

### Quick-Paste Syntax

Yup, typing sucks. Fortunately, there's a command to help you quickly paste the redirect syntax into your code:

1. Press `Ctrl + P` to open the Obsisdian command palette.
2. Search for and select the command **Paste Redirect Syntax onto Selection**.

The command wraps the selected text in the fast-forward syntax.

> [!TIP] > [Add a hotkey](https://help.obsidian.md/User+interface/Hotkeys#Setting+hotkeys) to trigger this command! We recommend `Ctrl + Alt + R` (PC) or `Cmd + Opt + R` (macOS).

## Bugs and Contact

Found a bug? Well, we can't have those!

Please open an issue in the [plugin's GitHub repository](https://github.com/IdanLib/ObsidianFastForwardLinkPlugin) or [contact the developer](mailto:idanlib@gmail.com) directly.

### Known Bugs

-   When "Open the target note in a new tab" is enabled and the fast-forwarding note has not yet been moved to the `_forwards_` folder, some additional tabs are opened. This is likely due to internal timing issues in the Obsidian-OS interaction.

    When the fast-forwarding note is in the `_forwards` folder, plugin behavior is as expected.

## Supporting this plugin

If you enjoy using FastForwardLink, consider supporting its development by [buying me a coffee](https://www.buymeacoffee.com/idanlib) or a cheesy slice!

<div style="text-align: center;">
<a href="https://www.buymeacoffee.com/idanlib" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
</div>
