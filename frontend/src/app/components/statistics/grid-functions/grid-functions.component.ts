import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-grid-functions',
  templateUrl: './grid-functions.component.html',
  styleUrls: ['./grid-functions.component.scss']
})
export class GridFunctionsComponent implements OnInit {

  quizId: number;
  constructor(
    private route: ActivatedRoute
  ) {
    this.quizId = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
  }

}
