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
      bio: 'Visionary UI/UX designer crafting liquid glass experiences and handling robust deployments.',
      image: 'assets/founder-rafay.png',
      linkedin: 'https://linkedin.com/in/abdul-rafay'
    },
    {
      name: 'Sinan M Shoaib',
      role: 'Backend Architecture',
      bio: 'Mastermind behind the scalable MEAN stack architecture and complex RESTful APIs.',
      image: 'assets/sinan-placeholder.png', // Fallback for failed generation
      linkedin: 'https://linkedin.com/in/sinan-m-shoaib'
    },
    {
      name: 'Abdul Sattar',
      role: 'Database Management',
      bio: 'Data wizard ensuring seamless MongoDB integrations, aggregations, and high availability.',
      image: 'assets/sattar-placeholder.png',
      linkedin: 'https://linkedin.com/in/abdul-sattar'
    }
  ];
}
