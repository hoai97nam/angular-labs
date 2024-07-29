import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DotGameComponent } from './components/dot-game/dot-game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DotGameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'localization';
}
