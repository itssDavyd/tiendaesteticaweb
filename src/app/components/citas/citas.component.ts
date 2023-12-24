import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {CitasService} from "../../services/citas.service";
import {NgForm} from "@angular/forms";
import {Cita} from "../../models/cita";
import {ToastrService} from "ngx-toastr";

declare var $: any;

@Component({
  selector: 'citas',
  templateUrl: './citas.component.html',
  providers: [CitasService, UserService]
})

export class CitasComponent implements OnInit {
  public title: string;
  public cita: Cita;
  public horasDisabled: string[] = ['14', '15', '16'];
  public horasSabadoDisabled: string[] = ['15', '16', '17', '18', '19', '20'];
  public oktTheme: any = {
    container: {
      bodyBackgroundColor: "#424242",
      buttonColor: "#ffacb9"
    },
    dial: {
      dialBackgroundColor: "#555"
    },
    clockFace: {
      clockFaceBackgroundColor: "#555",
      clockHandColor: "#ffacb9",
      clockFaceTimeInactiveColor: "#fff"
    }
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _citasService: CitasService,
    private _toastr: ToastrService
  ) {
    this.title = 'Citas';
    this.cita = new Cita("", "", "", "", "", 10);
  }

  ngOnInit(): void {
  }

  onSubmit(citasForm: NgForm) {
    let fechaCreated = new Date(this.cita.fecha);
    let diaSemanaSelected = fechaCreated.getDay(); //Obtenemos del string de fecha, una nueva fecha creada a base de esta string para cogerle el día.
    let horaSplit = this.cita.hora.split(':');
    let flag = false; //Control para enviar el formulario o no.

    if (diaSemanaSelected === 6) {
      //Comprobamos si estamos en sabado seleccionado, en este caso se choca contra el array de horasSabadoDisabled.
      if (this.horasSabadoDisabled.includes(horaSplit[0])) {
        this._toastr.warning('El establecimiento los sábados permanece abierto de 10:00 a 14:00', 'Citas');
      } else {
        flag = true;
      }
    } else if (diaSemanaSelected === 0) {
      //Si es domingo el chiringo ta cerrado.
      this._toastr.warning('El establecimiento se encuentra cerrado los Domingos.', 'Citas');
    } else {
      if (this.horasDisabled.includes(horaSplit[0])) {
        //Control para evitar que pidan citas en horas las cuales esta comiendo.
        this._toastr.warning('El establecimiento permanece cerrado de 14:30 a 16:30, por favor seleccione otra hora.', 'Citas');
      } else {
        flag = true;
      }
    }

    if (flag) {
      //Si tenemos el OKI de todo enviamos la petición
      this._citasService.store(this.cita).subscribe(
        response => {
          this._router.navigate(['citas']).then(() => {
            this._toastr.success('Se ha generado correctamente la petición de la cita.', 'Citas');
            citasForm.reset();
            this._router.navigate(['citas'])
          })
        }, error => {
          this._router.navigate(['citas']).then(() => {
            this._toastr.error(error.error.error, 'Citas');
            citasForm.reset();
            this._router.navigate(['citas'])
          })
        }
      )
    }
  }
}
