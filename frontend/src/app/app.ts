import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('FitHae');
  currentTimePKT = signal('');
  isDarkMode = signal(false); // Default to Light Mode
  private timer: any;

  // Custom Cursor
  // Custom Cursor & Interaction Ball
  cursorX = 0;
  cursorY = 0;
  ballX = 0;
  ballY = 0;
  weatherData: any = { temp: '--', condition: 'Loading...' };
  trails: { x: number, y: number }[] = [];

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.updateTime();
    this.fetchWeather();
    this.timer = setInterval(() => this.updateTime(), 1000);
    
    // Check initial theme
    const theme = localStorage.getItem('theme') || 'light';
    this.isDarkMode.set(theme === 'dark');
    document.body.setAttribute('data-theme', theme);

    // Mouse Tracking & Ball Physics
    window.addEventListener('mousemove', (e) => {
      this.cursorX = e.clientX - 10;
      this.cursorY = e.clientY - 10;

      // Delayed ball movement for "smooth" feel
      setTimeout(() => {
        this.ballX = e.clientX;
        this.ballY = e.clientY;
      }, 100);

      // Update trails
      this.trails.unshift({ x: this.cursorX + 5, y: this.cursorY + 5 });
      if (this.trails.length > 5) this.trails.pop();
    });
  }

  fetchWeather() {
    // Using a free public endpoint for Islamabad
    fetch('https://wttr.in/Islamabad?format=j1')
      .then(res => res.json())
      .then(data => {
        const current = data.current_condition[0];
        this.weatherData = {
          temp: current.temp_C + '°C',
          condition: current.weatherDesc[0].value
        };
      })
      .catch(() => this.weatherData = { temp: '32°C', condition: 'Sunny' }); // Fallback
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  updateTime() {
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Karachi', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    };
    this.currentTimePKT.set(new Intl.DateTimeFormat('en-US', options).format(new Date()));
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    const newTheme = this.isDarkMode() ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  get isAdmin() {
    return this.authService.getUserRole?.() === 'admin';
  }
}
