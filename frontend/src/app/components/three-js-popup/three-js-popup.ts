import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-three-js-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './three-js-popup.html',
  styleUrl: './three-js-popup.css'
})
export class ThreeJsPopupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private starMesh!: THREE.Mesh;
  private animationId: number = 0;

  ngAfterViewInit() {
    this.initThreeJs();
  }

  ngOnDestroy() {
    this.stopAnimation();
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  closePopup() {
    this.show = false;
    this.close.emit();
  }

  private playSound() {
    const audio = new Audio('https://www.soundjay.com/misc/sounds/water-droplet-1.mp3');
    audio.play().catch(e => console.log("Audio play blocked", e));
  }

  private initThreeJs() {
    const container = this.canvasContainer.nativeElement;
    this.playSound();
    
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(400, 300);
    container.appendChild(this.renderer.domElement);

    // Create a "Thumbs Up" using basic shapes
    const group = new THREE.Group();

    // Palm
    const palmGeo = new THREE.BoxGeometry(2, 2.5, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const palm = new THREE.Mesh(palmGeo, material);
    group.add(palm);

    // Thumb
    const thumbGeo = new THREE.BoxGeometry(0.8, 1.5, 0.8);
    const thumb = new THREE.Mesh(thumbGeo, material);
    thumb.position.set(-1.2, 1, 0);
    thumb.rotation.z = Math.PI / 4;
    group.add(thumb);

    this.starMesh = group as any; // Reusing the property name for simplicity
    this.scene.add(group);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);

    this.animate();
  }

  private animate = () => {
    if (!this.show) {
      this.animationId = requestAnimationFrame(this.animate);
      return;
    }
    this.starMesh.rotation.y += 0.05;
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate);
  }

  private stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
