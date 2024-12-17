import { useEffect, useState } from "react";
import axios from "axios";
import NavbarComponent from "../Navbar";

interface Reservation {
  reservationId: number;
  bookTitle: string;
  rented: boolean;
  username: string;
}

const ManageRented = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/Reservations/manage-rented`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the reservations!", error);
        setError("Failed to load reservations. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiUrl]);

  const handleReturn = (reservationId: number) => {
    setLoading(true);
    axios
      .post(
        `${apiUrl}/Reservations/${reservationId}/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setMessage("Book returned successfully!");
        setReservations((prevReservations) =>
          prevReservations.filter(
            (reservation) => reservation.reservationId !== reservationId
          )
        );
      })
      .catch((error) => {
        console.error("There was an error returning the book!", error);
        setMessage("Failed to return the book.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-4">
        <h2>Manage Rented Books</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Book Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={5}>No rented books found.</td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                    <tr key={reservation.reservationId}>
                      <td>{reservation.reservationId}</td>
                      <td>{reservation.username || "Unknown User"}</td>
                      <td>{reservation.bookTitle}</td>
                      <td>
                        <button
                          onClick={() => handleReturn(reservation.reservationId)}
                          className="btn btn-warning"
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageRented;
