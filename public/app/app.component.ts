import { Component } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute, Params, ParamMap } from '@angular/router';

import { Job } from './job';
import { JobInfo } from './jobinfo';
import { JobInfoService } from './jobinfo.service';

@Component( {
    moduleId: module.id,
    selector: 'the-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    name = 'JobInfo';
    title = "Job Info";
    systems = [
        { value: 'owens', display: 'Owens'},
        { value: 'oak', display: 'Oakley'},
        { value: 'ruby', display: 'Ruby'},
        { value: 'pitzer', display: 'Pitzer'}
    ]
    needsAuthentication = false;
    notFound = false;

    username: string;
    password: string;

    jobId: string;
    system: string;
    lastJobId: string;
    lastSystem: string;

    jobInfo: JobInfo;

    constructor( private jobInfoSvc: JobInfoService, private router: Router, private route:ActivatedRoute) {
        jobInfoSvc.system$.subscribe(
            system => {
                this.system = system;
            });
        jobInfoSvc.jobId$.subscribe(
            jobId => {
                this.jobId = jobId;
            }); 
    }

    ngOnInit(): void {
        console.log("app component loaded");
    }

    submit(): void {
      this.router.navigate([`./${this.system}/${this.jobId}`]);
    }

    handleError( response: Response | any ) {
        this.needsAuthentication = true;
        alert( "response is '" + response + "'" );
    }
}
