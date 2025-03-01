import { App, Notice, TFile, Vault, normalizePath } from 'obsidian';
import { folderCreate } from './folderCreate';

export async function fileCreateFromTemplate(
	app: App,
	filePath: string,
	templateContent: string
): Promise<TFile | null> {
// Check if the file already exists
	const normalizedPath = normalizePath(filePath);
	const fileExists = app.vault.getAbstractFileByPath(normalizedPath);
	console.log(fileExists);
	if (fileExists) {
		console.log(`File already exists at ${filePath}`);
		return null;
	}

	// Extract the folder path from the file path
	const folderPath = normalizedPath.split('/').slice(0, -1).join('/');
	// Create the folder if it doesn't exist
	if (folderPath) {
		await folderCreate(app, folderPath);
	}

	try {
		// Create the file with the template content
		const newFile = await this.app.vault.create(normalizedPath, templateContent);
		console.log(`File created successfully at ${filePath}`);
		return newFile;
	} catch (error) {
		console.log(`Error creating file: ${filePath} - ${error.message}`);
		return null;
	}




	// const vault: Vault = app.vault;
	// const normalizedPath = normalizePath(filePath);
	//
	// try {
	// 	// Check if file already exists
	// 	const abstractFile = this.app.vault.getAbstractFileByPath(normalizedPath);
	//
	// 	if (abstractFile instanceof TFile) {
	// 		new Notice(`File already exists: ${filePath}`);
	// 		return null;
	// 	}
	// 	console.log(abstractFile);
	// 	console.log(normalizedPath, filePath, templateContent);
	//
	// 	// Create the file with the template content
	// 	const newFile = await vault.create(normalizedPath, templateContent);
	//
	// 	new Notice(`File created: ${filePath}`);
	// 	return newFile;
	//
	// } catch (error) {
	// 	console.error(`Error creating file: ${filePath}`, error);
	// 	new Notice(`Error creating file: ${filePath}`);
	// 	return null;
	// }
}
