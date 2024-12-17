import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../Navbar";

interface Book {
  id: number;
  title: string;
  publisher: string;
  author: string;
  price: number;
  unavailable: boolean;
}

const ManageBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/Books`, { headers: getAuthHeaders() })
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        setErrorMessage("Nie udało się pobrać książek.");
        console.error(error);
      });
  }, [apiUrl]);

  const fetchBooks = () => {
    axios
      .get(`${apiUrl}/Books`, { headers: getAuthHeaders() })
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        setErrorMessage("Nie udało się pobrać książek.");
        console.error(error);
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę książkę?")) {
      axios
        .delete(`${apiUrl}/Books/${id}`, { headers: getAuthHeaders() })
        .then(() => {
          fetchBooks();
        })
        .catch((error) => {
          setErrorMessage("Nie udało się usunąć książki.");
          console.error(error);
        });
    }
  };

  return (
    <div>
        <NavbarComponent></NavbarComponent>
        <div>
      <h2>Manage Books</h2>

      <div className="mb-3">
        <button
          className="btn btn-success"
          onClick={() => navigate("/books/add")}
        >
          Add Book
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Publisher</th>
            <th>Author</th>
            <th>Price</th>
            <th>Unavailable</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.publisher}</td>
              <td>{book.author}</td>
              <td>{book.price}</td>
              <td>
                {book.unavailable ? (
                  <span className="badge bg-danger">Unavailable</span>
                ) : (
                  <span className="badge bg-success">Available</span>
                )}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/books/edit/${book.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ManageBooks;
