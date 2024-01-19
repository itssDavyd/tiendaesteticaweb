import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CitasService} from "../../services/citas.service";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import {an} from "@fullcalendar/core/internal-common";

declare var $: any;

@Component({
  selector: 'listadocitas',
  templateUrl: './listadocitas.component.html',
  providers: [CitasService]
})

export class ListadocitasComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public citas: any;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _citasService: CitasService,
    private _toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'numbers',
      order: [[2, 'asc']],
      info: false,
      paging: true,
      processing: true,
      ordering: true,
      lengthChange: false,
      autoWidth: true,
      scrollY: 300,
      scrollCollapse: true,
      // scrollX: true,
      jQueryUI: true,
      language: {
        searchPlaceholder: 'Buscar',
        lengthMenu: "Muestra _MENU_ citas por página",
        zeroRecords: "No hay resultados",
        infoEmpty: "No resultados disponibles",
      }
      /*      serverSide: true,
            ajax: (dataTablesParameters: any, callback) => {
              this._citasService.index().subscribe(resp => {
                callback({
                  this.dtTrigger.next(null);
                  recordsTotal: resp.data.length,
                  recordsFiltered: resp.data.length,
                  data: resp.data
                });
              });
            },
            columns: [
              {
                title: 'ID',
                data: 'id'
              },
              {
                title: 'NOMBRE',
                data: 'nombre'
              },
              {
                title: 'APELLIDOS',
                data: 'apellidos'
              },
              {
                title: 'EMAIL',
                data: 'email'
              },
              {
                title: 'FECHA',
                data: 'fecha'
              },
              {
                title: 'HORA',
                data: 'hora'
              }
            ]*/
    };
    this._citasService.index().subscribe(resp => {
      let aux: Array<any> = [];

      this._citasService.getEstados().subscribe(estados => {
        resp.data.forEach((cita: any) => {
          //Buscamos el nombre del estado, en caso de no obtenerlo señalamos un -
          const estado = estados.data.find((estado: any) => estado.id === cita.id_estado) || {estado: '-'};
          const newDate = new Date(cita.fecha);
          let formatDate = ((newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()) + '/' + (((newDate.getMonth() + 1) < 10) ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)) + '/' + newDate.getFullYear(); //Format Date
          let telefono = (cita.telefono == "") ? "-" : cita.telefono;
          let resultData = {
            id: cita.id,
            nombre: cita.nombre,
            apellidos: cita.apellidos,
            email: cita.email,
            fecha: formatDate,
            hora: cita.hora,
            estado: estado.estado,
            telefono: telefono
          };
          aux.push(resultData);
        });

        this.citas = aux;
        this.dtTrigger.next(null);
      });
    });
  }
}
