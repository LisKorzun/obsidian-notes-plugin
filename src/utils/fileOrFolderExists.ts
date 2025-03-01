import { App, normalizePath, TFile, TFolder } from 'obsidian';

/**
 * Checks whether folder exists or not
 * @param app - The Obsidian App instance.
 * @param path - The path of the folder to check.
 */
export async function fileOrFolderExists(app: App, path: string): Promise<boolean> {
	// Get the folder object
	const normalizedPath = normalizePath(path);
	const abstract = app.vault.getAbstractFileByPath(normalizedPath);

	return Promise.resolve(abstract instanceof TFolder || abstract instanceof TFile);
}
