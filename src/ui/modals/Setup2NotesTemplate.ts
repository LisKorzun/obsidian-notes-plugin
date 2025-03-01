import { App, Modal, normalizePath, Setting } from 'obsidian';
import { FileSuggester } from '../suggesters/FileSuggester';
import { fileOrFolderExists, fileHighlight } from '../../utils';
import { fileCreateFromTemplate } from '../../utils/fileCreateFromTemplate';
import { noteTemplate } from '../../templates/noteTemplate';

export class SetupNotesTemplate extends Modal {
	path: string;
	exists: boolean;
	buttonsContainer: HTMLElement;

	constructor(app: App, private onSubmit: (path: string | null) => void) {
		super(app);
		this.setTitle('2. Let\'s create Notes template');
		this.path = 'tech/templates/notes/note.md';
		this.exists = true;
	}

	async onOpen() {
		this.exists = await fileOrFolderExists(this.app, this.path);

		const { contentEl } = this;
		new Setting(contentEl)
			.setName('Use default template')
			.addToggle(toggle => toggle
				.setValue(true)
				.setDisabled(true));
		const descHeading = document.createDocumentFragment();
		descHeading.append(
			'Type the path to the folder for notes Template or choose the existing one.',
			descHeading.createEl('br'),
			'We suggest to use the default one ',
			descHeading.createEl('strong', { text: 'tech/templates/notes' }),
			'because it\'s the part of the process.',
		);
		new Setting(contentEl).setDesc(descHeading);

		const searchSetting = new Setting(contentEl)
			.addSearch((search) => {
				new FileSuggester(this.app, search.inputEl);
				search.setPlaceholder('Example: folder1/folder2')
					.setValue(this.path)
					.onChange(async (newFolder) => {
						console.log(newFolder);
						this.path = normalizePath(newFolder)
						this.exists = await fileOrFolderExists(this.app, this.path);
						await this.renderActions();
					})
				// @ts-ignore
				search.containerEl.addClass('templater_search');
				// search.inputEl.focus();
			})
		searchSetting.infoEl.remove();
		this.buttonsContainer = contentEl.createEl('div', { cls: 'folder_buttons' });
		await this.renderActions();

		const closeModal = () => {
			this.onSubmit(null);
			this.close()
		}

		contentEl.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeModal()
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async renderActions () {
		this.buttonsContainer.empty();
		new Setting(this.buttonsContainer)
			.addButton((button) => {
				button.setButtonText(this.exists? 'File exists' : 'Create a file')
					.setDisabled(this.exists)
					.setWarning()
					.onClick(async () => {
						await fileCreateFromTemplate(this.app, this.path, noteTemplate);
						await fileHighlight(this.app, this.path);
						await this.renderActions();
					});
			}).addButton((button) => {
			button.setButtonText('Save & Move')
				.setCta()
				.onClick(() => {
					this.onSubmit(this.path);
					this.close()
				});
		});

	}
}
