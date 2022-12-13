import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent implements OnInit {



  testimonials = [
    {
      prod_image: 'assets/images/product-2.png',
      testimony:
        "Design is about creating spaces for people to enjoy and of course, creating moments where you elevate the spirit, but 'design for good' is figuring out a program that not only creates better spaces, but creates jobs, creates new industry and really kind of raises the conversation about how we rebuild.",
      first_name: 'Samanta',
      last_name: 'Willian',

      userInfo: {
        first_name: 'Samanta',
        last_name: 'William',
        photo: 'assets/images/user.png',
        occupation: 'Fashion Designer',
      },
    },
    {
      prod_image: 'assets/images/product-2.png',
      testimony:
        "Design is about creating spaces for people to enjoy and of course, creating moments where you elevate the spirit, but 'design for good' is figuring out a program that not only creates better spaces, but creates jobs, creates new industry and really kind of raises the conversation about how we rebuild.",
      first_name: 'Samanta',
      last_name: 'Willian',
      occupation: 'Fashion Designer',
      userInfo: {
        first_name: 'Samanta',
        last_name: 'William',
        photo: 'assets/images/user.png',
        occupation: 'Fashion Designer',
      },
    },
  ];

  videos = ['', '', ''];

  vidResizeConfig = [
    { minW: 600, slideNo: 2 },
    { maxW: 600, slideNo: 1 },
  ];

  constructor() {}

  ngOnInit(): void {}
}
