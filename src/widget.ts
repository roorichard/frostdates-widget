import type { WidgetConfig, LocationOption, FrostDatesResponse } from './types';
import { searchLocations, fetchFrostDates } from './api';
import { renderResults, renderLoading, renderError, renderLimitReached, renderBranding } from './render';
import { WIDGET_CSS } from './styles';

export class FrostDatesWidget extends HTMLElement {
  private shadow: ShadowRoot;
  private siteId: string = '';
  private showBranding: boolean = true;
  private resultsArea!: HTMLDivElement;
  private dropdownList!: HTMLUListElement;
  private input!: HTMLInputElement;
  private searchBtn!: HTMLButtonElement;
  private options: LocationOption[] = [];
  private activeIndex: number = -1;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private lookupCount: number = 0;
  private maxFreeLookups: number = 2;
  private limitReached: boolean = false;
  private cache: Map<string, FrostDatesResponse> = new Map();

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.siteId = this.getAttribute('site-id') || '';
    this.showBranding = this.getAttribute('branding') !== 'false';

    if (!this.siteId) {
      this.shadow.innerHTML = '<p style="color:red;font-family:sans-serif;font-size:14px;">FrostDates Widget: missing site-id attribute.</p>';
      return;
    }

    if (this.getAttribute('theme') === 'dark') {
      this.classList.add('fd-dark');
    }

    this.render();
    this.bindEvents();
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = WIDGET_CSS;

    const container = document.createElement('div');
    container.className = 'fd-widget';
    container.innerHTML = `
      <div class="fd-dropdown">
        <div class="fd-search">
          <input type="text" placeholder="Enter a town, postal code, or lat,long..." aria-label="Location search" />
          <button type="button">Find</button>
        </div>
        <ul class="fd-dropdown-list" style="display:none;"></ul>
      </div>
      <div class="fd-results-area"></div>
      ${this.showBranding ? renderBranding() : ''}
    `;

    this.shadow.appendChild(style);
    this.shadow.appendChild(container);

    this.input = this.shadow.querySelector('input')!;
    this.searchBtn = this.shadow.querySelector('button')!;
    this.resultsArea = this.shadow.querySelector('.fd-results-area')!;
    this.dropdownList = this.shadow.querySelector('.fd-dropdown-list')!;
  }

  private bindEvents() {
    this.input.addEventListener('input', () => this.onInput());
    this.input.addEventListener('keydown', (e) => this.onKeyDown(e));
    this.searchBtn.addEventListener('click', () => this.onSubmit());

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target as Node)) {
        this.hideDropdown();
      }
    });
  }

  private onInput() {
    const query = this.input.value.trim();
    if (query.length < 3) {
      this.hideDropdown();
      return;
    }

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.doSearch(query), 300);
  }

  private async doSearch(query: string) {
    const results = await searchLocations(query, this.siteId);
    this.options = results;
    this.activeIndex = -1;

    if (results.length === 0) {
      this.hideDropdown();
      return;
    }

    this.dropdownList.innerHTML = results
      .map((opt, i) => `<li data-index="${i}">${escapeHtml(opt.areaName)}, ${escapeHtml(opt.region)}, ${escapeHtml(opt.country)}</li>`)
      .join('');

    this.dropdownList.style.display = 'block';

    // Bind click handlers
    this.dropdownList.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', () => {
        const idx = parseInt(li.getAttribute('data-index')!, 10);
        this.pickOption(idx);
      });
      li.addEventListener('mouseenter', () => {
        this.activeIndex = parseInt(li.getAttribute('data-index')!, 10);
        this.updateActiveItem();
      });
    });
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.options.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.onSubmit();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.options.length;
      this.updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + this.options.length) % this.options.length;
      this.updateActiveItem();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.activeIndex >= 0) {
        this.pickOption(this.activeIndex);
      } else {
        this.onSubmit();
      }
    }
  }

  private updateActiveItem() {
    this.dropdownList.querySelectorAll('li').forEach((li, i) => {
      li.classList.toggle('fd-active', i === this.activeIndex);
    });
  }

  private pickOption(index: number) {
    const opt = this.options[index];
    this.input.value = `${opt.areaName}, ${opt.region}, ${opt.country}`;
    this.hideDropdown();
    this.doLookup(`${opt.areaName},${opt.region},${opt.country}`);
  }

  private hideDropdown() {
    this.dropdownList.style.display = 'none';
    this.options = [];
    this.activeIndex = -1;
  }

  private onSubmit() {
    const query = this.input.value.trim();
    if (!query) return;
    this.hideDropdown();
    this.doLookup(query);
  }

  private async doLookup(location: string) {
    if (this.limitReached) {
      this.resultsArea.innerHTML = renderLimitReached();
      return;
    }

    const cacheKey = location.toLowerCase();
    if (this.cache.has(cacheKey)) {
      this.resultsArea.innerHTML = renderResults(this.cache.get(cacheKey)!);
      return;
    }

    this.resultsArea.innerHTML = renderLoading();
    this.searchBtn.disabled = true;

    try {
      const data = await fetchFrostDates(location, this.siteId);
      this.cache.set(cacheKey, data);
      this.lookupCount++;
      this.resultsArea.innerHTML = renderResults(data);

      // Check if limit reached (server will enforce this too,
      // but we track client-side for immediate feedback)
      if (this.lookupCount >= this.maxFreeLookups && this.showBranding) {
        this.limitReached = true;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      if (message.includes('limit') || message.includes('exceeded')) {
        this.limitReached = true;
        this.resultsArea.innerHTML = renderLimitReached();
      } else {
        this.resultsArea.innerHTML = renderError(message);
      }
    } finally {
      this.searchBtn.disabled = false;
    }
  }

  // Public method for programmatic init
  static init(config: WidgetConfig) {
    const container = typeof config.container === 'string'
      ? document.querySelector(config.container)
      : config.container;

    if (!container) {
      console.error('FrostDates Widget: container not found');
      return;
    }

    const widget = document.createElement('frostdates-widget');
    widget.setAttribute('site-id', config.siteId);
    if (config.theme) widget.setAttribute('theme', config.theme);
    container.appendChild(widget);
    return widget;
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
