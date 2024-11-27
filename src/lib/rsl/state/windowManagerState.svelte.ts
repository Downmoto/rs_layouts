import type { WindowConfig } from '../config/windowConfig.js';
import type { WindowManagerConfig } from '../config/windowManagerConfig.js';
import type { WindowData } from '../config/types/WindowData.js';
import { getContext, setContext } from 'svelte';

export class WindowManager {
	private windows: WindowData[] = $state([]);
	private maxZIndex: number = 0;

	private windowConfig: WindowConfig;
	private windowManagerConfig: WindowManagerConfig;

	constructor(windowConfig: WindowConfig, windowManagerConfig: WindowManagerConfig) {
		this.windowConfig = windowConfig;
		this.windowManagerConfig = windowManagerConfig;
	}

	public createWindow() {
		const topLeft = this.windowManagerConfig.windowSpawnPoint;
		const botRight = {
			x: this.windowConfig.minWidth + this.windowManagerConfig.windowSpawnPoint.x,
			y: this.windowConfig.minHeight + this.windowManagerConfig.windowSpawnPoint.y
		};

		this.windows.push({
			id: crypto.randomUUID(),
			panes: [],
			topLeft,
			botRight,
			zIndex: ++this.maxZIndex
		});
	}

	public removeWindow(id: string) {
		this.windows.filter((value, index) => {
			if (value.id === id) {
				this.windows.splice(index, 1);
				return true;
			}
			return false;
		});
	}

	public bringWindowToFront(id: string) {
		const win = this.windows.find((w) => w.id === id);
		if (win) {
			win.zIndex = ++this.maxZIndex;
		}
	}

	public getWindows(): WindowData[] {
		return this.windows;
	}
}

const WINDOW_MANAGER_KEY = Symbol('windowManager');

export function setWindowManagerState(
	windowConfig: WindowConfig,
	windowManagerConfig: WindowManagerConfig
) {
	return setContext(WINDOW_MANAGER_KEY, new WindowManager(windowConfig, windowManagerConfig));
}

export function getWindowManagerState() {
	return getContext<ReturnType<typeof setWindowManagerState>>(WINDOW_MANAGER_KEY);
}
