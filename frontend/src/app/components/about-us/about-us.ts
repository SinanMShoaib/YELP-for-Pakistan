import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUsComponent {
  founders = [
    {
      name: 'Abdul Rafay',
      role: 'Frontend & Deployment',
      bio: 'Visionary UI/UX designer crafting user friendly experiences, handling robust deployments, and scalable MEAN stack architecture .',
      image: 'assets/rafay.jpg',
      linkedin: 'https://www.linkedin.com/in/abdulrafayqar'
    },
    {
      name: 'Sinan M Shoaib',
      role: 'Backend Architecture',
      bio: 'Mastermind behind the architecture and complex RESTful APIs.',
      image: 'assets/sinan.jpg',
      linkedin: 'https://linkedin.com/in/sinan-m-shoaib'
    },
    {
      name: 'Abdul Sattar',
      role: 'Database Management',
      bio: 'Data wizard ensuring seamless MongoDB integrations, and high availability.',
      image: 'assets/sattar.jpg',
      linkedin: 'https://linkedin.com/in/abdul-sattar'
    }
  ];
}
