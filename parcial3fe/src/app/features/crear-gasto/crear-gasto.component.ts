import { Component } from '@angular/core';
import { ImagenService } from '../../services/imagen.service';
import { PruebaService } from '../../services/prueba.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Gasto } from '../../interfaces/gasto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-gasto',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './crear-gasto.component.html',
  styleUrl: './crear-gasto.component.css',
  providers: [ImagenService, PruebaService],
})
export class CrearGastoComponent {
  selectedFiles: File[] = [];
  urls: any[] = [];
  fotos_subidas: boolean = false;
  gasto: Gasto = {
    timestamp: new Date(),
    concepto: '',
    importe: 0,
    email: '',
    lugar: '',
    lat: 0,
    lon: 0,
    token: '',
    imagen: '',
  };

  evento_subido : boolean = false;

  constructor(
    private http: HttpClient,
    private imagenService: ImagenService,
    private router: Router,
    private pruebaService: PruebaService
  ) {}
  ngOnInit(): void {
    this.fotos_subidas = false;
    this.evento_subido = false;
  }

  // Cloudinary
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onButtonClicked(): void {
    if (this.selectedFiles.length > 0) {
      this.imagenService
        .uploadImage(this.selectedFiles)
        .subscribe((response) => {
          if (response) {
            this.urls = response.urls;
            this.gasto.imagen = this.urls[0];
            console.log(this.gasto.imagen);
            this.fotos_subidas = true;
          }
        });
    }
  }

  onSubmit() {
    let email : any;
    email = localStorage.getItem('email');
    this.gasto.email = email;
    if (email==null) {
      this.gasto.email = "albasanchezibanez6@uma.es"
    }
    if (this.gasto.token=="") {
      this.gasto.token = "asdflasdfladsf";
    }
    this.pruebaService.createPrueba(this.gasto).subscribe(response => {
      console.log(response);
      this.evento_subido = true;
    });
    }
}
