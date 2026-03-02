using Microsoft.EntityFrameworkCore;
using EjemploApi.Models;

namespace EjemploApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Cuenta> Cuentas => Set<Cuenta>();
}