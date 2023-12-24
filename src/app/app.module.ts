import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, appRoutingProviders} from "./app.routing";
import {FormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FullCalendarModule} from '@fullcalendar/angular';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DataTablesModule} from "angular-datatables";

//COMPONENTS
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {CitasComponent} from "./components/citas/citas.component";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {ActualidadComponent} from "./components/actualidad/actualidad.component";
import {ListadocitasComponent} from "./components/listadoCitas/listadocitas.component";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CitasComponent,
    ActualidadComponent,
    ListadocitasComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    routing,
    BrowserAnimationsModule,
    FullCalendarModule,
    NgxMaterialTimepickerModule,
    DataTablesModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2300,
      positionClass: 'toast-top-right',
      closeButton: true,
      tapToDismiss: true
    })
  ],
  providers: [
    appRoutingProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
