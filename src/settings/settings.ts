import { App, normalizePath, PluginSettingTab, Setting } from 'obsidian';
import NotesPlugin from 'main';
import { FolderSuggest } from 'ui/suggesters/FolderSuggester';
import { FileSuggester } from '../ui/suggesters/FileSuggester';
import { fileExists } from '../utils';
import { fileCreateFromTemplate } from '../utils/fileCreateFromTemplate';
import { rootNoteTemplate } from '../templates/rootNoteTemplate';


export interface NotesSettings {
	demoSetup: boolean;
	noteTemplate: string;
	notesFolder: string;
	rootNotePath: string;

}

export const DEFAULT_SETTINGS: Partial<NotesSettings> = {
	demoSetup: false,
	noteTemplate: 'tech/templates/notes/note.md',
	notesFolder: '',
	rootNotePath: 'data/notes/root.md'
}

export class NotesSettingTab extends PluginSettingTab {
	plugin: NotesPlugin;
	rootNoteExists: boolean;

	constructor(app: App, plugin: NotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.rootNoteExists = false;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName('Hierarchical Notes').setHeading();
		this.switchDemoSetupSetting(containerEl);
		this.addRootFileSetting(containerEl);
		this.addNotesFolderSetting(containerEl);
		this.addTemplateSetting(containerEl)

		new Setting(containerEl).setName('Diary Notes').setHeading();

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

	private addRootFileSetting(containerEl: HTMLElement) {
		const desc = document.createDocumentFragment();
		desc.append(
			'This is the root file which will be used as parent for cluster files.',
			desc.createEl('br'),
			'We recommend to use default.',
			desc.createEl('br'),
			'If it doesn\'t exist just create it.'
		);
		new Setting(containerEl)
			.setName('Root file location')
			.setDesc(desc)
			.addSearch(search => {
				new FileSuggester(this.app, search.inputEl);
				search.setPlaceholder('Example: folder/file.md')
					.setValue(this.plugin.settings.rootNotePath)
					.onChange(async (newFile) => {
						this.plugin.settings.rootNotePath = normalizePath(newFile);
						this.rootNoteExists = await fileExists(this.app, newFile);
						console.log(this.rootNoteExists);
						await this.plugin.saveSettings();
					})
				// @ts-ignore
				search.containerEl.addClass('templater_search');
				// search.inputEl.focus();
			})
			.addButton(button =>{
				button.setCta().setButtonText('Create').setDisabled(this.rootNoteExists).onClick(async() => {
					await fileCreateFromTemplate(this.app, this.plugin.settings.rootNotePath, rootNoteTemplate);
				})
			})
	}

	private addNotesFolderSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName('Notes folder location')
			.setDesc('All notes will be stored here.')
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

	private addTemplateSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName('Template folder location')
			.setDesc('This file will be used as notes template.')
			.addSearch((search) => {
				new FileSuggester(this.app, search.inputEl);
				search.setPlaceholder('Example: folder/file.md')
					.setValue(this.plugin.settings.noteTemplate)
					.onChange(async (newFile) => {
						this.plugin.settings.noteTemplate = normalizePath(newFile);
						await this.plugin.saveSettings();
					})
				// @ts-ignore
				search.containerEl.addClass('templater_search');
				// search.inputEl.focus();
			})
	}
}
