import { App, Modal, Setting } from 'obsidian';
import { fileExists } from '../../utils';

export class NewNoteFileNameModal extends Modal {
	name: string;
	exists: boolean;
	notesFolder: string;
	errorsContainer: HTMLElement;

	constructor(app: App, notesFolder: string, private onSubmit: (path: string | null) => void) {
		super(app);
		this.name = '';
		this.notesFolder = notesFolder;
		this.exists = false;
		this.setTitle('Type the note file name');
	}

	onOpen() {
		const { contentEl } = this;

		new Setting(contentEl).setDesc('Should be detailed as much as you are going to find it.');
		const nameInput = new Setting(contentEl).addText(input => {
			input.setPlaceholder('how are you going to search for it')
				.onChange(async (newName) => {
					this.name = newName;
					this.exists = await fileExists(this.app, `${this.notesFolder}/${this.name}`);
					await this.checkErrors();
				})
			input.inputEl.addClass('templater_search');
		})
		nameInput.infoEl.remove();
		this.errorsContainer = contentEl.createEl('div', { cls: 'validation-message' });


		const closeModal = () => {
			this.onSubmit(null);
			this.close()
		}

		contentEl.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeModal()
			}
			if (event.key === 'Enter') {
				event.preventDefault();
				if (this.exists) {
					console.log('exists')
					return;
				} else {
					this.onSubmit(`${this.notesFolder}/${this.name}.md`);
					this.close();
				}

			}
		});
	}

	async checkErrors() {
		this.errorsContainer.empty();
		if (this.exists) {
			this.errorsContainer.textContent = 'File with such name has already existed.';
		}


	}

	onClose() {
		const { contentEl } = this;
		console.log('onClose', contentEl);
		contentEl.empty();
	}
}
