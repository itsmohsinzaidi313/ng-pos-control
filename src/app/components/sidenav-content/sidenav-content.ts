import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav-content',
  imports: [MatListModule],
  templateUrl: './sidenav-content.html',
  styleUrl: './sidenav-content.scss'
})

export class SidenavContent {
  @Input() drawer!: MatDrawer;
  @Output() menuClicked$: EventEmitter<MatDrawer> = new EventEmitter<MatDrawer>();

  onMenuClicked(): void {
    this.menuClicked$.emit(this.drawer);
  }
}
