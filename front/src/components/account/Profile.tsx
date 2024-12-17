import React, { useEffect, useState } from "react";
import axios from "axios";

interface Profile {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Profile>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get<Profile>(
        `${import.meta.env.VITE_API_URL}/account/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error("Błąd pobierania profilu:", err);
      setError("Nie udało się pobrać danych użytkownika.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/account/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Profil został pomyślnie zaktualizowany.");
    } catch (err) {
      console.error("Błąd aktualizacji profilu:", err);
      setError("Nie udało się zaktualizować danych.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Edit Profile</h2>
      {loading && <p>Ładowanie...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {!loading && profile && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-success w-100 p-2">
            Save Changes
          </button>
        </form>
      )}

      <div className="text-center">
        <a href="/" className="text-decoration-none mt-3">
          Back
        </a>
      </div>
    </div>
  );
};

export default ProfilePage;
