import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchBox } from "../search-box/search-box";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ToolbarActionService } from '../../services/toolbar-action-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, SearchBox, AsyncPipe],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class Toolbar {
  @Output() $menuClicked: EventEmitter<void> = new EventEmitter();
  @Output() $logoutClicked: EventEmitter<void> = new EventEmitter();
  @Output() $addClicked: EventEmitter<void> = new EventEmitter();
  $enableMenuButton: Observable<boolean>;

  constructor(private toolbarActionService: ToolbarActionService) {
    this.$enableMenuButton = this.toolbarActionService.$menuButtonEnabled;
  }
  
  onMenuClicked(): void {
    this.$menuClicked.emit();
  }
  
  onLogoutClicked() {
    this.$logoutClicked.emit();
  }

  onAddClicked() {
    this.$addClicked.emit();
  }
}
