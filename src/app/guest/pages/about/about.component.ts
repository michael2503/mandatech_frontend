import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { ContentsService } from 'src/app/data/services/guest/contents.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
    isLoading = true;
//   teams = [
//     {
//         photo:'/assets/images/team/team-image-1-4.jpg',
//         name: 'CHARLES HENRY',
//         post: 'CEO | Founder',
//     },
//     {
//         photo:'/assets/images/team/team-image-2-4.jpg',
//         name: 'EDWARD MATTHEW',
//         post: 'Marketing Manager',
//     },
//     {
//         photo:'/assets/images/team/team-image-3-Jun-27-2021-09-08-41-93-AM.jpg',
//         name: 'BEN CHRISTOPHER',
//         post: 'Senior Engineer',
//     },
//     {
//         photo:'/assets/images/team/team-image-4-1.jpg',
//         name: 'LINDYS THOMAS',
//         post: 'Marketing Manager',
//     },
//   ];


    // histories = [
    //     {
    //     year: '2012',
    //     title:"COMPANY FOUNDED",
    //     content: 'Pellentesque porta arcu velit faucibs kodales dolor rhoncus sed. Curabitur lacinia masysa vitae sed',
    //     },
    //     {
    //         year: '2013',
    //         title:"FEATURES & ADD-ONS",
    //         content: 'Pellentesque porta arcu velit faucibs kodales dolor rhoncus sed. Curabitur lacinia masysa vitae sed',
    //     },
    //     {
    //         year: '2014',
    //         title:"CONTINUE TO INSPIRE",
    //         content: 'Pellentesque porta arcu velit faucibs kodales dolor rhoncus sed. Curabitur lacinia masysa vitae sed',
    //     },
    //     {
    //         year: '2015',
    //         title:"GOT BEST TECH AWARD",
    //         content: 'Pellentesque porta arcu velit faucibs kodales dolor rhoncus sed. Curabitur lacinia masysa vitae sed',
    //     },
    //     {
    //         year: '2016',
    //         title:"COMPANY FOUNDED",
    //         content: 'Pellentesque porta arcu velit faucibs kodales dolor rhoncus sed. Curabitur lacinia masysa vitae sed',
    //     },
    //     {
    //         year: '2017',
    //         title:"FEATURES & ADD-ONS",
    //         content: 'Pellentesque porta arcu velit faucibs kodales dolor rhoncus sed. Curabitur lacinia masysa vitae sed',
    //     },
    //     {
    //         year: '2018',
    //         title:"CONTINUE TO INSPIRE",
    //         content: 'Pellentesque porta arcu velit faucibs kodales dolor rhoncus sed. Curabitur lacinia masysa vitae sed',
    //     },
    //     {
    //         year: '2019',
    //         title:"GOT BEST TECH AWARD",
    //         content: 'Pellentesque porta arcu velit faucibs kodales dolor rhoncus sed. Curabitur lacinia masysa vitae sed',
    //     },
    // ];


    teamResizeConfig = [
        { minW: 800, slideNo: 4 },
        { minW: 600, maxW: 800, slideNo: 3 },
        { minW: 400, maxW: 600, slideNo: 2 },
        { maxW: 400, slideNo: 1 },
    ];
    historyResizeConfig = [
        { minW: 800, slideNo: 4 },
        { minW: 600, maxW: 800, slideNo: 3 },
        { minW: 400, maxW: 600, slideNo: 2 },
        { maxW: 400, slideNo: 1 },
    ];

    ourTeams;
    about;
    whyus;
    histories;
    teams;
    aboutServices = [];

    constructor(
        private wowService: NgwWowService,
        private contentService: ContentsService
    ) {
        this.wowService.init();
    }

    ngOnInit(): void {
        this.allThisContent()
    }

    private allThisContent(){
        this.contentService.aboutUsContent().subscribe(res => {
            console.log(res);
            if(res){
                this.about = res.data.about;
                this.teams = res.data.ourTeams;
                this.whyus = res.data.why_us;
                this.histories = res.data.comHist;
                this.aboutServices = res.data.aboutService;
            }
            this.isLoading = false;
        })
    }

}
