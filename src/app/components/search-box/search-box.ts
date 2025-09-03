import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../services/search-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search-box',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatInputModule, AsyncPipe],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss'
})
export class SearchBox {
  available!: Observable<boolean>;
  @Input() searchText: string = '';
  formController: FormControl<string> = new FormControl();
  readonly tags = ['UID', 'NAME'];

  constructor(private searchService: SearchService) {
    this.formController.valueChanges.subscribe(value => this.searchService.setSearch(value));
    this.available = this.searchService.available$;
  }
}
