import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from
 '@angular/core';
import { FormsModule } from '@angular/forms';
 import * as THREE from "three";


 @Component({
  selector: 'app-cube',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
  })
  export class CubeComponent implements AfterViewInit {
    @ViewChild('myCanvas') private canvasRef!: ElementRef;

    //* Cube Properties
    @Input() public rotationSpeedX: number = 0.05;
    @Input() public rotationSpeedY: number = 0.01;
    @Input() public size: number = 200;
    @Input() public texturePath: string = 'logo.png';
    //* Stage Properties
    @Input() public cameraZ: number = 10;
    @Input() public fieldOfView: number = 30;
    @Input('nearClipping') public nearClippingPane: number = 1;
    @Input('farClipping') public farClippingPane: number = 1000;
    private loader = new THREE.TextureLoader();
    private geometry = new THREE.BoxGeometry(1, 1, 1);
    private texture = this.loader.load(this.texturePath);
    private material = new THREE.MeshBasicMaterial({map: this.texture});
    private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
    private renderer!: THREE.WebGLRenderer;
    private scene: THREE.Scene = new THREE.Scene();
    private camera!: THREE.PerspectiveCamera;
    private ambientLight!: THREE.AmbientLight;
    private directionalLight!: THREE.DirectionalLight;
    private get canvas(): HTMLCanvasElement {
      return this.canvasRef.nativeElement;
    }

    private getAspectRatio(): number {
      return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private createScene(): void {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);
      this.scene.add(this.cube);

      let aspectRatio = this.getAspectRatio();
      this.camera = new THREE.PerspectiveCamera(this.fieldOfView, aspectRatio, this.nearClippingPane, this.farClippingPane);
      this.camera.position.z = this.cameraZ;

      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
      this.renderer.setPixelRatio(devicePixelRatio);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    private animateCube() {
      this.cube.rotation.x += this.rotationSpeedX;
      this.cube.rotation.y += this.rotationSpeedY;
    }

    private render() {
      requestAnimationFrame(() => this.render());
      this.animateCube();
      this.renderer.render(this.scene, this.camera);
    }

    ngAfterViewInit(): void {
      this.createScene();
      this.render();
    }
  }
