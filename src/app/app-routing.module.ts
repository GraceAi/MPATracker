import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestsComponent } from './components/requests/requests.component';
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

const routes: Routes = [
  //{ path: '**', component: PageNotFoundComponent },
  { path: 'unauthorized', component: PageNotAuthorizedComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: RequestsComponent, resolve: { tabs: RequestResolver },
         children: [
           {path: 'tab/1', component: RequesterRequestComponent, canActivate: [RequesterAuthGuard], pathMatch: 'full', data : { title : 'My Request List'}},
           {path: 'tab/2', component: ReviewerRequestComponent,canActivate: [ReviewerAuthGuard], pathMatch: 'full', data : { title : 'My Assigned Requests'}},
           {path: 'tab/5', component: AllRequestComponent,canActivate: [AssignerAuthGuard],  pathMatch: 'full', data : { title : 'All Requests'}},
           {path: 'tab/4', component: AssignerRequestComponent,canActivate: [AssignerAuthGuard],  pathMatch: 'full', data : { title : 'Assigner'}},
           {path: 'tab/6', component: ReportComponent,canActivate: [ReportViewerAuthGuard], pathMatch: 'full', data : { title : 'Reports'}},
           {path: 'tab/3', component: AdminComponent,canActivate: [AdminAuthGuard], data : { title : 'Administrator Access'},
              children: [
                {
                  path: '',
                  //canActivateChild: [AdminAuthGuard],
                  children: [
                    {path: '', redirectTo: 'roles', pathMatch: 'full'},
                    {path: 'roles', component: AdminRolesComponent, pathMatch: 'full'},
                    {path: 'category', component: AdminCategoryComponent, pathMatch: 'full'},
                    {path: 'sidetabs', component: AdminSidetabsComponent, pathMatch: 'full'}
                  ]
                }
              ]
         }]
  },
  { path: 'report/print/:title', component: ReportPrintComponent, pathMatch: 'full'},
  { path: 'request/:requestId/role/:roleId', component: RequestDetailComponent, canActivate: [RequestDetailAuthGuard], resolve: { requestDetail: RequestDetailResolver } ,
          children: [
                {path: '', redirectTo: 'general', pathMatch: 'full'},
                {path: 'general', component: GeneralInfoComponent, pathMatch: 'full'},
                {path: 'contacts', component: ContactComponent, pathMatch: 'full'},
                {path: 'contracts', component: ContractComponent, pathMatch: 'full'},
                {path: 'documents', component: DocumentComponent, pathMatch: 'full'},
                {path: 'comments', component: CommentComponent, pathMatch: 'full'},
                {path: 'links', component: PwlinkComponent, pathMatch: 'full'},
                {path: 'location', component: LocationComponent, pathMatch: 'full'},
                {path: 'reviewers', component: ReviewerComponent, pathMatch: 'full'},
              ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers:[ RequestResolver, RequestDetailResolver ]
})
export class AppRoutingModule {}
