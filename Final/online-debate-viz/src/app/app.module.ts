import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopSectionComponent } from './user-main/top-section/top-section.component';
import { LeftSectionComponent } from './user-main/left-section/left-section.component';
import { RightSectionComponent } from './user-main/right-section/right-section.component';
import { RightSectionVideoComponent } from './user-main/right-section-video/right-section-video.component';
import { RightSectionTaggingComponent } from './user-main/right-section-tagging/right-section-tagging.component';
import { RightSectionFishComponent } from './user-main/right-section-fish/right-section-fish.component';
import { AddCandidateComponent } from './user-main/add-candidate/add-candidate.component';
import {VideoModule} from './video/video.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {DataService} from './common-utils.service';
import { RightSectionTopicsNewComponent } from './user-main/right-section-topics-new/right-section-topics-new.component';
import {MatIconModule} from '@angular/material/icon';
import { UserMainComponent } from './user-main/user-main.component';
import { CustomerComponent } from './customer/customer.component';
import { RightSectionCustComponent } from './customer/right-section-cust/right-section-cust.component';
import { RightSectionFishCustComponent } from './customer/right-section-fish-cust/right-section-fish-cust.component';
import { RightSectionTopicsCustComponent } from './customer/right-section-topics-cust/right-section-topics-cust.component';
import { RightSectionVideoCustComponent } from './customer/right-section-video-cust/right-section-video-cust.component';
import { TopSectionCustComponent } from './customer/top-section-cust/top-section-cust.component';
import { InteractionSummaryComponent } from './user-main/interaction-summary/interaction-summary.component';
import { RankEvolutionComponent } from './user-main/rank-evolution/rank-evolution.component';
import { InteractionSummaryCustComponent } from './customer/interaction-summary-cust/interaction-summary-cust.component';
import { RankEvolutionCustComponent } from './customer/rank-evolution-cust/rank-evolution-cust.component';

@NgModule({
  declarations: [
    AppComponent,
    TopSectionComponent,
    LeftSectionComponent,
    RightSectionComponent,
    RightSectionVideoComponent,
    RightSectionTaggingComponent,
    RightSectionFishComponent,
    AddCandidateComponent,
    RightSectionTopicsNewComponent,
    UserMainComponent,
    CustomerComponent,
    RightSectionCustComponent,
    RightSectionFishCustComponent,
    RightSectionTopicsCustComponent,
    RightSectionVideoCustComponent,
    TopSectionCustComponent,
    InteractionSummaryComponent,
    RankEvolutionComponent,
    InteractionSummaryCustComponent,
    RankEvolutionCustComponent
  ],
    imports: [
        HttpClientModule,
        BrowserModule,
        VideoModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        AppRoutingModule
    ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
