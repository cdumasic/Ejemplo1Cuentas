import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentaServicio } from '../../Services/cuenta';
import { Cuenta } from '../../Models/cuenta';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lista-cuenta.html',
  styleUrls: ['./lista-cuenta.css']
})
export class AccountListComponent implements OnInit {

  accounts: Cuenta[] = [];
  accountForm!: FormGroup;
  selectedId: number | null = null;

  constructor(
    private accountService: CuentaServicio,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.accountForm = this.fb.group({
      id: [0],
      accountName: [''],
      accountNumber: [''],
      balance: [0]
    });

    this.loadAccounts();
  }

  trackById(index: number, account: any): number {
    return account.id;
  } 

  loadAccounts() {
    console.log("🔄 Cargando cuentas...");

    this.accountService.getAccounts().subscribe({
      next: data => {
        console.log("✅ Datos recibidos:", data);
        this.accounts = [...data];
      },
      error: err => {
        console.error("❌ Error:", err);
      }
    });
  }

  deleteAccount(id: number) {
    if (!confirm("¿Estás seguro de eliminar esta cuenta?")) {
      return;
    }

    this.accountService.deleteAccount(id).subscribe({
      next: () => {
        // 🔥 Eliminamos del array local inmediatamente
        this.accounts = this.accounts.filter(a => a.id !== id);
      },
      error: err => {
        console.error("Error al eliminar:", err);
      }
    });
  }

  depositToAccount(account: Cuenta) {
    const value = prompt(`Monto a depositar en ${account.accountName}:`);
    if (value === null) return;

    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Ingresa un monto valido mayor a 0.');
      return;
    }

    this.accountService.deposit(account.id, amount).subscribe({
      next: updated => {
        this.accounts = this.accounts.map(a => a.id === account.id ? updated : a);
      },
      error: err => {
        alert(err?.error ?? 'No se pudo realizar el deposito');
      }
    });
  }

  withdrawFromAccount(account: Cuenta) {
    const value = prompt(`Monto a retirar de ${account.accountName}:`);
    if (value === null) return;

    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Ingresa un monto valido mayor a 0.');
      return;
    }

    this.accountService.withdraw(account.id, amount).subscribe({
      next: updated => {
        this.accounts = this.accounts.map(a => a.id === account.id ? updated : a);
      },
      error: err => {
        alert(err?.error ?? 'No se pudo realizar el retiro');
      }
    });
  }

  editAccount(account: any) {
    this.selectedId = account.id;

    this.accountForm.patchValue({
      id: account.id,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      balance: account.balance
    });
  }

  saveAccount() {

    if (this.selectedId) {
      // 🔵 UPDATE
      this.accountService.updateAccount(this.selectedId, this.accountForm.value)
        .subscribe({
          next: () => {

            const index = this.accounts.findIndex(a => a.id === this.selectedId);
            if (index !== -1) {
              this.accounts[index] = { ...this.accountForm.value };
              this.accounts = [...this.accounts];
            }

            this.resetForm();
          },
          error: err => console.error(err)
        });

    } else {
      // 🟢 CREATE
      this.accountService.createAccount(this.accountForm.value)
        .subscribe({
          next: (newAccount: any) => {

            // agregar al array sin recargar todo
            this.accounts = [...this.accounts, newAccount];

            this.resetForm();
          },
          error: err => console.error(err)
        });
    }
  }

  resetForm() {
    this.accountForm.reset({
      id: 0,
      accountName: '',
      accountNumber: '',
      balance: 0
    });

    this.selectedId = null;
  }
}
