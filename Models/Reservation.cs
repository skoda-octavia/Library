namespace Library.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        public DateTime Expires { get; set; }

        public Book Book { get; set; }

        public User User { get; set; }

        public bool Rented { get; set; } = false;

        public bool Returned { get; set; } = false;
    }

}
