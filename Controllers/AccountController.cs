namespace Library.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.EntityFrameworkCore;
    using System.Security.Claims;
    using Library.Data;
    using Library.Models;
    using Library.ViewModels;

    namespace library_zad1.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class AccountController : ControllerBase
        {
            private readonly SignInManager<User> signInManager;
            private readonly UserManager<User> userManager;
            private readonly AppDbContext _appDbContext;

            public AccountController(SignInManager<User> signInManager, UserManager<User> userManager, AppDbContext dBContext)
            {
                this.signInManager = signInManager;
                this.userManager = userManager;
                _appDbContext = dBContext;
            }

            [HttpPost("login")]
            public async Task<IActionResult> Login(LoginViewModel model)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

                if (result.Succeeded)
                {
                    return Ok(new { message = "Login successful" });
                }
                else
                {
                    return Unauthorized(new { message = "Email or password incorrect" });
                }
            }

            [HttpGet("profile")]
            [Authorize]
            public async Task<IActionResult> Profile()
            {
                var user = await userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var model = new ProfileViewModel
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    Phone = user.PhoneNumber
                };

                return Ok(model);
            }

            [HttpPost("profile")]
            [Authorize]
            public async Task<IActionResult> Profile(ProfileViewModel model)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.UserName = model.UserName;
                user.Email = model.Email;
                user.PhoneNumber = model.Phone;

                var result = await userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Update failed", errors = result.Errors.Select(e => e.Description) });
                }

                return Ok(new { message = "Profile updated successfully" });
            }

            [HttpPost("logout")]
            [Authorize]
            public async Task<IActionResult> Logout()
            {
                await signInManager.SignOutAsync();
                return Ok(new { message = "Logged out successfully" });
            }

            [HttpDelete("delete")]
            [Authorize]
            public async Task<IActionResult> Delete()
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = _appDbContext.Users
                    .Include(u => u.Reservations)
                    .FirstOrDefault(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var rentedBooks = user.Reservations.Where(r => r.Rented).ToList();

                if (rentedBooks.Any())
                {
                    return BadRequest(new { message = "Cannot delete user, they have rented books" });
                }

                _appDbContext.Users.Remove(user);
                await _appDbContext.SaveChangesAsync();
                await signInManager.SignOutAsync();

                return Ok(new { message = "User deleted successfully" });
            }
        }
    }

}
