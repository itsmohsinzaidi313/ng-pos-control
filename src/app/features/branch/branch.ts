import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-branch',
  imports: [],
  templateUrl: './branch.html',
  styleUrl: './branch.scss'
})
export class Branch implements OnInit {
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    
  }
}
