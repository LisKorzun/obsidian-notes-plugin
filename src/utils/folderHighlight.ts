import { App, Notice, TFolder } from 'obsidian';

/**
 * Highlights a folder in the Obsidian file manager.
 * @param app - The Obsidian App instance.
 * @param folderPath - The path of the folder to highlight.
 */
export async function folderHighlight(app: App, folderPath: string): Promise<void> {
	try {
		// Get the folder object
		const folder = app.vault.getFolderByPath(folderPath);
		if (!(folder instanceof TFolder)) {
			new Notice(`Folder not found at path: ${folderPath}`);
			return;
		}

		// Trigger a refresh of the file explorer to ensure the folder is visible
		const fileExplorer = app.workspace.getLeavesOfType('file-explorer')[0];

		if (fileExplorer) {
			const fileExplorerView = fileExplorer.view;
			if (fileExplorerView && 'revealInFolder' in fileExplorerView) {
				(fileExplorerView as any).revealInFolder(folder);
			}
		}
	} catch (error) {
		console.log(error);
		return;
	}
}
