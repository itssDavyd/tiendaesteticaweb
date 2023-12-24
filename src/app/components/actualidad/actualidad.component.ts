import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {actualidadService} from "../../services/actualidad.service";

@Component({
  selector: 'actualidad',
  templateUrl: './actualidad.component.html',
  providers: [actualidadService]
})

export class ActualidadComponent implements OnInit {
  public multimedia: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _actualidadService: actualidadService,
    private _toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this._actualidadService.getMultimediaContent().subscribe(
      response => {
        this.multimedia = response.data;
        console.log(this.multimedia)
        this._router.navigate(['actualidad']);
      }, error => {
        this._router.navigate(['actualidad']).then(() => {
          this._toastr.error('No se ha podido cargar la sección de la actualidad', 'Actualidad');
          this._router.navigate(['actualidad']);
        })
      }
    )
  }

}
