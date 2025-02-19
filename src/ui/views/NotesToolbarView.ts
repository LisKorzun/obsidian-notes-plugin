import { Notice, ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import { NotesSettings } from '../../settings/settings';
import NotesPlugin from '../../main';
import { FileNameModal } from '../modals/FileNameModal';

export const NOTES_TOOLBAR_VIEW = 'notes-toolbar-view';
export const NOTES_TOOLBAR_VIEW_TITLE = 'Notes Toolbar View';


export class NotesToolbarView extends ItemView {
	private settings: NotesSettings;
	private plugin: NotesPlugin;

	constructor(leaf: WorkspaceLeaf, settings: NotesSettings, plugin: NotesPlugin) {
		super(leaf);
		this.settings = settings;
		this.plugin = plugin;
	}


	getViewType() {
		return NOTES_TOOLBAR_VIEW;
	}

	getDisplayText() {
		return NOTES_TOOLBAR_VIEW_TITLE;
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl('h4', { text: NOTES_TOOLBAR_VIEW_TITLE });
		const button = container.createEl('button', { text: 'Create a note' });

		button.addEventListener('click', async () => {
			new FileNameModal(this.app, async (fileName: string | null) => {
				if (fileName) {
					let templateContent = '';
					try {
						console.log(this.settings.noteTemplate)
						const templateFile = this.app.vault.getAbstractFileByPath(this.settings.noteTemplate);
						console.log(templateFile);
						// if (!(templateFile instanceof TFile)) {
						// 	await this.plugin.createDefaultTemplate();
						// }

						const updatedTemplateFile = this.app.vault.getAbstractFileByPath(this.settings.noteTemplate);
						if (updatedTemplateFile instanceof TFile) {
							templateContent = await this.app.vault.read(updatedTemplateFile);
						} else {
							throw new Error('Template file not found after attempting to create default.');
						}


					} catch (e) {
						console.error('Error reading or creating template:', e);
						new Notice('Error reading or creating template file. Please check the template path and try again.');
						return; // Stop note creation if template is missing
					}
					// try {
					// 	const templateFile = this.app.vault.getAbstractFileByPath(this.settings.templatePath);
					// 	if (templateFile instanceof TFile) {
					// 		templateContent = await this.app.vault.read(templateFile);
					// 	} else {
					// 		new Notice("Template file not found.");
					// 		return;
					// 	}
					// } catch (e) {
					// 	console.error("Error reading template:", e);
					// 	new Notice("Error reading template file.");
					// 	return;
					// }

					const newNoteContent = templateContent
						.replace('{{title}}', fileName)
						.replace('{{subtitle}}', '') // Default empty subtitle
						.replace('{{parent}}', '') // Default empty parent
						.replace('{{order}}', ''); // Default empty order


					const normalizedNotePath = this.settings.notesFolder.startsWith('/') ? this.settings.notesFolder.slice(1) : this.settings.notesFolder;
					const fullPath = normalizedNotePath + '/' + fileName + '.md';
					const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'));

					try {
					// 	await this.plugin.createFolderIfNeeded(folderPath);
						await this.app.vault.create(fullPath, newNoteContent);
						new Notice(`Note "${fileName}" created successfully.`);

					} catch (e) {
						// Already handled in createFolderIfNeeded
					}
				}
			}).open(); // Open the modal immediately
		});
	}


	async onClose() {
		// Nothing to clean up.
	}
}
