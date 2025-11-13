import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidenav-tile',
  imports: [MatListModule],
  templateUrl: './sidenav-tile.html',
  styleUrl: './sidenav-tile.scss',
})
export class SidenavTile {
@Input() title: string = '';
@Input() subtitle: string = '';
@Output() menuClicked$: EventEmitter<undefined> = new EventEmitter<undefined>();

  onMenuClicked(): void {
    this.menuClicked$.emit();
  }
}
