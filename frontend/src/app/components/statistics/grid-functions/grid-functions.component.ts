import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileDownloaderService } from 'src/app/services/file-downloader.service';

@Component({
  selector: 'app-grid-functions',
  templateUrl: './grid-functions.component.html',
  styleUrls: ['./grid-functions.component.scss']
})
export class GridFunctionsComponent implements OnInit {

  quizId: number;
  constructor(
    private route: ActivatedRoute,
    private fileDownloaderService: FileDownloaderService
  ) {
    this.quizId = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
  }

  downloadData(){
    this.fileDownloaderService.downloadExelDataReports(this.quizId);
  }

}
