import { App, Modal, Setting, normalizePath } from 'obsidian';

import { FolderSuggest } from 'ui/suggesters/FolderSuggester';
import { folderExists, folderHighlight, folderCreate } from 'utils';

export class SetupNotesFolder extends Modal {
	path: string;
	exists: boolean;
	buttonsContainer: HTMLElement;

	constructor(app: App, settingValue: string, private onSubmit: (path: string | null) => void) {
		super(app);
		this.setTitle('1. Notes Folder');
		this.path = settingValue || 'data/notes/mess';
		this.exists = true;
	}

	async onOpen() {
		this.exists = await folderExists(this.app, this.path);

		const { contentEl } = this;
		const descHeading = document.createDocumentFragment();
		descHeading.append(
			'Type the path to the folder or choose the existing one.',
			descHeading.createEl('br'),
			'We suggest to use the default one ',
			descHeading.createEl('strong', { text: 'data/notes/mess ' }),
			'because it\'s the part of the process.',
		);
		new Setting(contentEl).setDesc(descHeading);

		const searchSetting = new Setting(contentEl)
			.addSearch((search) => {
				new FolderSuggest(this.app, search.inputEl);
				search.setPlaceholder('Example: folder1/folder2')
					.setValue(this.path)
					.onChange(async (newFolder) => {
						this.path = normalizePath(newFolder)
						this.exists = await folderExists(this.app, this.path);
						await this.showContent();
					})
				// @ts-ignore
				search.containerEl.addClass('templater_search');
				// search.inputEl.focus();
			})
		searchSetting.infoEl.remove();

		this.buttonsContainer = contentEl.createEl('div', { cls: 'folder_buttons' });
		await this.showContent();

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

	async showContent () {
		this.buttonsContainer.empty();
		new Setting(this.buttonsContainer)
			.addButton((button) => {
				button.setButtonText(this.exists? 'Folder exists' : 'Create a folder')
				.setDisabled(this.exists)
				.setWarning()
				.onClick(async () => {
					await folderCreate(this.app, this.path);
					await folderHighlight(this.app, this.path);
					this.exists = await folderExists(this.app, this.path);
					await this.showContent();
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

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
