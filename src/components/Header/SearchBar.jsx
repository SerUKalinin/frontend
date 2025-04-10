import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Здесь будет логика поиска
        console.log('Поисковый запрос:', searchQuery);
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
            <i className="fas fa-search search-icon"></i>
            <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
        </form>
    );
};

export default SearchBar; 