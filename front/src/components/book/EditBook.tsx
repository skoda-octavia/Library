import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "../Navbar";

interface BookViewModel {
  id: number;
  title: string;
  publisher: string;
  author: string;
  published: string;
  price: string;
  unavailable: boolean;
  rowVersion: string;
}

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<BookViewModel>({
    id: 0,
    title: "",
    publisher: "",
    author: "",
    published: "",
    price: "",
    unavailable: false,
    rowVersion: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      axios
        .get(`${apiUrl}/Books/details/${id}`)
        .then((response) => {
          const data = response.data;
          setBook({
            ...data,
            price: parseFloat(data.price.toString().replace(",", ".")),
            published: data.published.split("T")[0],
          });
        })
        .catch((error) => {
          setErrorMessage("Nie udało się pobrać danych książki.");
          console.error(error);
        });
    }
  }, [id, apiUrl]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    axios
      .put(
        `${apiUrl}/Books/${id}`,
        {
          ...book,
          price: book.price.toString().replace(",", "."),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setSuccessMessage("Zmiany zostały zapisane.");
        setTimeout(() => navigate(`/books/details/${id}`), 2000);
      })
      .catch((error) => {
        setErrorMessage("Nie udało się zapisać zmian.");
        console.error(error);
      });
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-4">
        <h2>Edytuj Książkę</h2>

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
            <label htmlFor="title">Tytuł</label>
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
            <label htmlFor="publisher">Wydawca</label>
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
            <label htmlFor="author">Autor</label>
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
            <label htmlFor="published">Data Publikacji</label>
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
            <label htmlFor="price">Cena</label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-control"
              value={book.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              id="unavailable"
              name="unavailable"
              className="form-check-input"
              checked={book.unavailable}
              onChange={handleChange}
            />
            <label htmlFor="unavailable" className="form-check-label">
              Niedostępna
            </label>
          </div>

          {/* Ukryte pole z RowVersion */}
          <input
            type="hidden"
            name="rowVersion"
            value={book.rowVersion}
          />

          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              Zapisz
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate(`/books/details/${id}`)}
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
