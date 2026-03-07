import { FrostDatesWidget } from './widget';

// Register the custom element
if (!customElements.get('frostdates-widget')) {
  customElements.define('frostdates-widget', FrostDatesWidget);
}

// Expose on window for programmatic use
(window as Record<string, unknown>).FrostDatesWidget = FrostDatesWidget;

export { FrostDatesWidget };
export type { WidgetConfig, FrostDatesResponse } from './types';
