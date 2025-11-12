import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchBox } from "../search-box/search-box";
import { BehaviorSubject } from 'rxjs';
import { ToolbarActionService } from '../../services/toolbar-action-service';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, SearchBox],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class Toolbar {

  $enableMenuButton: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private toolbarActionService: ToolbarActionService) {
  }
  onAddClicked() {
    this.toolbarActionService.triggerAddAction();
  }

  onMenuClicked(): void {
    this.toolbarActionService.triggerMenuAction();
  }

  onLogoutClicked() {
    this.toolbarActionService.triggerLogoutAction();
  }
}
