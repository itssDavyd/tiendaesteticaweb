import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "./services/user.service";
import {CitasService} from "./services/citas.service";
import {CalendarOptions} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import {format, parse} from 'date-fns';
import {BsModalService, BsModalRef} from "ngx-bootstrap/modal";
import {Cita} from "./models/cita";
import {NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, CitasService]
})
export class AppComponent implements OnInit {
  modalRef?: BsModalRef;
  arrEditEvent: any;
  estadosCita: any;
  public cita: Cita;
  title = 'web';
  public identity: any;
  public token: any;
  public events: any;
  public portletExpanded = false; //Funcion para controlar que el portlet se abra, por defecto esta cerrado siempre.
  activeLink: string = 'citas';
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    aspectRatio: 3.8,
    locale: 'es',
    selectable: true,
    editable: true,
    themeSystem: 'bootstrap5',
    plugins: [dayGridPlugin],
    eventClick: this.handleDateClick.bind(this)
    // eventContent: this.customEventContent.bind(this)
  };
  config = {
    animated: true
  };
  @ViewChild('template') template!: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _citasService: CitasService,
    private _modalService: BsModalService,
    private _toastr: ToastrService
  ) {
    this.identity = this._userService.getIdentity();
    this.cita = new Cita("", "", "", "", "", 0);
    // this.token = this._userService.getToken();
  }

  // Función para cambiar el enlace activo
  setActiveLink(link: string) {
    this.activeLink = link;
  }

  handleDateClick(arg: any) {
    //Evento de click sobre calendario para levantar modal de modificaciones en eventos.
    let eventData: Array<any> = [];
    let $fecha = arg.event.start; //Fecha Formateada
    let $hora = $fecha.toLocaleTimeString(); //Hora formateada
    let arrEditEventEstructurado = {
      id: parseInt(arg.event._def.publicId),
      title: arg.event._def.title,
      gmail: arg.event._def.extendedProps.description,
      estado: arg.event._def.extendedProps.estado,
      fecha: $fecha.toLocaleDateString(),
      hora: $hora
    };
    eventData.push(arrEditEventEstructurado);
    this.arrEditEvent = eventData[0];

    this._citasService.getEstados().subscribe(
      response => {
        this.estadosCita = response.data;
      }, error => {
        console.log(error)
      }
    );
    this.modalRef = this._modalService.show(this.template, this.config);

  }

  ngOnInit(): void {

    //Pre-carga de las citas en el calendario.
    this._citasService.index().subscribe(
      response => {
        if (response.success) {
          // console.log(response)
          let calendarioData = response.data;
          let eventCalendarData: Array<any> = [];
          calendarioData.forEach((element: any) => {
            let nombreCompleto = element.nombre + " " + element.apellidos;
            let fechaHoraString = `${element.fecha} ${element.hora}`;
            let fechaHora = parse(fechaHoraString, 'yyyy-MM-dd HH:mm:ss', new Date());
            //Obtención de los colores por estados de cita.
            let colorSelected = "";
            if (element.id_estado == 10) {
              colorSelected = '#F6FF99';
            } else if (element.id_estado == 20) {
              colorSelected = '#2FFF00';
            } else if (element.id_estado == 30) {
              colorSelected = '#FF6C00';
            } else if (element.id_estado == 40) {
              colorSelected = '#FF0000';
            }
            let nuevoEventCalendarioData = {
              id: element.id,
              title: nombreCompleto,
              start: fechaHora,
              description: element.email,
              extendedProps: {
                estado: element.id_estado
              },
              color: colorSelected
            }
            eventCalendarData.push(nuevoEventCalendarioData);
          });
          this.events = eventCalendarData;
          this.calendarOptions.events = this.events;
        }
      }, error => {
        console.log(error);
      }
    );
  }

  togglePortlet() {
    this.portletExpanded = !this.portletExpanded;
  }

  onSubmit(CalendarForm: NgForm) {
    //Llamada al método de update en la API, cogemos la cita y actualizamos la fecha, posteriori a esto vamos a tener que hacer referencia al servicio de sendMail para enviar el mail correspondiente al cliente para actualizar su Cita.
    let $id = parseInt($('input[name="id"]').val());
    let $estado = parseInt(CalendarForm.form.value.estado);
    this._citasService.update($estado, $id).subscribe(
      response => {
        if (response.success) {
          this._router.navigate(['']).then(() => {
            this._toastr.success('Se ha actualizado correctamente el estado de la Cita.', 'Calendario');
            CalendarForm.reset();
            setTimeout(() => {
              location.reload()
            }, 2600);
          });
        }
      }, error => {
        this._router.navigate(['']).then(() => {
          this._toastr.error('Se ha producido un error al cambiar el estado de la Cita.', 'Calendario');
          CalendarForm.reset();
          setTimeout(() => {
            location.reload()
          }, 2600);
        });
      }
    )
  }

  // Función para construir el contenido del evento
  customEventContent(info: any): any {
    // Formatear la fecha usando date-fns
    const formattedStartDate = format(info.event.start, 'dd/MM/yyyy HH:mm:ss');
    return {
      html: `<b>Nombre: ${info.event.title}</b><br>
             <p>Fecha: ${formattedStartDate}</p><br>
             <p>Descripción: ${info.event.extendedProps.description}</p>`
    };
  }
}

