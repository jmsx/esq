import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements OnInit {

  respuestas: Respuesta[] = [];
  categorias: Categoria[] = [];
  categorice_enable = true;


 

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { 

  }

  editarCategoria(id: number) {
    let categoria = this.categorias.find(c => c.id == id);
    if (categoria) {
      let text = categoria.candidatas_texto || "";
      let candidatas = text.split(",").map((c: string) => c.trim());
      if (candidatas.length < 2) {
        this.toastr.error("You must enter at least two candidates separated by commas.", "Error");
      } else {
        categoria.candidatas = candidatas;
        this.toastr.success("Category successfully edited");
      }
    }
  }

  eliminarCategoria(id: number) {
    this.categorias = this.categorias.filter(c => c.id != id);
    for (let respuesta of this.respuestas) {
      respuesta.eliminarCategoria(id);
    }
  }
  
  agregarCategoria() {
    // Buscar el id más grande
    let id = this.categorias.map(c => c.id).reduce((a, b) => Math.max(a, b), 0);
    id++;
    this.categorias.push({
      id: id,
      candidatas: []
    });
  }

  agregarRespuesta() {
    let id = this.respuestas.map(r => r.id).reduce((a, b) => Math.max(a, b), 0);
    id++;
    let respuesta = new Respuesta(id, "", [...this.categorias], this.http)
    this.respuestas.push(respuesta)
  }


  categorizar() {

    // CHECKEAR QUE TODAS LAS CATEGORIAS TENGAN AL MENOS DOS CANDIDATAS
    for (let categoria of this.categorias) {
      if (categoria.candidatas.length < 2) {
        this.toastr.error("You must enter at least two candidates for each category.", "Error");
        return;
      }
    }

    // CHECKEAR QUE TODAS LAS RESPUESTAS TENGAN TEXTO
    for (let respuesta of this.respuestas) {
      if (respuesta.text == "") {
        this.toastr.error("You must enter text for each response.", "Error");
        return;
      }
    }

    for (let respuesta of this.respuestas) {
      this.categorice_enable = false
      respuesta.categorias_ = []
      for (let categoria of this.categorias) {
        let candidatas = categoria.candidatas;
        let c: Categoria = {
          id: categoria.id,
          candidatas: candidatas,
          candidatas_texto: candidatas.join(", "),
          respuesta_id: respuesta.id
        }
        respuesta.categorias_.push(c);
      }
      respuesta.categorizar();
    }

    // Wait for all 10 seconds
    setTimeout(() => {
      this.categorice_enable = true
    }, 10000);
    
    
  }

  getConfianza(number: number | undefined) {
    if (number == undefined) {
      return "0%";
    }
    return (number*100).toFixed(2) + "%";
  }

  getConfianzaClass(number: number | undefined) {
    if (number == undefined) {
      return "badge-danger";
    } else if (number < 0.5) {
      return "badge-warning";
    } else {
      return "badge-success";
    }
  }

  ngOnInit(): void {
  }

}

interface Categoria {
  id: number;
  respuesta_id?: number;
  candidatas_texto?: string;
  candidatas: string[];
  seleccionada?: string;
  confianza?: number;
}


class Respuesta {
  id: number;
  text: string;
  categorias_: Categoria[];

  constructor(
    id:number,
    text: string,
    categorias: Categoria[],
    private http: HttpClient
  ) {
    this.id = id;
    this.text = text;
    this.categorias_ = categorias || [];
  }

  eliminarCategoria(id: number) {
    this.categorias_ = this.categorias_.filter(c => c.id != id);
  }




  categorizar() {
    this.categorias_.forEach(categoria => {
        this.http.post('https://us-central1-easystatisticsquiz.cloudfunctions.net/categorize', {
          "text": this.text,
          "categories": categoria.candidatas,
        }).subscribe((data: any) => {
          let cat: Categoria = this.categorias_.find(c => c.id == categoria.id && c.respuesta_id == this.id) || {} as Categoria;
          cat.seleccionada = data.category;
          cat.confianza = data.confidence;
        });
    });

  
  }
}
