# FastForwardLink

Fast-forward from one or more notes to a single target note with ease. Create custom link abbreviations (like `ps` > `photoshop`) to type faster, create conceptual connections between terms, navigate between notes quicker, and keep your vault organized.

## Introduction

FastForwardLink lets you redirect multiple links to a single note, creating a seamless and organized navigation experience. You can Obsidian links that are effectively synonymous.

For example, including `[[ps]]` in a note would create or navigate to note called `ps`. With FastForwardLink, it would automatically forward you to the to real target note, titled `photoshop` (or anything else you've defined as the target note).

Common cases include:

-   `ps` > `photoshop`
-   `js` > `javascript`
-   `tay tay` > `taylor swift`
-   `46` > `joe biden`
-   `e=mc2` > `Einstein's special theory of relativity`
-   `favorite film` > `bill and ted's bogus journey`

FastForwardLink helps you write faster, keep your notes interconnected, and minimize navigation friction in your vault.

### FastForwardLink Demo

Screenshot or GIF showcasing FastForwardLink in action

## Features

-   Fast Forward Links: Redirect from one note to another automatically, ensuring smooth navigation across related topics or abbreviations.

-   Custom Shorthands and Synonyms: Create shorthand links like js that automatically redirect to your main javascript note. Organize synonyms or alternate spellings for easier access.

-   Quick Keyboard Shortcut: Use `Ctrl + Alt + R` to quickly set a target note, letting you add fast-forwards on the go without breaking your flow.

-   Simplify Your Vault: Keep your vault tidy by centralizing related notes and unifying similar concepts. Perfect for those who want organized, efficient navigation.

-   Keep forwards organized: Forwarding notes are automatically moved to a designated folder, for easy review, management, and removal.

-   Choose your preferred forwarding type. You can:

    -   Open the target note in the same tab.
    -   Open the target note in a new tab and remain on the forwarding tab.
    -   Open the target note in a new tab and automatically switch to it.

-   Remove forwarding notes easily: Delete all redirecting notes with a single click.

## Installation and Use

_How do I install FastForwardLink?_

1. Download the FastForwardLink plugin file and place it in your vault's plugins folder at `{VaultFolder}/.obsidian/plugins/{your-plugin-name}/`
2. Open Obsidian and click **Settings** > **Community Plugins**.
3. Enable **FastForwardLink**.

_How do I set up a link redirect?_

1. Create or open the note you’d like to forward you to a target note. This is the forwaring note. For example, when discussing photo editing, the term `ps` is commonly used as shorthand for `photoshop`.
2. Specify the target note's title, wrapped in the forwarding syntax: `::>[[target-note]]`.

_Typing sucks. Is there a keyboard shortcut?_

Yes! Press You can also press `Ctrl + Alt + R` to wrap the selected text in the forwarding syntax.

That's it! Whenever the forwarding note is opened, it will automatically forward you to the target note.

### Reporting Bugs and Contacting

Found a bug? Well, we can't have those!

Please open an issue in the [plugin's GitHub repository](ADDLINK), or [contact the developer](idanlib@gmail.com) directly.

## Support this Plugin

If you like this plugin, consider tipping me at [BuyMeACoffee.com](https://buymeacoffee.com/idanlib).

<a href="https://www.buymeacoffee.com/idanlib" target="_blank"><img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG9iNnQwYzI4ajB5enBtMjd4czBzcDlveWJsdm1zYWdna21xZDNvMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7kZE0z52Sd9zSESzDA/giphy.gif" alt="Buy Me A Coffee" height="300" width="300"></a>
