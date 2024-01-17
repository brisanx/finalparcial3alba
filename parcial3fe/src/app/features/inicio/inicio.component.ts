import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PruebaService } from '../../services/prueba.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { OauthComponent } from "../oauth/oauth.component";

@Component({
    selector: 'app-inicio',
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css',
    providers: [PruebaService],
    imports: [CommonModule, FormsModule, MapComponent, OauthComponent]
})
export class InicioComponent implements OnInit{
  constructor(private router: Router, private pruebaService: PruebaService){
  }
  gastos: any;
  name : any;
  ngOnInit(): void {
    this.name = localStorage.getItem("name");

      this.pruebaService.getAllPruebas().subscribe((data) => {
        this.gastos = data
      });
  }

  redirectBusqueda(busqueda: { busca : string }){
    const direccion = busqueda.busca;
    if(direccion == '')
    {
      this.router.navigate(['/']);
    }
    else {
      this.router.navigate(['/eventos/' + direccion]);
    }
  }

  onClickBorrar(gastoId: string) {
    this.pruebaService.deletePrueba(gastoId).subscribe((data) => {
      this.gastos = this.gastos.filter((gasto: any) => gasto._id !== gastoId);
    });
    }


}
