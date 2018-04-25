import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { JobInfo } from './jobinfo';
import { Job } from './job';

import { Subject } from 'rxjs/Subject';

interface SysMap {
    [key: string]: string;
}

@Injectable()
export class JobInfoService {
    private systemSource = new Subject<string>();
    private jobIdSource = new Subject<string>();

    system$ = this.systemSource.asObservable();
    jobId$ = this.jobIdSource.asObservable();

    setSystem(system: string) {
      this.systemSource.next(system);
    }

    setJobId(jobId: string) {
      this.jobIdSource.next(jobId); 
    }

    static sysMap: SysMap = { 'ruby': 'Ruby', 'owens': 'Owens', 'oak': 'Oakley'};
    private baseURL = '';

    constructor( private http: Http ) {
       this.baseURL = document.getElementsByTagName("base")[0].href;
       if (this.baseURL.charAt(this.baseURL.length - 1) !== '/') {
          this.baseURL = this.baseURL + "/";
       }
    }

    getJobInfo( username: string, password: string, id: string, system: string ): Promise<JobInfo> {
       // baseURL always ends in '/'
       let url = this.baseURL + `job/${system}/${id}`

       let headers = ( username && password ) ? new Headers( { 'Authorization': 'Basic ' + btoa( username + ":" + password ) }) : null;
       let options = headers ? new RequestOptions( { headers: headers }) : null;
       return this.http.get( url, options ).toPromise().then( response => {
          let jobinfo: JobInfo = new JobInfo();
          let job: Job = response.json();
          let nodes = JobInfoService.getNodeList(job);
          job.hostlist = nodes.join(", ");
          console.log(jobinfo);

          jobinfo.job = job;
          jobinfo.nodes = nodes;
          jobinfo.gangliaURLs = JobInfoService.getGangliaUrls(job, nodes);

          return jobinfo;

       }).catch( failedResponse => {
          return null;

       }) as Promise<JobInfo>;
    }

    static getNodeList(job: Job): string[] {
      let nodeList: string[] = [];
      let str = job.hostlist;

      while(true) {
        let slashIndex = str.indexOf('/');
        let substr = str.substr(0, slashIndex);
        nodeList[nodeList.length] = substr;
        str = str.substr(slashIndex, str.length);

        let matches = str.match('[a-z]'); //find index of next letter, which starts off the next node
        if (!matches || matches.length < 1) { //if no matches, there are no more nodes
          break;
        }

        let letterIndex = str.indexOf(matches[0]);
        str = str.substr(letterIndex, str.length);
      }

       let nodeListAsSet = new Set(nodeList);
       return Array.from(nodeListAsSet);
    }

    static getGangliaUrls(job: Job, nodes: string[]): string[] {
      let gangliaBase = "https://ganglia.osc.edu/";
      let defaultDomain = ".ten.osc.edu";
      let baseQuery = "?r=hour&tab=m&mc=2&metric_group=ALLGROUPS";

      //Make system's first letter upper case. rest should be undercase.
      let system = JobInfoService.sysMap[job.system];     
          let urls: string[] = [];
          for (let i = 0; i < nodes.length; i++) {
            let url = gangliaBase + baseQuery;
            url += "&c="  + system;
            url += "&h="  + nodes[i] + defaultDomain;
            url += "&cs=" + encodeURIComponent(JobInfoService.getDate((parseInt(job.start_ts, 10) - 300).toString()));
            url += "&ce=" + encodeURIComponent(JobInfoService.getDate((parseInt(job.end_ts, 10) + 300).toString()));
            console.log(url);
            urls[i] = url;
            console.log("urls array: " + urls);
          }

          return urls;
    }

    static getDate(ts: string): string {
      let date = new Date(Number(ts) * 1000);

      let minute: any = date.getMinutes();
      let hour: any = date.getHours();
      let day: any = date.getDate();
      let month: any  = date.getMonth() + 1;
      let year = date.getFullYear();

      minute = (minute < 10) ? "0" + minute : minute;
      hour = (hour < 10) ? "0" + hour : hour;
      day = (day < 10) ? "0" + day : day;
      month = (month < 10) ? "0" + month : month;

      let dateTime = month + "/" + day + "/" + year + " " + hour + ":" + minute;
      return dateTime;
    }

    private extract( resp: Response ) {
        return resp.json();
    }

    private handleError( error: Response | any ) {
        let errMsg: string;
        if ( error instanceof Response ) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify( body );
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.tostring();
        }
        console.error( errMsg );
    }
}
