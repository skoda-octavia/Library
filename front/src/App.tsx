import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/account/Login';
import ProfilePage from './components/account/Profile';
import BookDetails from './components/book/BookDetails';
import EditBook from './components/book/EditBook';
import ManageBooks from './components/book/ManageBooks';
import AddBook from './components/book/AddBook';
import ManageReservations from './components/reservations/ManageReservations';
import ManageRented from './components/reservations/ManageRented';
import Register from './components/account/Register';
import MyReservations from './components/reservations/MyReservations';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/books/details/:id" element={<BookDetails />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/books/manage" element={<ManageBooks />} />
        <Route path="/books/add" element={<AddBook />} />
        <Route path="/reservations/manage" element={<ManageReservations />} />
        <Route path="/rented/manage" element={<ManageRented />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservations" element={<MyReservations />} />
      </Routes>
    </Router>
  );
};

export default App;
