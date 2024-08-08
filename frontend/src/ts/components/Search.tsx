import React, { useState, useEffect } from 'react';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

interface SearchComponentProps {
  initialResults: SearchResult[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({ initialResults }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);

  useEffect(() => {
    const filteredResults = initialResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [searchQuery, initialResults]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="search-component">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="検索キーワードを入力..."
        className="search-input"
      />
      <ul className="search-results">
        {searchResults.map(result => (
          <li key={result.id} className="search-result-item">
            <h3>{result.title}</h3>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;