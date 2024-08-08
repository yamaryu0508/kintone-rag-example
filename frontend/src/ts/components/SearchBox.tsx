import React, { useState } from 'react';

import { css } from '@emotion/react';

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { API_ENDPOINT } from '../constants';

interface SearchResult {
  title: string;
  content: string;
  sourceUrl: string;
}

const styles = {
  container: css`
    position: fixed;
    bottom: 30px;
    // right: 30px;
    right: 100px;
  `,
  searchBox: css`
    width: 500px;
    height: 60vh;
    background-color: #fff;
    border: 1px solid #e3e7e8;
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e3e7e8;
  `,
  title: css`
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  `,
  closeButton: css`
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
    &:hover {
      color: #111827;
    }
  `,
  searchContainer: css`
    display: flex;
    padding: 8px;
    background-color: #f3f4f6;
    border-radius: 8px;
    margin: 16px;
  `,
  searchInputWrapper: css`
    display: flex;
    align-items: center;
    background-color: #ffffff;
    // border-radius: 8px;
    border-radius: 8px 0px 0px 8px;
    flex-grow: 1;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  `,
  searchInput: css`
    flex-grow: 1;
    background-color: transparent;
    color: #111827;
    padding: 12px 16px;
    border: none;
    font-size: 16px;
    &::placeholder {
      color: #9ca3af;
    }
    &:focus {
      outline: none;
    }
  `,
  iconButton: css`
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: color 0.3s ease;
    &:hover {
      color: #111827;
    }
  `,
  searchButton: css`
    background-color: #3498db;
    color: white;
    border: none;
    // border-radius: 8px;
    border-radius: 0px 8px 8px 0px;
    padding: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #4338ca;
    }
  `,
  resultContainer: css`
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px;
  `,
  resultItem: css`
    background-color: #f3f4f6;
    padding: 12px;
    margin-bottom: 6px;
    border-radius: 6px;
  `,
  resultTitle: css`
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  resultContent: css`
    color: #4b5563;
    margin-bottom: 4px;
    font-size: 14px;
    line-height: 1.3;
  `,
  resultLink: css`
    color: #3b82f6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  `,
  circleButton: css`
    width: 48px;
    height: 48px;
    background-color: #3498db;
    border-radius: 24px;
    border: 0;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      color: #eee;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
  `
};

const SearchBox: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    fetch(`${API_ENDPOINT}/api/chromadb/query`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({query: searchTerm}),
      referrerPolicy: "origin-when-cross-origin"
    })
      .then(res => res.json())
      .then(({documents, metadatas}) => {
        // console.log(res);
        const result = documents[0].map((document: string, i: number) => ({
          title: document,
          content: document,
          sourceUrl: metadatas[0][i].source
        }));
        console.log(result);
        setSearchResults(result);
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div css={styles.container}>
      {isOpen ? (
        <div css={styles.searchBox}>
          <div css={styles.header}>
            <h3 css={styles.title}>Vector Search</h3>
            <button css={styles.closeButton} onClick={() => setIsOpen(false)}>
              <ChevronDownIcon width={24} height={24} />
            </button>
          </div>
          <div css={styles.searchContainer}>
            <div css={styles.searchInputWrapper}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                css={styles.searchInput}
                placeholder="Search..."
              />
              {searchTerm && (
                <button onClick={clearSearch} css={styles.iconButton}>
                  <XMarkIcon width={20} height={20} />
                </button>
              )}
            </div>
            <button onClick={handleSearch} css={styles.searchButton}>
              <MagnifyingGlassIcon width={24} height={24} />
            </button>
          </div>
          <div css={styles.resultContainer}>
            {searchResults.map((result, index) => (
              <div key={index} css={styles.resultItem}>
                <h3 css={styles.resultTitle}>{result.title}</h3>
                <p css={styles.resultContent}>{result.content}</p>
                <a
                  href={result.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  css={styles.resultLink}
                >
                  {result.sourceUrl}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          css={css`
            width: 48px;
            height: 48px;
            background-color: #3498db;
            border-radius: 24px;
            border: 0;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

            &:hover {
              color: #eee;
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            }
          `}
          onClick={() => setIsOpen(true)}
        >
          <MagnifyingGlassIcon width={24} height={24} />
        </button>
      )}
    </div>
  );
};

export default SearchBox;