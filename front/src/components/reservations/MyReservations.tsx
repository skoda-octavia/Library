import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarComponent from "../Navbar";

interface Reservation {
  reservationId: number;
  bookTitle: string;
  expires: string;
}

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      const response = await axios.get<Reservation[]>(
        `${import.meta.env.VITE_API_URL}/reservations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReservations(response.data);
    } catch (err) {
      console.error("Błąd pobierania rezerwacji:", err);
      setError("Nie udało się załadować rezerwacji.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę rezerwację?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/reservations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReservations((prev) =>
        prev.filter((reservation) => reservation.reservationId !== id)
      );
    } catch (err) {
      console.error("Błąd podczas usuwania rezerwacji:", err);
      setError("Nie udało się usunąć rezerwacji.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div>
        <NavbarComponent></NavbarComponent>
    <div className="container mt-4">
      <h2>Moje Rezerwacje</h2>
      {loading && <p>Ładowanie...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && reservations.length === 0 && (
        <p>Nie masz żadnych rezerwacji.</p>
      )}

      {!loading && reservations.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Tytuł Książki</th>
              <th>Data Wygaśnięcia</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>{reservation.bookTitle}</td>
                <td>{new Date(reservation.expires).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteReservation(reservation.reservationId)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <a href="/" className="btn btn-secondary mt-3">
        Powrót
      </a>
    </div>
    </div>
  );
};

export default MyReservations;
