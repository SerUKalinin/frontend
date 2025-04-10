import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Поисковый запрос:', searchQuery);
            // Здесь будет логика поиска
        }
    };

    const toggleSearch = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div ref={searchRef} className={`search-wrapper ${isOpen ? 'open' : ''}`}>
            <button 
                type="button" 
                className={`search-trigger ${isOpen ? 'active' : ''}`}
                onClick={toggleSearch}
            >
                <i className="fas fa-search"></i>
            </button>
            
            <div className={`search-popup ${isOpen ? 'open' : ''}`}>
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button 
                            type="button" 
                            className="clear-button"
                            onClick={() => setSearchQuery('')}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SearchBar; 