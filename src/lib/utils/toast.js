import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

/* ---------------- ICONS ---------------- */
const ICONS = {
	add: `
	<svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
		<path d="M12 21s-7.5-4.35-10-8.5C.5 9 2.5 5 6 5c2 0 3.5 1 4 2 0.5-1 2-2 4-2 3.5 0 5.5 4 4 7.5-2.5 4.15-10 8.5-10 8.5z"/>
	</svg>`,

	remove: `
	<svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
		<path d="M12 21s-7.5-4.35-10-8.5C.5 9 2.5 5 6 5c2 0 3.5 1 4 2 0.5-1 2-2 4-2 3.5 0 5.5 4 4 7.5-2.5 4.15-10 8.5-10 8.5z"/>
		<line x1="3" y1="3" x2="21" y2="21" stroke="#111827" stroke-width="2"/>
	</svg>`,

	error: `
	<svg width="16" height="16" viewBox="0 0 24 24" fill="#f87171">
		<path d="M18 6L6 18M6 6l12 12"/>
	</svg>`
};

/* ---------------- SINGLE-TOAST CONTROLLER ---------------- */
let activeToast = null;

function showToast({ html, background = '#111827' }) {
	// Kill previous toast (queue limit = 1)
	if (activeToast) {
		activeToast.hideToast();
		activeToast = null;
	}

	activeToast = Toastify({
		duration: 2000,
		gravity: 'top',
		position: 'center',
		stopOnFocus: true,
		close: false,
		escapeMarkup: false,
		style: {
			background,
			border: '1px solid #374151',
			borderRadius: '10px',
			color: '#e5e7eb',
			fontSize: '13px',
			padding: '10px 14px'
		},
		text: html,
		onHidden: () => {
			activeToast = null; // cleanup
		}
	});

	activeToast.showToast();
}

/* ---------------- EXPORTS ---------------- */

export function toastAdded(title) {
	showToast({
		html: `
			<div style="display:flex;gap:8px;align-items:center">
				${ICONS.add}
				<span><b>Added</b> to Watchlist — ${title}</span>
			</div>
		`
	});
}

export function toastRemoved(title) {
	showToast({
		html: `
			<div style="display:flex;gap:8px;align-items:center">
				${ICONS.remove}
				<span><b>Removed</b> from Watchlist — ${title}</span>
			</div>
		`
	});
}

export function toastError(message) {
	showToast({
		background: '#7f1d1d',
		html: `
			<div style="display:flex;gap:8px;align-items:center">
				${ICONS.error}
				<span>${message}</span>
			</div>
		`
	});
}
