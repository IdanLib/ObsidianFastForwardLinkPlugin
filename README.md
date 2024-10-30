# FastForwardLink

Fast-forward from multiple links to a single target note.

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

Screenshot or GIF showcasing FastForwardLink in action

## Features

-   **Multiple Links, One Target**: Set multiple links to redirect to a single target note for quick navigation between related topics or abbreviations. Organize synonyms or alternate spellings for easier access.

-   **Quick Keyboard Shortcut**: Press `Ctrl + Alt + R` to quickly create a forwarding link. Set target notes on the fly without breaking your writing flow.

-   **Organized Vault**: Streamline vault navigation by unifying concepts, perfect for efficient, clutter-free notes.

-   **Easy Management**: Forwarding notes are automatically moved to a designated folder for easy review, management, or removal.

-   **Flexible Forwarding Options**:

    -   Open the target note in the same tab.
    -   Open the target note in a new tab while remaining on the original note.
    -   Open the target note in a new tab and switch to it automatically.

-   **Remove Forwarding Notes in One Click**: Easily delete all redirecting notes with a single click using plugin settings.

## Installation and Use

### Installing FastForwardLink

To install FastForwardLink:

1. Download the FastForwardLink plugin file and place it in your vault's plugins folder at `{VaultFolder}/.obsidian/plugins/{your-plugin-name}/`.
2. In Obsidian, go to **Settings** > **Community Plugins** and enable **FastForwardLink**.

The plugin is now ready for use.

### Setting Up a Fast-Forward Link

To set up a fast-forwarding link:

1. Create or open the note you want to fast-forward to a target note. For example, a note titled `ps`.
2. In the note, type the target note's title wrapped in the forwarding syntax: `::>[[target-note]]`. For example, to forward from `ps` to `photoshop`, include `::>[[photoshop]]` in the `ps` note.

Clicking the `ps` link in any note now opens the `photoshop` note.

### Keyboard Shortcut

Yup, typing sucks. Fortunately, there's a keyboard shortcut to make it easier to create a forwarding note.

Press `Ctrl + Alt + R` (PC) or `Cmd + Opt + R` (macOS) to wrap selected text in the fast-forward syntax.

## Bugs and Contact

Found a bug? Well, we can't have those!

Please open an issue in the [plugin's GitHub repository](ADDLINK) or [contact the developer](mailto:idanlib@gmail.com) directly.

## Supporting this plugin

If you enjoy using FastForwardLink, consider supporting its development by [buying me a coffee](https://www.buymeacoffee.com/idanlib) or a cheesy slice!

[![Buy Me a Coffee](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG9iNnQwYzI4ajB5enBtMjd4czBzcDlveWJsdm1zYWdna21xZDNvMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7kZE0z52Sd9zSESzDA/giphy.gif)](https://www.buymeacoffee.com/idanlib)
