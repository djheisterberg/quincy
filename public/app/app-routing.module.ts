import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { JobInfoComponent } from './jobinfo.component';


const routes: Routes = [
  {
    path: ':system/:jobId',
    component: JobInfoComponent
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
