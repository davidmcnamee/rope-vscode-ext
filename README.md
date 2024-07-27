# Rope (python refactoring) VSCode Extension

This is a VSCode Extension for [Rope](https://github.com/python-rope/rope), "the world's most advanced open source Python refactoring library".

It's really new! Currently it only supports a single operation: inline

## Requirements

You must have [`poetry`](https://python-poetry.org/docs/) installed in your PATH for this extension to work.

If you don't already have it installed, try `brew install pipx && pipx install poetry`

## Usage

1. Select the symbol that you want to refactor
2. Hit Cmd+Shift+P to open the command palette
3. Search "Refactor" to see the available Rope refactoring operations

## Extension Settings

There are none! (yet)

## Known Issues

* VSCode's undo feature won't work on the refactoring changes made by Rope
  * (this is probably something that can be fixed)
* I've personally found some bugs in the behavior of certain Rope refactoring operations, please put those in the [Rope gh repo](https://github.com/python-rope/rope) if you find any others
