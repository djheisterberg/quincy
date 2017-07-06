import { Component, Input } from '@angular/core';

import { Job } from './job';

@Component( {
    moduleId: module.id,
    selector: 'job',
    templateUrl: 'job.component.html'
})
export class JobComponent {
    @Input() job: Job;
}
