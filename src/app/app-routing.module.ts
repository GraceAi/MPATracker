import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RequesterRequestComponent } from './components/requests/requester-request/requester-request.component';
import { ReviewerRequestComponent } from './components/requests/reviewer-request/reviewer-request.component';
import { AssignerRequestComponent } from './components/requests/assigner-request/assigner-request.component';
import { AllRequestComponent } from './components/requests/all-request/all-request.component';
//import { NewRequestComponent } from './components/new-request/new-request.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';
import { GeneralInfoComponent } from './components/request-detail/general-info/general-info.component';
import { ContactComponent } from './components/request-detail/contact/contact.component';
import { ContractComponent } from './components/request-detail/contract/contract.component';
import { DocumentComponent } from './components/request-detail/document/document.component';
import { CommentComponent } from './components/request-detail/comment/comment.component';
import { PwlinkComponent } from './components/request-detail/pwlink/pwlink.component';
import { ReviewerComponent } from './components/request-detail/reviewer/reviewer.component';
import { LocationComponent } from './components/request-detail/location/location.component';
import { AdminComponent } from './components/requests/admin/admin.component';
import { AdminRolesComponent } from './components/requests/admin/admin-roles/admin-roles.component';
import { AdminCategoryComponent } from './components/requests/admin/admin-category/admin-category.component';
import { AdminSidetabsComponent } from './components/requests/admin/admin-sidetabs/admin-sidetabs.component';
import { ReportComponent } from './components/requests/report/report.component';
import { RequestResolver }   from './services/request-resolver.service';
import { RequestDetailResolver }   from './services/request-detail-resolver.service';
import { ReportPrintComponent } from './components/requests/report/report-print/report-print.component';
import { RequesterAuthGuard}   from './services/requester-auth-guard.service';
import { ReviewerAuthGuard}   from './services/reviewer-auth-guard.service';
import { AssignerAuthGuard}   from './services/assigner-auth-guard.service';
import { AdminAuthGuard}   from './services/admin-auth-guard.service';
import { ReportViewerAuthGuard}   from './services/reportviewer-auth-guard.service';
import { RequestDetailAuthGuard}   from './services/request-detail-auth-guard.service';
import { PageNotAuthorizedComponent }    from './components/page-not-valid/page-not-authorized.component';
import { AssignerRulesComponent } from './components/requests/assigner-request/assigner-rules/assigner-rules.component';
import { CanDeactivateGuard}   from './services/can-deactivate.guard';
import { ReportCategoryComponent } from './components/requests/report/report-category/report-category.component';
import { ReportReviewerComponent } from './components/requests/report/report-reviewer/report-reviewer.component';
import { ReportResponseCategoryComponent } from './components/requests/report/report-response-category/report-response-category.component';
import { ReportResponseReviewerComponent } from './components/requests/report/report-response-reviewer/report-response-reviewer.component';
import { ReportRequesterComponent } from './components/requests/report/report-requester/report-requester.component';

import { AdminProjectComponent } from './components/projects/admin-project/admin-project.component';
import { ManagerProjectComponent } from './components/projects/manager-project/manager-project.component';
import { ProjectDetailComponent } from './components/projects/project-detail/project-detail.component';
import { ProjectGeneralInfoComponent } from './components/projects/project-detail/general-info/general-info.component';
import { PermitComponent } from './components/projects/project-detail/permit/permit.component';
import { ProjectManagersComponent } from './components/projects/project-detail/project-managers/project-managers.component';
import { ProcurementPhaseComponent } from './components/projects/project-detail/procurement-phase/procurement-phase.component';
import { ConstructionPhaseComponent } from './components/projects/project-detail/construction-phase/construction-phase.component';

const routes: Routes = [
  //{ path: '**', component: PageNotFoundComponent },
  { path: 'unauthorized', component: PageNotAuthorizedComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, resolve: { tabs: RequestResolver },
         children: [
           {path: 'tab/1', component: RequesterRequestComponent, canActivate: [RequesterAuthGuard], pathMatch: 'full', data : { title : 'My Request List'}},
           {path: 'tab/2', component: ReviewerRequestComponent,canActivate: [ReviewerAuthGuard], pathMatch: 'full', data : { title : 'Requests for Review'}},
           {path: 'tab/5', component: AllRequestComponent,canActivate: [AssignerAuthGuard],  pathMatch: 'full', data : { title : 'Requests for Assignment'}},
           {path: 'tab/4', component: AssignerRequestComponent,canActivate: [AssignerAuthGuard], data : { title : 'Assign Default Reviewers'},
               children: [
                     {path: '', redirectTo: 'rules', pathMatch: 'full'},
                     {path: 'rules', component: AssignerRulesComponent, pathMatch: 'full'}
                   ]
            },
           {path: 'tab/6', component: ReportComponent,canActivate: [ReportViewerAuthGuard], data : { title : 'Reports'},
               children: [
                 {path: '', redirectTo: 'category', pathMatch: 'full'},
                 {path: 'category', component: ReportCategoryComponent, pathMatch: 'full'},
                 {path: 'requester', component: ReportRequesterComponent, pathMatch: 'full'},
                 {path: 'reviewer', component: ReportReviewerComponent, pathMatch: 'full'},
                 {path: 'categorytime', component: ReportResponseCategoryComponent, pathMatch: 'full'},
                 {path: 'reviewertime', component: ReportResponseReviewerComponent, pathMatch: 'full'}
               ]},
           {path: 'tab/3', component: AdminComponent,canActivate: [AdminAuthGuard], data : { title : 'Admin Settings'},
               children: [
                 {path: '', redirectTo: 'roles', pathMatch: 'full'},
                 {path: 'roles', component: AdminRolesComponent, pathMatch: 'full'},
                 {path: 'category', component: AdminCategoryComponent, pathMatch: 'full'},
                 {path: 'sidetabs', component: AdminSidetabsComponent, pathMatch: 'full'}
               ]
         },
         {path: 'tab/7', component: AdminProjectComponent, pathMatch: 'full', data : { title : 'All Project List'}},
         {path: 'tab/8', component: ManagerProjectComponent, pathMatch: 'full', data : { title : 'Projects for Project Managers'}},
       ]
  },
  { path: 'report/print/:title', component: ReportPrintComponent, pathMatch: 'full'},
  { path: 'request/:requestId/role/:roleId', component: RequestDetailComponent, canActivate: [RequestDetailAuthGuard], resolve: { requestDetail: RequestDetailResolver } ,
          children: [
                {path: '', redirectTo: 'general', pathMatch: 'full'},
                {path: 'general', component: GeneralInfoComponent, canDeactivate: [CanDeactivateGuard], pathMatch: 'full'},
                {path: 'contacts', component: ContactComponent, pathMatch: 'full'},
                {path: 'contracts', component: ContractComponent, pathMatch: 'full'},
                {path: 'documents', component: DocumentComponent, pathMatch: 'full'},
                {path: 'comments', component: CommentComponent, pathMatch: 'full'},
                {path: 'links', component: PwlinkComponent, pathMatch: 'full'},
                {path: 'location', component: LocationComponent, pathMatch: 'full'},
                {path: 'reviewers', component: ReviewerComponent, pathMatch: 'full'}
              ]
  },
  { path: 'project/:projectId/role/:roleId', component: ProjectDetailComponent, canActivate: [RequestDetailAuthGuard], data : { title : 'Project Detail'},
          children: [
                {path: '', redirectTo: 'general', pathMatch: 'full'},
                {path: 'general', component: ProjectGeneralInfoComponent, canDeactivate: [CanDeactivateGuard], pathMatch: 'full'},
                {path: 'permit', component: PermitComponent, canDeactivate: [CanDeactivateGuard], pathMatch: 'full'},
                {path: 'managers', component: ProjectManagersComponent, pathMatch: 'full'},
                {path: 'procument', component: ProcurementPhaseComponent, canDeactivate: [CanDeactivateGuard], pathMatch: 'full'},
                {path: 'construction', component: ConstructionPhaseComponent, canDeactivate: [CanDeactivateGuard], pathMatch: 'full'}
              ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers:[ RequestResolver, RequestDetailResolver ]
})
export class AppRoutingModule {}
