import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Project } from '../../../classes/project';
import { AuthenticationService } from '../../../services/authentication.service';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-manager-project',
  templateUrl: './manager-project.component.html',
  styleUrls: ['./manager-project.component.css']
})
export class ManagerProjectComponent implements OnInit {
  resultCount:string;
  role_id:number = 6;
  constructor(private authService: AuthenticationService,
              private projectService: ProjectService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
        .subscribe((data: { title: string }) => {
          this.authService.setTitle(data.title);
        });
    this.authService.setProjectFilter(new Project());
  }

  searchResultCount(count:number) {
    if(count > 1)
      this.resultCount = count + " results";
    else if(count <= 1)
      this.resultCount = count + " result";
  }

}
