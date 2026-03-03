import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountListComponent } from "./Pages/lista-cuenta/lista-cuenta";
import { Transferencia } from './Pages/transferencia/transferencia';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AccountListComponent, Transferencia],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Ejemplo-app');
}
