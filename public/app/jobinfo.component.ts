import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { JobInfo } from './jobinfo';
import { JobInfoService } from './jobinfo.service';
//cdimport { AppComponent } from './app.component';


@Component( {
    moduleId: module.id,
    selector: 'jobinfo',
    templateUrl: 'jobinfo.component.html'
})
export class JobInfoComponent {
    jobInfo: JobInfo;
    paramJobId: String;
    paramSystem: String;


    constructor(
      private JobInfoService: JobInfoService,
      private route: ActivatedRoute,
      private location: Location
    ) {}

    ngOnInit(): void {
      console.log("Load job")
      this.route.params.switchMap((params: Params) => {
        this.paramJobId = params['jobId'];
        this.paramSystem = params['system'];
        this.JobInfoService.setSystem(params['system']);
        this.JobInfoService.setJobId(params['jobId']);
        return this.JobInfoService.
          getJobInfo(null, null, params['jobId'], params['system'])
      })
      .subscribe(jobInfo => this.jobInfo = jobInfo);
    }
}
