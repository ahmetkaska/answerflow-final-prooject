// SearchEngine.jsx

import React, { useState } from 'react';


function SearchEngine({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query); // Profil sayfasındaki onSearch fonksiyonuna sorguyu ilet
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Soru Ara..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">Soru Ara</button>
        </div>
    );
}

export default SearchEngine;
