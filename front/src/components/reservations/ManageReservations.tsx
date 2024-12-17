import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarComponent from '../Navbar';

interface ReservationViewModel {
  reservationId: number;
  username: string;
  bookTitle: string;
  expires: string;
}

const ManageReservations: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationViewModel[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/Reservations/manage`, { headers: getAuthHeaders() })
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch reservations:', error);
      });
  }, [apiUrl]);

  const handleRent = (reservationId: number) => {
    axios
      .post(
        `${apiUrl}/Reservations/${reservationId}/rent`,
        {},
        { headers: getAuthHeaders() }
      )
      .then(() => {
        setSuccessMessage('Reservation successfully rented.');
        setReservations(reservations.filter((r) => r.reservationId !== reservationId));
      })
      .catch((error) => {
        console.error('Failed to rent the book:', error);
      });
  };

  const handleDelete = (reservationId: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę rezerwację?')) {
      axios
        .delete(
          `${apiUrl}/Reservations/${reservationId}`,
          { headers: getAuthHeaders() }
        )
        .then(() => {
          setSuccessMessage('Reservation successfully deleted.');
          setReservations(reservations.filter((r) => r.reservationId !== reservationId));
        })
        .catch((error) => {
          console.error('Failed to delete reservation:', error);
        });
    }
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-4">
        <h2>Manage Reservations</h2>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Book Title</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.username}</td>
                <td>{reservation.bookTitle}</td>
                <td>{new Date(reservation.expires).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleRent(reservation.reservationId)}
                  >
                    Rent
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(reservation.reservationId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageReservations;
