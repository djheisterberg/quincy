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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var jobinfo_1 = require("./jobinfo");
var JobInfoService = JobInfoService_1 = (function () {
    function JobInfoService(http) {
        this.http = http;
        //  private baseURL = "http://localhost:4204/jobinfo-rest/jobinfo/rest";
        this.baseURL = "http://localhost:1337";
    }
    JobInfoService.prototype.getJobInfo = function (username, password, id, system) {
        //let url = this.baseURL + `?id=${id}&system=${system}`;
        var url = this.baseURL + ("/job/" + system + "/" + id);
        var headers = (username && password) ? new http_1.Headers({ 'Authorization': 'Basic ' + btoa(username + ":" + password) }) : null;
        var options = headers ? new http_1.RequestOptions({ headers: headers }) : null;
        return this.http.get(url, options).toPromise().then(function (response) {
            var jobinfo = new jobinfo_1.JobInfo();
            var job = response.json();
            var nodes = JobInfoService_1.getNodeList(job);
            job.hostlist = nodes.join(", ");
            console.log(jobinfo);
            jobinfo.job = job;
            jobinfo.nodes = nodes;
            jobinfo.gangliaURLs = JobInfoService_1.getGangliaUrls(job, nodes);
            return jobinfo;
        }).catch(function (failedResponse) {
            return null;
        });
    };
    JobInfoService.getNodeList = function (job) {
        var nodeList = [];
        var str = job.hostlist;
        while (true) {
            var slashIndex = str.indexOf('/');
            var substr = str.substr(0, slashIndex);
            nodeList[nodeList.length] = substr;
            str = str.substr(slashIndex, str.length);
            var matches = str.match('[a-z]'); //find index of next letter, which starts off the next node
            if (!matches || matches.length < 1) {
                break;
            }
            var letterIndex = str.indexOf(matches[0]);
            str = str.substr(letterIndex, str.length);
        }
        var nodeListAsSet = new Set(nodeList);
        return Array.from(nodeListAsSet);
    };
    JobInfoService.getGangliaUrls = function (job, nodes) {
        var gangliaBase = "https://ganglia.osc.edu/";
        var defaultDomain = ".ten.osc.edu";
        var baseQuery = "?r=hour&tab=m&mc=2&metric_group=ALLGROUPS";
        //Make system's first letter upper case. rest should be undercase.
        var system = job.system.substr(0, 1).toUpperCase() + job.system.substr(1);
        var urls = [];
        for (var i = 0; i < nodes.length; i++) {
            var url = gangliaBase + baseQuery;
            url += "&c=" + system;
            url += "&h=" + nodes[i] + defaultDomain;
            url += "&cs=" + encodeURIComponent(JobInfoService_1.getDate(job.start_ts));
            url += "&ce=" + encodeURIComponent(JobInfoService_1.getDate(job.end_ts));
            console.log(url);
            urls[i] = url;
            console.log("urls array: " + urls);
        }
        return urls;
    };
    JobInfoService.getDate = function (ts) {
        var date = new Date(Number(ts) * 1000);
        var minute = date.getMinutes();
        var hour = date.getHours();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        minute = (minute < 10) ? "0" + minute : minute;
        hour = (hour < 10) ? "0" + hour : hour;
        day = (day < 10) ? "0" + day : day;
        month = (month < 10) ? "0" + month : month;
        var dateTime = month + "/" + day + "/" + year + " " + hour + ":" + minute;
        return dateTime;
    };
    JobInfoService.prototype.extract = function (resp) {
        return resp.json();
    };
    JobInfoService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.tostring();
        }
        console.error(errMsg);
    };
    return JobInfoService;
}());
JobInfoService = JobInfoService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], JobInfoService);
exports.JobInfoService = JobInfoService;
var JobInfoService_1;
//# sourceMappingURL=jobinfo.service.js.map