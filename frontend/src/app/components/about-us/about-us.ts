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
      role: 'Project Lead & Frontend Architect',
      bio: 'The visionary Project Lead and Gold Medalist in Arts. Mastermind behind the platform’s responsive architecture, liquid glass UI/UX, and end-to-end production deployments.',
      image: 'assets/founder-rafay.png',
      linkedin: 'https://www.linkedin.com/in/abdulrafayqar'
    },
    {
      name: 'Sinan M Shoaib',
      role: 'Backend Architecture',
      bio: 'Strategic architect behind FitHae’s scalable server ecosystems. Expert in complex RESTful APIs, high-performance logic, and secure infrastructure.',
      image: 'assets/sinan.jpg',
      linkedin: 'https://linkedin.com/in/sinan-m-shoaib'
    },
    {
      name: 'Abdul Sattar',
      role: 'Database Management',
      bio: 'Database wizard ensuring peak performance and data integrity. Expert in MongoDB indexing, complex aggregations, and high-availability data scaling.',
      image: 'assets/sattar.jpg',
      linkedin: 'https://linkedin.com/in/abdul-sattar'
    }
  ];
}
