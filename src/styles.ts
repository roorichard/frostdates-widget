export const WIDGET_CSS = `
:host {
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.fd-widget {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  width: 100%;
}

/* Search input */
.fd-search {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.fd-search input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}

.fd-search input:focus {
  border-color: #4a9c5b;
  box-shadow: 0 0 0 2px rgba(74, 156, 91, 0.2);
}

.fd-search input.fd-error {
  border-color: #e74c3c;
}

.fd-search button {
  padding: 10px 20px;
  background: #4a9c5b;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
}

.fd-search button:hover { background: #3d8a4e; }
.fd-search button:disabled { background: #aaa; cursor: not-allowed; }

/* Dropdown */
.fd-dropdown {
  position: relative;
}

.fd-dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  list-style: none;
}

.fd-dropdown-list li {
  padding: 8px 12px;
  cursor: pointer;
}

.fd-dropdown-list li:hover,
.fd-dropdown-list li.fd-active {
  background: #f0f7f1;
}

/* Messages */
.fd-message {
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
}

.fd-message-error {
  background: #fdf0ef;
  color: #c0392b;
  border: 1px solid #f5c6cb;
}

.fd-message-limit {
  background: #fff8e1;
  color: #856404;
  border: 1px solid #ffeeba;
}

.fd-message-limit a {
  color: #4a9c5b;
  font-weight: 600;
  text-decoration: none;
}

.fd-message-limit a:hover {
  text-decoration: underline;
}

/* Loading */
.fd-loading {
  text-align: center;
  padding: 20px;
  color: #888;
}

.fd-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top-color: #4a9c5b;
  border-radius: 50%;
  animation: fd-spin 0.8s linear infinite;
}

@keyframes fd-spin {
  to { transform: rotate(360deg); }
}

/* Results */
.fd-results {
  margin-top: 16px;
}

.fd-location-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.fd-location-name strong {
  color: #333;
}

.fd-zone {
  text-align: center;
  margin-bottom: 16px;
}

.fd-zone-label {
  font-size: 14px;
  color: #666;
}

.fd-zone-value {
  font-size: 28px;
  font-weight: 700;
  color: #4a9c5b;
}

/* Frost summary */
.fd-summary-text {
  font-size: 13px;
  color: #555;
  margin-bottom: 12px;
  line-height: 1.6;
}

.fd-summary-text strong {
  color: #333;
}

/* Timeline */
.fd-timeline-container {
  margin-top: 16px;
}

.fd-current-risk {
  font-size: 16px;
  margin-bottom: 4px;
}

.fd-current-risk strong {
  color: #333;
}

.fd-risk-note {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.fd-months {
  display: flex;
  font-size: 11px;
  color: #888;
  margin-bottom: 2px;
}

.fd-months span {
  flex: 1;
  text-align: center;
}

.fd-bar {
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.fd-segment { height: 100%; }
.fd-risk-safest { background: #4a9c5b; }
.fd-risk-air { background: #f0ad4e; }
.fd-risk-light-ground { background: #e67e22; }
.fd-risk-hard-ground { background: #e74c3c; }

.fd-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  list-style: none;
}

.fd-legend li {
  display: flex;
  align-items: center;
  gap: 4px;
}

.fd-legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* Frost table */
.fd-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 13px;
}

.fd-table th,
.fd-table td {
  padding: 6px 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.fd-table th {
  font-weight: 600;
  color: #666;
}

.fd-table td {
  text-align: right;
}

.fd-table th:first-child {
  text-align: left;
}

/* Branding */
.fd-branding {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 11px;
  color: #999;
}

.fd-branding a {
  color: #4a9c5b;
  text-decoration: none;
  font-weight: 600;
}

.fd-branding a:hover {
  text-decoration: underline;
}

/* Divider */
.fd-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 16px 0;
}

/* Dark theme */
:host(.fd-dark) .fd-widget {
  background: #1a1a2e;
  border-color: #333;
  color: #e0e0e0;
}

:host(.fd-dark) .fd-search input {
  background: #16213e;
  border-color: #444;
  color: #e0e0e0;
}

:host(.fd-dark) .fd-dropdown-list {
  background: #16213e;
  border-color: #444;
}

:host(.fd-dark) .fd-dropdown-list li:hover,
:host(.fd-dark) .fd-dropdown-list li.fd-active {
  background: #1a1a2e;
}

:host(.fd-dark) .fd-table th,
:host(.fd-dark) .fd-table td {
  border-color: #333;
}

:host(.fd-dark) .fd-divider {
  border-color: #333;
}

:host(.fd-dark) .fd-branding {
  border-color: #333;
}
`;
