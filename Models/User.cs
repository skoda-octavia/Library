using Microsoft.AspNetCore.Identity;

namespace Library.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }

}
