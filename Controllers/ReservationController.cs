using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Library.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;
using System.Threading.Tasks;
using Library.Data;
using Library.Models;

[Route("api/[controller]")]
[ApiController]
public class ReservationsController : ControllerBase
{
    private readonly AppDbContext appDbContext;
    private readonly UserManager<User> _userManager;

    public ReservationsController(AppDbContext dBContext, UserManager<User> userManager)
    {
        appDbContext = dBContext;
        _userManager = userManager;
    }

    // GET api/reservations
    [HttpGet]
    public async Task<IActionResult> GetReservations()
    {
        var userId = _userManager.GetUserId(User);
        var reservations = await appDbContext.Reservations
            .Where(r => r.User.Id == userId && !r.Rented && !r.Returned)
            .Select(r => new ReservationViewModel
            {
                BookTitle = r.Book.Title,
                Expires = r.Expires,
                ReservationId = r.Id
            }).ToListAsync();

        return Ok(reservations);
    }

    // DELETE api/reservations/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation(int id)
    {
        var reservation = await appDbContext.Reservations.FindAsync(id);

        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        appDbContext.Reservations.Remove(reservation);
        await appDbContext.SaveChangesAsync();

        return Ok(new { message = "Reservation deleted successfully" });
    }

    // GET api/reservations/manage
    [HttpGet("manage")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ManageReservations()
    {
        var reservations = await appDbContext.Reservations
            .Include(r => r.Book)
            .Include(r => r.User)
            .Where(r => !r.Rented && r.Expires > DateTime.Now && !r.Returned)
            .Select(r => new ReservationViewModel
            {
                ReservationId = r.Id,
                BookTitle = r.Book.Title,
                Expires = r.Expires,
                Username = r.User.UserName
            })
            .ToListAsync();

        return Ok(reservations);
    }

    // GET api/reservations/manage-rented
    [HttpGet("manage-rented")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ManageRented()
    {
        var reservations = await appDbContext.Reservations
            .Include(r => r.Book)
            .Include(r => r.User)
            .Where(r => r.Rented)
            .Select(r => new ReservationViewModel
            {
                ReservationId = r.Id,
                BookTitle = r.Book.Title,
                Expires = r.Expires,
                Username = r.User.UserName
            })
            .ToListAsync();

        return Ok(reservations);
    }

    // POST api/reservations/{reservationId}/rent
    [HttpPost("{reservationId}/rent")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RentReservation(int reservationId)
    {
        var reservation = await appDbContext.Reservations
            .Include(r => r.Book)
            .FirstOrDefaultAsync(r => r.Id == reservationId);

        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        reservation.Rented = true;
        await appDbContext.SaveChangesAsync();

        return Ok(new { message = "Book rented successfully" });
    }

    // POST api/reservations/return
    [HttpPost("{reservationId}/return")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReturnReservation(int reservationId)
    {
        var reservation = await appDbContext.Reservations
            .Include(r => r.Book)
            .FirstOrDefaultAsync(r => r.Id == reservationId);

        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        reservation.Rented = false;
        reservation.Returned = true;

        appDbContext.Update(reservation);
        await appDbContext.SaveChangesAsync();

        return Ok(new { message = "Book returned successfully" });
    }
}
