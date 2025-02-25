import { App, normalizePath, PluginSettingTab, Setting } from 'obsidian';
import NotesPlugin from 'main';
import { FolderSuggest } from './suggesters/FolderSuggester';


export interface NotesSettings {
	demoSetup: boolean;
	noteTemplate: string;
	notesFolder: string;
}

export const DEFAULT_SETTINGS: Partial<NotesSettings> = {
	demoSetup: false,
	noteTemplate: 'tech/templates/notes/note.md',
	notesFolder: '',
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

		this.switchDemoSetupSetting(containerEl);
		this.addNotesFolderSetting(containerEl);

	}

	private switchDemoSetupSetting(containerEl: HTMLElement) {
		const desc = document.createDocumentFragment();
		desc.append(
			'Create all necessary folders and templates.',
			desc.createEl('br'),
			'Get acquainted with main functionality.',
			desc.createEl('br'),
			'Become guru of notes creating.'
		);
		new Setting(containerEl)
			.setName('Demo Setup')
			.setDesc(desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.demoSetup)
				.onChange(async (value) => {
					this.plugin.settings.demoSetup = value;
					await this.plugin.saveSettings();
					if (this.plugin.view) {
						this.plugin.view.updateView();
					}
				}));



	}

	private addNotesFolderSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName('Template folder location')
			.setDesc('Files in this folder will be available as templates.')
			.addSearch((search) => {
				new FolderSuggest(this.app, search.inputEl);
				search.setPlaceholder('Example: folder1/folder2')
					.setValue(this.plugin.settings.notesFolder)
					.onChange((newFolder) => {
						this.plugin.settings.notesFolder = normalizePath(newFolder);
						this.plugin.saveSettings();
					});
				// @ts-ignore
				search.containerEl.addClass('notes-search');
			});
	}
}
