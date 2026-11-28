import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { searchContent } from './searchData';
import './SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Compute search results directly using useMemo
  const results = useMemo(() => {
    return query.trim().length > 0 ? searchContent(query) : [];
  }, [query]);

  // Global keyboard shortcut: "/" to focus search, "Escape" to close
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't trigger "/" if user is already typing in an input, textarea, or contentEditable element
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable);

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        if (isOpen || query) {
          e.preventDefault();
          setIsOpen(false);
          setQuery('');
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, query]);

  // Handle clicking outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigate to target section and tab
  const handleSelectResult = useCallback((item) => {
    if (!item) return;

    // Dispatch tab switch if relevant
    if (item.target?.type === 'tab' && item.target.tab) {
      window.dispatchEvent(
        new CustomEvent('switch-materi-tab', {
          detail: {
            tab: item.target.tab,
            saltType: item.target.saltType,
          },
        })
      );
    }

    // Smooth scroll to the target element
    const elementId = item.target?.elementId;
    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }

    setIsOpen(false);
    inputRef.current?.blur();
  }, []);

  // Keyboard navigation within the dropdown
  const handleInputKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar-root" ref={containerRef}>
      {/* 1. Main Search Bar Input Field matching screenshot */}
      <div className={`search-input-wrapper ${isOpen ? 'focused' : ''}`}>
        <span className="search-icon-wrapper" aria-hidden="true">
          <svg
            className="search-magnifier-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          className="search-input-field"
          placeholder="Cari konsep atau materi..."
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setIsOpen(val.trim().length > 0);
            setSelectedIndex(0);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={handleInputKeyDown}
          aria-label="Cari konsep atau materi"
          aria-expanded={isOpen}
          aria-controls="search-results-dropdown"
          aria-autocomplete="list"
        />

        {/* Clear query button */}
        {query.length > 0 && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Hapus kata kunci pencarian"
            title="Hapus pencarian (Esc)"
          >
            ✕
          </button>
        )}

        {/* Keyboard shortcut badge "/" matching screenshot */}
        <button
          type="button"
          className="search-shortcut-badge"
          onClick={() => inputRef.current?.focus()}
          title="Pintasan cepat: tekan / pada keyboard"
          aria-hidden="true"
          tabIndex={-1}
        >
          /
        </button>
      </div>

      {/* 2. Search Results Dropdown Popover */}
      {isOpen && (
        <div
          className="search-dropdown-menu"
          id="search-results-dropdown"
          role="listbox"
        >
          {results.length > 0 ? (
            <>
              <div className="search-dropdown-header">
                <span className="search-count-tag">
                  Ditemukan {results.length} materi terkait &ldquo;{query}&rdquo;
                </span>
                <span className="search-shortcut-hint">Gunakan ↑↓ dan ↵</span>
              </div>

              <div className="search-results-list">
                {results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      className={`search-result-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="search-item-icon-box">
                        <span className="search-item-icon">{item.categoryIcon}</span>
                      </div>
                      <div className="search-item-info">
                        <div className="search-item-title-row">
                          <span className="search-item-title">{item.title}</span>
                          <span className="search-item-cat-badge">{item.category}</span>
                        </div>
                        <p className="search-item-desc">{item.description}</p>
                      </div>
                      <div className="search-item-arrow" aria-hidden="true">
                        →
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="search-dropdown-footer">
                <span>Tekan <kbd>↵</kbd> untuk membuka</span>
                <span><kbd>ESC</kbd> untuk menutup</span>
              </div>
            </>
          ) : (
            <div className="search-empty-state">
              <span className="search-empty-icon" aria-hidden="true">
                🔍
              </span>
              <p className="search-empty-message">
                Materi tidak ditemukan. Coba gunakan kata kunci lain.
              </p>
              <span className="search-empty-tips">
                Tips: coba cari &ldquo;garam asam&rdquo;, &ldquo;rumus pH&rdquo;, &ldquo;NaCl&rdquo;, atau &ldquo;Kw&rdquo;
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
