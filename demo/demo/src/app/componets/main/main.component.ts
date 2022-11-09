import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements OnInit {

  respuestas: Respuesta[] = [];
  categorias: Categoria[] = [];

 

  constructor(
    private http: HttpClient
  ) { 

  }

  editarCategoria(id: number) {
    let categoria = this.categorias.find(c => c.id == id);
    if (categoria) {
      let text = categoria.candidatas_texto || "";
      let candidatas = text.split(",").map((c: string) => c.trim());
      categoria.candidatas = candidatas;
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
    for (let respuesta of this.respuestas) {
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
