import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatDrawer } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class Toolbar {
  @Output() menuClicked$: EventEmitter<void> = new EventEmitter();
  onMenuClicked(): void {
    this.menuClicked$.emit();
  }
}
