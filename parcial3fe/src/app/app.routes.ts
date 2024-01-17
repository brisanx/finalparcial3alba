import { Routes } from '@angular/router';
import { ImagenesComponent } from './features/imagenes/imagenes.component';
import { InicioComponent } from './features/inicio/inicio.component';
import { OauthComponent } from './features/oauth/oauth.component';
import { MapComponent } from './features/map/map.component';
import { CrearGastoComponent } from './features/crear-gasto/crear-gasto.component';

export const routes: Routes = [
    {
        path : '',
        component: InicioComponent,
        title : 'Inicio'
    },
    {
        path: 'crearGasto',
        component: CrearGastoComponent,
        title: 'Crear Gasto'
    },
];
