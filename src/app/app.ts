import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { SidenavContent } from "./components/sidenav-content/sidenav-content";
import { Toolbar } from "./components/toolbar/toolbar";
import { SearchService } from './services/search-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    SidenavContent,
    Toolbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-pos-control');

  constructor(private router: Router) {}

  onLogoutClicked() {
    this.router.navigateByUrl('login')
  }
}
