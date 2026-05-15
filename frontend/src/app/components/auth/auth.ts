import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: true }) threeCanvas!: ElementRef;

  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  mouseX = 0;
  mouseY = 0;
  tiltX = 0;
  tiltY = 0;
  isDarkMode = signal(false);

  // Three.js properties
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private torchLight!: THREE.PointLight;
  private shapes: THREE.Mesh[] = [];
  private animationId!: number;

  // Form Data
  authData = {
    name: '',
    email: '',
    password: '',
    username: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  updateTorch(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  updateTilt(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    this.tiltX = (y - centerY) / 20;
    this.tiltY = -(x - centerX) / 20;
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/search']);
    }
    const theme = localStorage.getItem('theme') || 'light';
    this.isDarkMode.set(theme === 'dark');
    document.body.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    const newTheme = this.isDarkMode() ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  ngAfterViewInit() {
    this.initThreeJs();
  }

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onWindowResize);
  }

  private initThreeJs() {
    const container = this.threeCanvas.nativeElement;
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    // Floating Glass-like Shapes
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.7, 0.2, 16, 100),
      new THREE.OctahedronGeometry(0.8, 0)
    ];

    for (let i = 0; i < 15; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.scene.add(mesh);
      this.shapes.push(mesh);
    }

    // The Torch Light
    this.torchLight = new THREE.PointLight(0xd32f2f, 15, 20); // Maroon/Red light
    this.torchLight.position.set(0, 0, 2);
    this.scene.add(this.torchLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.animate();
  }

  private onMouseMove = (event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.torchLight.position.x = x * 8;
    this.torchLight.position.y = y * 4;
  }

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    this.shapes.forEach(shape => {
      shape.rotation.x += 0.005;
      shape.rotation.y += 0.005;
    });

    this.renderer.render(this.scene, this.camera);
  }

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }

  onSubmit() {
    this.isLoading = true;
    this.error = null;

    if (this.isLoginMode) {
      this.authService.login({ email: this.authData.email, password: this.authData.password }).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.error = err.error.message || 'Login failed. Check your credentials.';
          this.isLoading = false;
        }
      });
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(this.authData.password)) {
        this.error = "Security Policy: Password must be 8+ chars with Uppercase, Lowercase, Number & Special Character (@$!%*?&).";
        this.isLoading = false;
        return;
      }
      this.authService.signup(this.authData).subscribe({
        next: () => {
          this.isLoginMode = true; 
          this.isLoading = false;
          alert('Account created! Default Admin: admin@fithae.com / Admin@123');
        },
        error: (err) => {
          this.error = err.error.message || 'Signup failed.';
          this.isLoading = false;
        }
      });
    }
  }
}
