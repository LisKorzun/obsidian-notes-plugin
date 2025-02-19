import { App, Modal } from 'obsidian';

export class FileNameModal extends Modal {
	constructor(app: App, private onSubmit: (fileName: string | null) => void) { // onSubmit callback
		super(app);
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl('h2', { text: 'Enter file name' });

		const input = contentEl.createEl('input', { type: 'text' });
		input.focus();


		const submitButton = contentEl.createEl('button', { text: 'Create' });

		submitButton.addEventListener('click', () => {
			this.onSubmit(input.value); // Call the callback with the file name
			this.close();
		});


		// Handle closing the modal without submitting
		const closeModal = () => {
			this.onSubmit(null); // Call the callback with null
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
}
