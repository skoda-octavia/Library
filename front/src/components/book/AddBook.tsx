import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarComponent from '../Navbar';

interface BookViewModel {
  title: string;
  publisher: string;
  author: string;
  published: string;
  price: string;
}

const AddBook: React.FC = () => {
  const [book, setBook] = useState<BookViewModel>({
    title: '',
    publisher: '',
    author: '',
    published: '',
    price: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    axios
      .post(
        `${apiUrl}/Books`,
        book,
        { headers: getAuthHeaders() }
      )
      .then(() => {
        setSuccessMessage('Book successfully added.');
        setTimeout(() => navigate('/books/manage'), 2000);
      })
      .catch((error) => {
        setErrorMessage('Failed to add book.');
        console.error(error);
      });
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-4">
        <h2>Add Book</h2>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={book.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              className="form-control"
              value={book.publisher}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              className="form-control"
              value={book.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="published">Published Date</label>
            <input
              type="date"
              id="published"
              name="published"
              className="form-control"
              value={book.published}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              id="price"
              name="price"
              className="form-control"
              value={book.price}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate('/books/manage')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
