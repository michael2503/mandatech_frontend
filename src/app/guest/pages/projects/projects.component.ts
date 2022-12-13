import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { ContentsService } from 'src/app/data/services/guest/contents.service';
import { PaginationService } from 'src/app/data/services/pagination.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    pageLimit = 10;
    currPage = 1;

    projects = [];
    projectCounts = 0;
    paginationLink;

    isLoadMore = true;
    isLoading = true;

    constructor(
        private wowService: NgwWowService,
        private contentService: ContentsService,
        private route: ActivatedRoute,
        private pageS: PaginationService,
        private router: Router,
    ) {
        this.wowService.init();
    }

    ngOnInit(): void {
        this.route.params.subscribe(param => {
            // this.customerStatus = param.status;
            this.currPage = +param['page'] || 1;
            this.allThisContent(this.pageLimit, this.currPage);
        });
    }


    private allThisContent(page, currPage, isMore = false) {
        this.contentService.projectContent(
          page, currPage
        ).subscribe(res => {
          if (res) {
            if (isMore) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.projects.push(res.data.data[i]);
              }
            } else {
              this.projects = res.data.data;
            }
            this.projectCounts = res.data.counts;
            this.paginationLink = this.pageS.links(res.data.counts, this.pageLimit, this.currPage);
          }
          this.isLoadMore = false;
          this.isLoading = false;
        });
    }




}
