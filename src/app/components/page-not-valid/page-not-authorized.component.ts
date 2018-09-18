import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  template: '<app-navbar></app-navbar><h2>You are not authorized to view this page. Please contact Admin for more details.</h2>'
})
export class PageNotAuthorizedComponent implements OnInit {
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.setTitle("Authorization Error");
  }
}
