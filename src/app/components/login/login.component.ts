import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [UserService]
})

export class LoginComponent implements OnInit {
  public title: string;
  public user: User;
  public token: any; // TOKEN DEL ADMIN
  public identity: any; //USER => DATA DEL ADMIN
  public status: any;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _router: Router,
    private _toastr: ToastrService
  ) {
    this.title = 'Identificate';
    this.identity = this._userService.getIdentity();
    this.user = new User(1, '', '', '');
  }

  ngOnInit(): void {

  }

  onSubmit(loginForm: NgForm) {
    this._userService.login(this.user).subscribe(
      response => {
        //Token
        if (response.success) {
          this.status = true;
          this.token = response.token;
          localStorage.setItem('token', this.token);
          this.identity = JSON.stringify(response.data);
          localStorage.setItem('identity', this.identity);

          this._router.navigate(['panel']).then(() => {
            this._toastr.success('Se ha accedido de forma correcta al sistema, Bienvenida Claudia.', 'Administrador');
            loginForm.reset();
            this._router.navigate(['panel'])
          })
        } else {
          this.status = false;
          this._toastr.error('No se ha podia acceder al sistema.', 'Administrador');
          loginForm.reset();
          this._router.navigate(['panel'])
        }

      },
      error => {
        this.status = false;
        this._toastr.error('No se ha podia acceder al sistema.', 'Administrador');
        loginForm.reset(); //Reset del formulario
        this._router.navigate(['panel'])
      }
    );
  }
}
