import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentaServicio } from '../../Services/cuenta';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transferencia.html',
  styleUrl: './transferencia.css',
})
export class Transferencia {
  private fb = inject(FormBuilder);
  private accountService = inject(CuentaServicio);

  transferForm = this.fb.group({
    fromAccountId: [null as number | null, [Validators.required, Validators.min(1)]],
    toAccountId: [null as number | null, [Validators.required, Validators.min(1)]],
    amount: [0, [Validators.required, Validators.min(0.01)]]
  });
  

  submitTransfer() {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }
    const formValue = this.transferForm.getRawValue();

    this.accountService.transfer({
      cuentaOrigenID: formValue.fromAccountId!,
      cuentaDestinoID: formValue.toAccountId!,
      monto: formValue.amount!
    })
      .subscribe({
        next: () => {
          alert('Transferencia realizada');
          this.transferForm.reset({
            fromAccountId: null,
            toAccountId: null,
            amount: 0
          });
        },
        error: err => {
           alert(err?.error ?? 'Error al realizar transferencia');
        }
      });
  }
}
