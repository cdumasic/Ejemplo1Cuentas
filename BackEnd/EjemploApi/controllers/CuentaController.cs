using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EjemploApi.Data;
using EjemploApi.Models;

namespace EjemploApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CuentaController : ControllerBase
{
    private readonly AppDbContext _context;

    public CuentaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        var cuentas = await _context.Cuentas.ToListAsync();
        return Ok(cuentas);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAccount(Cuenta cuenta)
    {
        _context.Cuentas.Add(cuenta);
        await _context.SaveChangesAsync();
        return Ok(cuenta);
    }

    [HttpPatch("{id}/ingreso")]
    public async Task<IActionResult> AddIncome(int id, [FromBody] Monto request)
    {
        var cuenta = await _context.Cuentas.FindAsync(id);

        if (cuenta == null)
            return NotFound("Cuenta no encontrada");

        if (request.monto <= 0)
            return BadRequest("El monto debe ser mayor a cero");

        cuenta.Balance += request.monto;

        await _context.SaveChangesAsync();

        return Ok(cuenta);
    }
    [HttpPatch("{id}/salida")]
    public async Task<IActionResult> AddExpense(int id, [FromBody] Monto request)
    {
        var cuenta = await _context.Cuentas.FindAsync(id);

        if (cuenta == null)
            return NotFound("Cuenta no encontrada");

        if (request.monto <= 0)
            return BadRequest("El monto debe ser mayor a cero");

        if (cuenta.Balance < request.monto)
            return BadRequest("Fondos insuficientes");

        cuenta.Balance -= request.monto;

        await _context.SaveChangesAsync();

        return Ok(cuenta);
    }
    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer([FromBody] Transferencia request)
    {
        if (request.Monto <= 0)
            return BadRequest("El monto debe ser mayor a cero");

        if (request.CuentaOrigenID == request.CuentaDestinoID)
            return BadRequest("No puedes transferir a la misma cuenta");

        using var transaccion = await _context.Database.BeginTransactionAsync();

        try
        {
            var CuentaOrigen = await _context.Cuentas
                .FirstOrDefaultAsync(a => a.Id == request.CuentaOrigenID);

            var CuentaDestino = await _context.Cuentas
                .FirstOrDefaultAsync(a => a.Id == request.CuentaDestinoID);

            if (CuentaOrigen == null || CuentaDestino == null)
                return NotFound("Una de las cuentas no existe");

            if (CuentaOrigen.Balance < request.Monto)
                return BadRequest("Fondos insuficientes");

            CuentaOrigen.Balance -= request.Monto;
            CuentaDestino.Balance += request.Monto;

            await _context.SaveChangesAsync();
            await transaccion.CommitAsync();

            return Ok(new
            {
                Mensaje = "Transferencia exitosa",
                Cuenta_Origen = CuentaOrigen,
                Cuenta_Destino = CuentaDestino
            });
        }
        catch
        {
            await transaccion.RollbackAsync();
            return StatusCode(500, "Ocurrió un error en la transferencia");
        }
    }
}