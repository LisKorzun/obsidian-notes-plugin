import { App, PluginSettingTab, Setting } from 'obsidian';
import NotesPlugin from '../main';
import { FolderSuggest } from './suggesters/FolderSuggester';


export interface NotesSettings {
	noteTemplate: string;
	notesFolder: string;
}

export const DEFAULT_SETTINGS: Partial<NotesSettings> = {
	noteTemplate: 'tech/templates/notes/note.md',
	notesFolder: 'data/notes/',
}

export class NotesSettingTab extends PluginSettingTab {
	plugin: NotesPlugin;

	constructor(app: App, plugin: NotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', {
			text: 'Notes plugin',
		});
		this.addNotesFolderSetting(containerEl);

	}

	private addNotesFolderSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName('Template folder location')
			.setDesc('Files in this folder will be available as templates.')
			.addSearch((search) => {
				new FolderSuggest(this.app, search.inputEl);
				search.setPlaceholder('Example: folder1/folder2')
					.setValue(this.plugin.settings.notesFolder)
					.onChange((new_folder) => {
						// Trim folder and Strip ending slash if there
						new_folder = new_folder.trim()
						new_folder = new_folder.replace(/\/$/, '');

						this.plugin.settings.notesFolder = new_folder;
						this.plugin.saveSettings();
					});
				// @ts-ignore
				search.containerEl.addClass('notes-search');
			});
	}
}
