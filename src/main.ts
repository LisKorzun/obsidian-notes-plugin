import { Plugin, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, NotesSettingTab, NotesSettings } from 'settings/settings';
import { NOTES_TOOLBAR_VIEW, NotesToolbarView } from './ui/views/NotesToolbarView';

export default class NotesPlugin extends Plugin {
	settings: NotesSettings;
	view: NotesToolbarView;

	async onload() {
		await this.loadSettings();

		this.registerView(
			NOTES_TOOLBAR_VIEW,
			(leaf) => (this.view = new NotesToolbarView(leaf, this))
		);

		this.addSettingTab(new NotesSettingTab(this.app, this));

		this.addCommand({
			id: 'open-my-view',
			name: 'Open My View',
			callback: () => {
				this.activateView();
			}
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(NOTES_TOOLBAR_VIEW);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: NOTES_TOOLBAR_VIEW, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf!);
	}
}
