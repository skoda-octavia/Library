import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

interface Book {
  id: number;
  title: string;
  publisher: string;
  author: string;
  published: string;
  price: number;
}

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const loadBooks = async (query: string = '') => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/Books/available`, {
        params: { query },
      });
      setBooks(response.data);
      setError('');
    } catch (err) {
      setError('An error occurred while loading books.');
      setBooks([]);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSearch = () => {
    loadBooks(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      loadBooks(searchQuery);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Lista Książek</h2>

        <div className="mb-3 d-flex align-items-center">
          <input
            type="text"
            id="searchQuery"
            className="form-control me-2"
            placeholder="Wyszukaj książki po tytule"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Szukaj
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <table className="table table-striped" id="booksTable">
          <thead>
            <tr>
              <th>Id</th>
              <th>Tytuł</th>
              <th>Wydawca</th>
              <th>Autor</th>
              <th>Data Publikacji</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Brak książek do wyświetlenia.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>
                    <a href={`/books/details/${book.id}`}>{book.title}</a>
                  </td>
                  <td>{book.publisher}</td>
                  <td>{book.author}</td>
                  <td>{new Date(book.published).toLocaleDateString()}</td>
                  <td>{book.price.toLocaleString()} zł</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
