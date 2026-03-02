namespace EjemploApi.Models;

public class Transferencia
{
    public int CuentaOrigenID { get; set; }
    public int CuentaDestinoID { get; set; }
    public decimal Monto { get; set; }
}