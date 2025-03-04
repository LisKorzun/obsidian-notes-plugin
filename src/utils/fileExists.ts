import { App, normalizePath, TFile } from 'obsidian';

/**
 * Checks whether folder exists or not
 * @param app - The Obsidian App instance.
 * @param path - The path of the folder to check.
 */
export async function fileExists(app: App, path: string): Promise<boolean> {

	const normalizedPath = normalizePath(path);
	const file = app.vault.getFileByPath(`${normalizedPath}.md`);

	return Promise.resolve(file instanceof TFile);
}
