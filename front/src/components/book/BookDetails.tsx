import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "../Navbar";

interface BookDetailsProps {
  id: number;
  title: string;
  publisher: string;
  author: string;
  published: string;
  price: string;
}

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookDetailsProps | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isAdmin = localStorage.getItem("role") === "Admin";

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/Books/details/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setErrorMessage("Nie udało się załadować szczegółów książki.");
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleReserve = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/Books/${id}/reserve`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
      setMessage("Książka została zarezerwowana!");
    } catch (error) {
      console.error("Error reserving book:", error);
      setErrorMessage("Nie udało się zarezerwować książki.");
    }
  };

  const handleEdit = () => {
    navigate(`/books/edit/${id}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  if (!book) {
    return <div>Ładowanie szczegółów książki...</div>;
  }

  return (
    <div>
    <NavbarComponent/>
      <h2>Szczegóły Książki</h2>

      <div>
        <h4>{book.title}</h4>
        <hr />
        <dl className="row">
          <dt className="col-sm-2">Wydawca</dt>
          <dd className="col-sm-10">{book.publisher}</dd>

          <dt className="col-sm-2">Autor</dt>
          <dd className="col-sm-10">{book.author}</dd>

          <dt className="col-sm-2">Data Publikacji</dt>
          <dd className="col-sm-10">{new Date(book.published).toLocaleDateString()}</dd>

          <dt className="col-sm-2">Cena</dt>
          <dd className="col-sm-10">{book.price} zł</dd>
        </dl>
      </div>

      <div className="d-flex justify-content-start align-items-center">
        {isAdmin && (
          <button className="btn btn-primary me-2" onClick={handleEdit}>
            Edytuj
          </button>
        )}
        {!isAdmin && (
        <button className="btn btn-success me-2" onClick={handleReserve}>
          Rezerwuj
        </button>
        )}

        {message && (
          <div className="alert alert-success mt-3 w-100">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger mt-3 w-100">
            {errorMessage}
          </div>
        )}

        <button className="btn btn-secondary ms-2" onClick={handleBack}>
          Powrót
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
