import * as THREE from 'three'

export class PreloadScene {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera

  constructor() {
    this.scene = new THREE.Scene()
    
    // Safely get window dimensions with fallbacks for server-side rendering or undefined context
    const width = typeof window !== 'undefined' ? window.innerWidth : 800
    const height = typeof window !== 'undefined' ? window.innerHeight : 600
    
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  }
}
