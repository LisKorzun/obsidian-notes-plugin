import { ItemView, normalizePath, WorkspaceLeaf } from 'obsidian';
import NotesPlugin from 'main';
import { SetupNotesFolder } from 'ui/modals/Setup1NotesFolder';
import { SetupNotesTemplate } from '../modals/Setup2NotesTemplate';

export const NOTES_TOOLBAR_VIEW = 'notes-toolbar-view';
export const NOTES_TOOLBAR_VIEW_TITLE = 'Notes Toolbar View';


export class NotesToolbarView extends ItemView {
	private plugin: NotesPlugin;
	private setupButton: HTMLButtonElement | null;

	constructor(leaf: WorkspaceLeaf, plugin: NotesPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.setupButton = null;
	}


	getViewType() {
		return NOTES_TOOLBAR_VIEW;
	}

	getDisplayText() {
		return NOTES_TOOLBAR_VIEW_TITLE;
	}

	async onOpen() {
		this.updateView();
	}

	async onClose() {
		// Nothing to clean up.
	}

	updateView() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl('h4', { text: NOTES_TOOLBAR_VIEW_TITLE });

		if (this.plugin.settings.demoSetup) {
			if (this.setupButton) {
				this.setupButton.remove();
			}
		} else {
			if (!this.setupButton) {
				this.setupButton = container.createEl('button', { text: 'Demo Setup' });
				this.setupButton.addEventListener('click', this.onSetupClicked.bind(this));
			} else {
				container.appendChild(this.setupButton);
			}
		}

	}

	async onSetupClicked() {
		new SetupNotesFolder(this.app, this.plugin.settings.notesFolder, this.onSaveFolder.bind(this)).open();
	}

	async onSaveFolder(path: string | null): Promise<void> {
		if (path) {
			this.plugin.settings.notesFolder = normalizePath(path);
			await this.plugin.saveSettings();

			new SetupNotesTemplate(this.app, this.onSaveTemplate.bind(this)).open();
		}
	}

	async onSaveTemplate(path: string | null): Promise<void> {
		if (path) {
			this.plugin.settings.noteTemplate = normalizePath(path);
			await this.plugin.saveSettings();
		}
	}
}
