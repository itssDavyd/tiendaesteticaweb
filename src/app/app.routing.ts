import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

//Componentes
import {LoginComponent} from './components/login/login.component';
import {CitasComponent} from "./components/citas/citas.component";
import {ActualidadComponent} from "./components/actualidad/actualidad.component";
import {ListadocitasComponent} from "./components/listadoCitas/listadocitas.component";

const appRouting: Routes = [
  {path: 'panel', component: LoginComponent},
  {path: 'citas', component: CitasComponent},
  {path: 'actualidad', component: ActualidadComponent},
  {path: 'listado/citas', component: ListadocitasComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRouting);
