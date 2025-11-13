import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import { SidenavTile } from '../sidenav-tile/sidenav-tile';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-content',
  imports: [MatListModule, SidenavTile, CommonModule],
  templateUrl: './sidenav-content.html',
  styleUrl: './sidenav-content.scss'
})

export class SidenavContent {
  @Input() drawer!: MatDrawer;
  @Output() menuClicked$: EventEmitter<MatDrawer> = new EventEmitter<MatDrawer>();
  navigationItems = [
    { title: 'Restaurants', subtitle: 'Manage your restaurants and their details' },
    { title: 'Notifications', subtitle: 'Manage notifications and alerts' },
    { title: 'Websites', subtitle: 'Manage restaurant websites' },
  ];

  constructor(private router: Router) { }

  onNavItemClicked(index: number): void {
    this.menuClicked$.emit(this.drawer);
    switch (index) {
      case 0:
        this.router.navigate(['/restaurants']);
        break;
      case 1:
        this.router.navigate(['/notifications']);
        break;
      case 2:
        this.router.navigate(['/websites']);
        break;
      default:
        console.log('Unknown item clicked');
    }
  }


  onMenuClicked(): void {
    this.menuClicked$.emit(this.drawer);
  }
}
