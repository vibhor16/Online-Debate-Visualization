import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopSectionComponent } from './top-section/top-section.component';
import { LeftSectionComponent } from './left-section/left-section.component';
import { RightSectionComponent } from './right-section/right-section.component';
import { RightSectionVideoComponent } from './right-section-video/right-section-video.component';
import { RightSectionTaggingComponent } from './right-section-tagging/right-section-tagging.component';
import { RightSectionTopicsComponent } from './right-section-topics/right-section-topics.component';
import { RightSectionFishComponent } from './right-section-fish/right-section-fish.component';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import {VideoModule} from './video/video.module';

@NgModule({
  declarations: [
    AppComponent,
    TopSectionComponent,
    LeftSectionComponent,
    RightSectionComponent,
    RightSectionVideoComponent,
    RightSectionTaggingComponent,
    RightSectionTopicsComponent,
    RightSectionFishComponent,
    AddCandidateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    VideoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
