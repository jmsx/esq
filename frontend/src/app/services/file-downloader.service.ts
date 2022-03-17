import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileDownloaderService {

  constructor(
    private http: HttpClient
  ) { }

  downloadExelDataReportsRequest(idQuiz): any{		
		return this.http.get(environment.URL_BASE + 'export/?quiz=' + idQuiz, {responseType: 'blob'});
  }

  downloadExelDataReports(idQuiz) {
		this.downloadExelDataReportsRequest(idQuiz).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'application/vnd.ms-excel; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			//window.open(url);
			saveAs(blob, 'data-quiz-' + idQuiz + '.xlsx');
			}), (error: any) => console.log('Error downloading the file'),
			() => console.info('File downloaded successfully');
	}
}
