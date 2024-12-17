using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Library.ViewModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Globalization;
using Library.Data;
using Library.Models;

namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly UserManager<User> _userManager;

        public BooksController(AppDbContext dbContext, UserManager<User> userManager)
        {
            _appDbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _appDbContext.Books.ToListAsync();
            return Ok(books);
        }

        [HttpGet("available")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvailableBooks(string query = null)
        {
            var books = _appDbContext.Books.AsQueryable();

            if (!string.IsNullOrEmpty(query))
            {
                books = books.Where(b => b.Title.Contains(query));
            }

            var availableBooks = await books
                .Where(book => !book.Unavailable)
                .Where(book => book.Reservations.All(res => !res.Rented))
                .Where(book => book.Reservations.All(res => res.Expires < DateTime.Now || res.Returned))
                .ToListAsync();

            return Ok(availableBooks);
        }

        [HttpGet("details/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBookDetails(int id)
        {
            var book = await _appDbContext.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            return Ok(new BookViewModel
            {
                Id = book.Id,
                Title = book.Title,
                Publisher = book.Publisher,
                Author = book.Author,
                Published = book.Published,
                Price = book.Price.ToString("0.##").Replace('.', ','),
                RowVersion = Convert.ToBase64String(book.RowVersion)
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] BookViewModel bookViewModel)
        {
            if (!decimal.TryParse(bookViewModel.Price.Replace(',', '.'), NumberStyles.Any, CultureInfo.InvariantCulture, out var price))
            {
                return BadRequest(new { message = "Price must be a valid number." });
            }

            var book = new Book
            {
                Title = bookViewModel.Title,
                Publisher = bookViewModel.Publisher,
                Author = bookViewModel.Author,
                Published = bookViewModel.Published,
                Price = price,
                Unavailable = false
            };

            _appDbContext.Books.Add(book);
            await _appDbContext.SaveChangesAsync();

            return Ok(new { message = "Book successfully added." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditBook(int id, [FromBody] BookViewModel bookViewModel)
        {
            if (id != bookViewModel.Id)
            {
                return BadRequest(new { message = "Book ID mismatch." });
            }

            var book = await _appDbContext.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            if (!decimal.TryParse(bookViewModel.Price.Replace(',', '.'), NumberStyles.Any, CultureInfo.InvariantCulture, out var price))
            {
                return BadRequest(new { message = "Price must be a valid number." });
            }

            book.Title = bookViewModel.Title;
            book.Publisher = bookViewModel.Publisher;
            book.Author = bookViewModel.Author;
            book.Published = bookViewModel.Published;
            book.Price = price;

            try
            {
                _appDbContext.Books.Update(book);
                await _appDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { message = "The book has been modified or deleted by another user." });
            }

            return Ok(new { message = "Book successfully updated." });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _appDbContext.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            var reservations = await _appDbContext.Reservations
                .Where(r => r.Book.Id == id && !r.Returned)
                .ToListAsync();

            if (reservations.Any()) 
            {
                return BadRequest(new { message = "Book rented." });
            }

            var pastReservations = await _appDbContext.Reservations
                .Where(r => r.Book.Id == id && r.Returned)
                .ToListAsync();

            if (pastReservations.Any())
            {
                book.Unavailable = true;
                _appDbContext.Books.Update(book);
                await _appDbContext.SaveChangesAsync();
                return Ok(new { message = "Book marked as unavailable due to active reservations." });
            }

            _appDbContext.Books.Remove(book);
            await _appDbContext.SaveChangesAsync();
            return Ok(new { message = "Book successfully deleted." });
        }

        [HttpPost("{id}/reserve")]
        public async Task<IActionResult> ReserveBook(int id)
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "You must be logged in to reserve a book." });
            }

            var book = await _appDbContext.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            var activeReservations = await _appDbContext.Reservations
                .Where(r => r.Book.Id == id && r.Expires > DateTime.Now)
                .ToListAsync();

            if (activeReservations.Any())
            {
                return BadRequest(new { message = "The book is already reserved." });
            }

            var user = await _appDbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var reservation = new Reservation
            {
                User = user,
                Book = book,
                Expires = DateTime.Now.AddDays(2),
            };

            _appDbContext.Reservations.Add(reservation);
            await _appDbContext.SaveChangesAsync();

            return Ok(new { message = "Book successfully reserved." });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("manage")]
        public async Task<IActionResult> ManageBooks()
        {
            var books = await _appDbContext.Books.ToListAsync();
            return Ok(books);
        }
    }
}
