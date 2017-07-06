"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var jobinfo_service_1 = require("./jobinfo.service");
var AppComponent = (function () {
    function AppComponent(jobInfoSvc, router) {
        this.jobInfoSvc = jobInfoSvc;
        this.router = router;
        this.name = 'JobInfo';
        this.title = "Job Info";
        this.needsAuthentication = false;
        this.notFound = false;
    }
    AppComponent.prototype.submit = function () {
        this.router.navigate(["./" + this.system + "/" + this.jobId]);
    };
    AppComponent.prototype.handleError = function (response) {
        this.needsAuthentication = true;
        alert("response is '" + response + "'");
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'the-app',
        templateUrl: 'app.component.html'
    }),
    __metadata("design:paramtypes", [jobinfo_service_1.JobInfoService, router_1.Router])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map