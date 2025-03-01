import { App, normalizePath, TFile } from 'obsidian';

/**
 * Highlights a folder in the Obsidian file manager.
 * @param app - The Obsidian App instance.
 * @param path - The path of the folder to highlight.
 */
export async function fileHighlight(app: App, path: string): Promise<void> {
	try {
		const normalizedPath = normalizePath(path);
		const file = app.vault.getFileByPath(normalizedPath);
		if (!(file instanceof TFile)) {
			console.log(`Folder not found at path: ${normalizedPath}`);
			return;
		}

		// Trigger a refresh of the file explorer to ensure the folder is visible
		const fileExplorer = app.workspace.getLeavesOfType('file-explorer')[0];

		if (fileExplorer) {
			const fileExplorerView = fileExplorer.view;
			if (fileExplorerView && 'revealInFolder' in fileExplorerView) {
				(fileExplorerView as any).revealInFolder(file);
			}
		}
	} catch (error) {
		console.log(error);
		return;
	}
}
