import { App, TFolder } from 'obsidian';

/**
 * Checks whether folder exists or not
 * @param app - The Obsidian App instance.
 * @param folderPath - The path of the folder to check.
 */
export async function folderExists(app: App, folderPath: string): Promise<boolean> {
	// Get the folder object
	const folder = app.vault.getFolderByPath(folderPath);

	return Promise.resolve(folder instanceof TFolder);
}
