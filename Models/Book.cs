using System.ComponentModel.DataAnnotations;

namespace Library.Models
{
    public class Book
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Publisher { get; set; }

        public string Author { get; set; }

        public DateTime Published { get; set; }

        public decimal Price { get; set; }

        public bool Unavailable { get; set; } = false;

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

        [Timestamp]
        public byte[] RowVersion { get; set; }
    }

}
