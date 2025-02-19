import { Notice, ItemView, WorkspaceLeaf } from 'obsidian';
import NotesPlugin from 'main';

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
				this.setupButton.addEventListener('click', () => {
					new Notice('Button clicked!');
				});
			} else {
				container.appendChild(this.setupButton);
			}
		}

	}
}
