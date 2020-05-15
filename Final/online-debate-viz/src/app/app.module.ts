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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {DataService} from './common-utils.service';
import { RightSectionTopicsNewComponent } from './right-section-topics-new/right-section-topics-new.component';
import {MatIconModule} from '@angular/material/icon';

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
    AddCandidateComponent,
    RightSectionTopicsNewComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        VideoModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule
    ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
