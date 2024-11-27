import type { Snippet } from 'svelte';

export type WindowData = {
	id: string;
	panes: {title: string, content: Snippet}[];
	topLeft: Point;
	botRight: Point;
	zIndex: number;
};

export type Point = {
	x: number;
	y: number;
};
