import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import { HashLocationStrategy, LocationStrategy, DatePipe } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatListModule, MatSidenavModule, MatExpansionModule, MatTableModule, MatSortModule, MatDialogModule, MatProgressSpinnerModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { WinAuthInterceptor } from './services/WinAuthInterceptor';
import { AuthenticationService } from './services/authentication.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchPanelComponent } from './components/requests/search-panel/search-panel.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { GeneralInfoComponent } from './components/request-detail/general-info/general-info.component';
import { ContactComponent } from './components/request-detail/contact/contact.component';
import { ContractComponent } from './components/request-detail/contract/contract.component';
import { DocumentComponent } from './components/request-detail/document/document.component';
import { CommentComponent } from './components/request-detail/comment/comment.component';
import { PwlinkComponent } from './components/request-detail/pwlink/pwlink.component';
import { NewRequestDialog } from './components/modals/dialog-newrequest/dialog-newrequest';
//import { NewRequestComponent } from './components/new-request/new-request.component';
import { ReviewerComponent } from './components/request-detail/reviewer/reviewer.component';
import { LocationComponent } from './components/request-detail/location/location.component';
import { AddDocumentDialog } from './components/modals/dialog-adddoc/dialog-adddoc';
import { AddContractDialog } from './components/modals/dialog-addcontract/dialog-addcontract';
import { AddLinkDialog } from './components/modals/dialog-addlink/dialog-addlink';
import { AddCommentDialog } from './components/modals/dialog-addcomment/dialog-addcomment';
import { AddContactDialog } from './components/modals/dialog-addcontact/dialog-addcontact';
import { NewContactDialog } from './components/modals/dialog-newcontact/dialog-newcontact';
import { ConfirmationDialog } from './components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from './components/modals/dialog-notification/dialog-notification';
import { LocationMapDialog } from './components/modals/dialog-location/dialog-location';
import { RequesterRequestComponent } from './components/requests/requester-request/requester-request.component';
import { ReviewerRequestComponent } from './components/requests/reviewer-request/reviewer-request.component';
import { AssignerRequestComponent } from './components/requests/assigner-request/assigner-request.component';
import { AdminComponent } from './components/requests/admin/admin.component';
import { RequestTableComponent } from './components/requests/request-table/request-table.component';
import { AllRequestComponent } from './components/requests/all-request/all-request.component';
import { AdminRolesComponent } from './components/requests/admin/admin-roles/admin-roles.component';
import { AdminCategoryComponent } from './components/requests/admin/admin-category/admin-category.component';
import { AdminSidetabsComponent } from './components/requests/admin/admin-sidetabs/admin-sidetabs.component';
import { AddCategoryDialog } from './components/modals/dialog-addcategory/dialog-addcategory';
import { ReportComponent } from './components/requests/report/report.component';
import { FilterComponent } from './components/requests/report/filter/filter.component';
import { ChartComponent } from './components/requests/report/report-template/chart/chart.component';
import { ReportTableComponent } from './components/requests/report/report-template/report-table/report-table.component';
import { ReportPrintComponent } from './components/requests/report/report-print/report-print.component';
import { pwlinkValidatorDirective } from './components/directives/pw-name.directive';
import { contactEmailValidatorDirective } from './components/directives/contact-validator.directive';
import { contractNoValidatorDirective } from './components/directives/contract-validator.directive';
import { categoryCodeValidatorDirective } from './components/directives/category-validator.directive';
import { RemoveUnderscorePipe } from './components/directives/remove-underscore.pipe';
import { RequesterAuthGuard }   from './services/requester-auth-guard.service';
import { ReviewerAuthGuard}   from './services/reviewer-auth-guard.service';
import { AssignerAuthGuard}   from './services/assigner-auth-guard.service';
import { AdminAuthGuard}   from './services/admin-auth-guard.service';
import { ReportViewerAuthGuard}   from './services/reportviewer-auth-guard.service';
import { RequestDetailAuthGuard}   from './services/request-detail-auth-guard.service';
import { PageNotAuthorizedComponent }    from './components/page-not-valid/page-not-authorized.component';
import { AssignerRulesComponent } from './components/requests/assigner-request/assigner-rules/assigner-rules.component';
import { ReportCategoryComponent } from './components/requests/report/report-category/report-category.component';
import { ReportReviewerComponent } from './components/requests/report/report-reviewer/report-reviewer.component';
import { ReportResponseCategoryComponent } from './components/requests/report/report-response-category/report-response-category.component';
import { ReportResponseReviewerComponent } from './components/requests/report/report-response-reviewer/report-response-reviewer.component';
import { ReportRequesterComponent } from './components/requests/report/report-requester/report-requester.component';

import { ManagerProjectComponent } from './components/projects/manager-project/manager-project.component';
import { ProjectSearchPanelComponent } from './components/projects/search-panel/search-panel.component';
import { ProjectTableComponent } from './components/projects/project-table/project-table.component';
import { AdminProjectComponent } from './components/projects/admin-project/admin-project.component';
import { ProjectDetailComponent } from './components/projects/project-detail/project-detail.component';
import { NewProjectDialog } from './components/modals/dialog-newproject/dialog-newproject';
import { ProjectGeneralInfoComponent } from './components/projects/project-detail/general-info/general-info.component';
import { PermitComponent } from './components/projects/project-detail/permit/permit.component';
import { ProjectManagersComponent } from './components/projects/project-detail/project-managers/project-managers.component';
import { ProcurementPhaseComponent } from './components/projects/project-detail/procurement-phase/procurement-phase.component';
import { ConstructionPhaseComponent } from './components/projects/project-detail/construction-phase/construction-phase.component';
import { NewFirmDialog } from './components/modals/dialog-newfirm/dialog-newfirm';
import { ReportTemplateComponent } from './components/requests/report/report-template/report-template.component';
import { IntroductionComponent } from './components/introduction/introduction.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SearchPanelComponent,
    RequestDetailComponent,
    GeneralInfoComponent,
    ContactComponent,
    ContractComponent,
    DocumentComponent,
    CommentComponent,
    PwlinkComponent,
    NewRequestDialog,
    //NewRequestComponent,
    ReviewerComponent,
    LocationComponent,
    AddDocumentDialog,
    AddContractDialog,
    AddLinkDialog,
    AddCommentDialog,
    AddContactDialog,
    NewContactDialog,
    ConfirmationDialog,
    NotificationDialog,
    LocationMapDialog,
    RequesterRequestComponent,
    ReviewerRequestComponent,
    AssignerRequestComponent,
    AdminComponent,
    RequestTableComponent,
    AllRequestComponent,
    AdminRolesComponent,
    AdminCategoryComponent,
    AdminSidetabsComponent,
    AddCategoryDialog,
    ReportComponent,
    FilterComponent,
    ChartComponent,
    ReportTableComponent,
    ReportPrintComponent,
    pwlinkValidatorDirective,
    contactEmailValidatorDirective,
    contractNoValidatorDirective,
    categoryCodeValidatorDirective,
    RemoveUnderscorePipe,
    PageNotAuthorizedComponent,
    AssignerRulesComponent,
    ReportCategoryComponent,
    ReportReviewerComponent,
    ReportResponseCategoryComponent,
    ReportResponseReviewerComponent,
    ReportRequesterComponent,
    ManagerProjectComponent,
    ProjectSearchPanelComponent,
    ProjectTableComponent,
    AdminProjectComponent,
    ProjectDetailComponent,
    NewProjectDialog,
    ProjectGeneralInfoComponent,
    PermitComponent,
    ProjectManagersComponent,
    ProcurementPhaseComponent,
    ConstructionPhaseComponent,
    NewFirmDialog,
    ReportTemplateComponent,
    IntroductionComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    //WinAuthInterceptor,
    RequesterAuthGuard, ReviewerAuthGuard,AssignerAuthGuard, AdminAuthGuard, ReportViewerAuthGuard,RequestDetailAuthGuard,
    AuthenticationService, DatePipe,
    { provide: APP_INITIALIZER, useFactory: (authService: AuthenticationService) => () => authService.getSettings(), deps: [AuthenticationService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: WinAuthInterceptor, multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
  entryComponents: [
    NewRequestDialog, AddDocumentDialog, AddContractDialog, AddLinkDialog,AddCommentDialog,AddContactDialog,NewContactDialog,ConfirmationDialog,
    NotificationDialog,LocationMapDialog,AddCategoryDialog, NewProjectDialog, NewFirmDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
