import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


class BasicWorldDemo {
    constructor() {
        this._Initialize()
    }
    
    _Initialize() {
        this._threejs = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 45;
        const far = 30000;
        this._camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
        this._camera.position.set(1200, -250, 2000);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(30, 100, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this._scene.add(light);

        light = new THREE.AmbientLight(0x101010);
        this._scene.add(light);

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement
        );
        controls.target.set(0, 20, 0);
        controls.enabled = true;
        controls.minDistance = 20;
        controls.maxDistance = 1500;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
        controls.update();

        const loader = new THREE.CubeTextureLoader();
        const highResTextures = [
            './resources/textures/sky_box/high-resolution/posx.jpg',
            './resources/textures/sky_box/high-resolution/negx.jpg',
            './resources/textures/sky_box/high-resolution/posy.jpg',
            './resources/textures/sky_box/high-resolution/negy.jpg',
            './resources/textures/sky_box/high-resolution/posz.jpg',
            './resources/textures/sky_box/high-resolution/negz.jpg'
        ];
        // const lowResTextures = [
        //     './resources/textures/sky_box/low-resolution/right.png',
        //     './resources/textures/sky_box/low-resolution/left.png',
        //     './resources/textures/sky_box/low-resolution/top.png',
        //     './resources/textures/sky_box/low-resolution/bottom.png',
        //     './resources/textures/sky_box/low-resolution/front.png',
        //     './resources/textures/sky_box/low-resolution/back.png'
        // ];
        const texture = loader.load(highResTextures);
        this._scene.background = texture;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
              }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);
    
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshStandardMaterial({
              color: 0xFFFFFF,
          }));
        box.position.set(0, 1, 0);
        box.castShadow = true;
        box.receiveShadow = true;
        this._scene.add(box);

        for (let x = -8; x < 8; x++) {
            for (let y = -8; y < 8; y++) {
              const box = new THREE.Mesh(
                new THREE.BoxGeometry(2, 2, 2),
                new THREE.MeshStandardMaterial({
                    color: 0x808080,
                }));
              box.position.set(Math.random() + x * 5, Math.random() * 4.0 + 2.0, Math.random() + y * 5);
              box.castShadow = true;
              box.receiveShadow = true;
              this._scene.add(box);
            }
          }

        this._RAF();
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame(() => {
            this._threejs.render(this._scene, this._camera);
            this._RAF();
        });
    }
    
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BasicWorldDemo();
});