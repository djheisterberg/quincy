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
require("rxjs/add/operator/switchMap");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var jobinfo_service_1 = require("./jobinfo.service");
var JobInfoComponent = (function () {
    function JobInfoComponent(JobInfoService, route, location) {
        this.JobInfoService = JobInfoService;
        this.route = route;
        this.location = location;
    }
    JobInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.switchMap(function (params) {
            _this.paramJobId = params['jobId'];
            _this.paramSystem = params['system'];
            return _this.JobInfoService.
                getJobInfo(null, null, params['jobId'], params['system']);
        })
            .subscribe(function (jobInfo) { return _this.jobInfo = jobInfo; });
    };
    return JobInfoComponent;
}());
JobInfoComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'jobinfo',
        templateUrl: 'jobinfo.component.html'
    }),
    __metadata("design:paramtypes", [jobinfo_service_1.JobInfoService,
        router_1.ActivatedRoute,
        common_1.Location])
], JobInfoComponent);
exports.JobInfoComponent = JobInfoComponent;
//# sourceMappingURL=jobinfo.component.js.map