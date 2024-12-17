import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        e.preventDefault();

        setErrors({});

        let formErrors: any = {};

        if (!formData.userName) formErrors.userName = "Username is required";
        if (!formData.firstName) formErrors.firstName = "First name is required";
        if (!formData.lastName) formErrors.lastName = "Last name is required";
        if (!formData.email) formErrors.email = "Email is required";
        if (!formData.phone) formErrors.phone = "Phone is required";
        if (!formData.password) formErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = "Passwords do not match";

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            await axios.post(`${apiUrl}/Auth/register`, formData);
            navigate('/login');
        } catch (error) {
            console.error("There was an error registering the user!", error);
            setErrors({ server: "There was an error registering the user." });
        }
    };

    return (
        <div className="account-container">
            <div className="account-box">
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    {/* Validation summary */}
                    {errors.server && <div className="text-danger">{errors.server}</div>}

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.userName && <span className="text-danger">{errors.userName}</span>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.lastName && <span className="text-danger">{errors.lastName}</span>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.phone && <span className="text-danger">{errors.phone}</span>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                    </div>

                    <input type="submit" value="Register" className="btn btn-success w-100 p-2" />
                    <p className="text-center mt-2">
                        Already registered? <a href="/login" className="text-decoration-none">Login</a>
                    </p>
                    <div className="text-center">
                        <a href="/" className="text-decoration-none mt-3">Back</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
