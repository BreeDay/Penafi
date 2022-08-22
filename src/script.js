import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import gsap from 'gsap'





/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/models/bgf.jpeg',
    '/models/bgf.jpeg',
    '/models/bgf.jpeg',
    '/models/bgf.jpeg',
    '/models/bgf.jpeg',
    '/models/bgf.jpeg',
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 2.5

/**
 * Models
 */
 gltfLoader.load(
    '/models/human_heart/scene.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(.35, .35, .35)
        gltf.scene.position.set(-3.5, -11.5, 1)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene.children[0])
        console.log(gltf);
    }
)

const raycaster = new THREE.Raycaster();


const findings = [
    {
        position: new THREE.Vector3(-0.55, -0.8, -0.6),
        element: document.querySelector('.findings')
    },
    {
        position: new THREE.Vector3(-0.55, -0.8, -0.6),
        element: document.querySelector('.more')
    }
   
]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(7.7, 0, 0)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.NoToneMapping
renderer.toneMappingExposure = 1
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)


/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    
    // Render
    renderer.render(scene, camera)
    // effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

  
tick()

document.querySelector('#first').addEventListener('click', (e)=>{
    e.preventDefault()
    // console.log('clicked!')
    gsap.to('#first', {
      opacity:0
    })
    gsap.to(camera.position, {
      z:8,
      ease: 'power3.inOut',
      duration: 1.5
    })
    gsap.to(camera.rotation, {
      x:.57,
      ease: 'power3.inOut',
      duration: 1.5
    })
    gsap.to('#ssecond', {
        opacity:1,
        duration: 1.5
      })
      gsap.to('#ssecond', {
        opacity:0,
        duration: 1.5,
        delay: 3
      })
      gsap.to('#second', {
        opacity:1,
        duration: 1.5,
        delay:5
      })
  })
  document.querySelector('#care').addEventListener('click', (e)=>{
    e.preventDefault()
    gsap.to('#second', {
      opacity:0
    })
    gsap.to(camera.position, {
      z:10,
      x:3,
      y:2,
      ease: 'power3.inOut',
      duration: 1.5
    })
    gsap.to(camera.rotation, {
      x:2.57,
      ease: 'power3.inOut',
      duration: 1.5
    })
    gsap.to('#third', {
        opacity:1,
        duration: 1.5
      })
      gsap.to('#third', {
        opacity:0,
        duration: 1.5,
        delay: 3
      })
      gsap.to('#fourth', {
        opacity:1,
        duration: 1.5,
        delay:5
      })
      gsap.to(camera.position, {
        z:4,
        ease: 'power3.inOut',
        duration: 1.5,
        delay:5
      })
  })

  document.querySelector('#add').addEventListener('click', (e)=>{
    e.preventDefault()
    gsap.to('#fourth', {
      opacity:0
    })
    
    gsap.to(camera.position, {
      y:3,
      ease: 'power3.in',
      duration: 1.5,
      delay: 1.5,
      onComplete: () =>{
        window.location = 'https://checkout.square.site/preview#order=eyJpZCI6IkpLNWxCeUVrOW1oc1VmUGt0ZDVvdkVIZ1RJRlpZIiwibG9jYXRpb25faWQiOiJMQlNEQjk2UVpQRDBNIiwiY3JlYXRvcl9hcHBfaWQiOiJzYW5kYm94LXNxMGlkYi0yUVZQR0FZTUJlRGRRX0xVcGtNVHp3Iiwic291cmNlIjp7Im5hbWUiOiJTYW5kYm94IGZvciBzcTBpZHAtNUVnZk81ekZlajFTWEVDUW1lQXBCUSIsImFwcGxpY2F0aW9uX25hbWUiOiJTYW5kYm94IGZvciBzcTBpZHAtNUVnZk81ekZlajFTWEVDUW1lQXBCUSIsImFwcGxpY2F0aW9uX2lkIjoic2FuZGJveC1zcTBpZGItMlFWUEdBWU1CZURkUV9MVXBrTVR6dyIsImNsaWVudF9vdSI6Im9ubGluZS1jaGVja291dCJ9LCJuYW1lIjoic2hvZSBjbGVhbmVyIiwibWVyY2hhbnRfaWQiOiJNTEQ0MU1WWVZHRVNFIiwibGluZV9pdGVtcyI6W3sidWlkIjoiTlJRSnNYUmxLZHAzeE44YWd6UFlMRCIsIm5hbWUiOiJzaG9lIGNsZWFuZXIiLCJxdWFudGl0eSI6IjEiLCJpdGVtX3R5cGUiOiJJVEVNIiwiYmFzZV9wcmljZV9tb25leSI6eyJhbW91bnQiOjEwMzQyLCJjdXJyZW5jeSI6IlVTRCJ9LCJ2YXJpYXRpb25fdG90YWxfcHJpY2VfbW9uZXkiOnsiYW1vdW50IjoxMDM0MiwiY3VycmVuY3kiOiJVU0QifSwiZ3Jvc3Nfc2FsZXNfbW9uZXkiOnsiYW1vdW50IjoxMDM0MiwiY3VycmVuY3kiOiJVU0QifSwidG90YWxfdGF4X21vbmV5Ijp7ImFtb3VudCI6MCwiY3VycmVuY3kiOiJVU0QifSwidG90YWxfZGlzY291bnRfbW9uZXkiOnsiYW1vdW50IjowLCJjdXJyZW5jeSI6IlVTRCJ9LCJ0b3RhbF9tb25leSI6eyJhbW91bnQiOjEwMzQyLCJjdXJyZW5jeSI6IlVTRCJ9fV0sImZ1bGZpbGxtZW50cyI6W3sidWlkIjoiWWN4YjBpTjJOcjFkR0tLejFwMWJtIiwidHlwZSI6IkRJR0lUQUwiLCJzdGF0ZSI6IlBST1BPU0VEIiwiZGlnaXRhbF9kZXRhaWxzIjp7InJlY2lwaWVudCI6eyJkaXNwbGF5X25hbWUiOiIiLCJlbWFpbF9hZGRyZXNzIjoiIn19LCJjcmVhdGVkX2F0IjoiMjAyMi0wOC0yMlQxMTo0MTo1NC43ODFaIn1dLCJuZXRfYW1vdW50cyI6eyJ0b3RhbF9tb25leSI6eyJhbW91bnQiOjEwMzQyLCJjdXJyZW5jeSI6IlVTRCJ9LCJ0YXhfbW9uZXkiOnsiYW1vdW50IjowLCJjdXJyZW5jeSI6IlVTRCJ9LCJkaXNjb3VudF9tb25leSI6eyJhbW91bnQiOjAsImN1cnJlbmN5IjoiVVNEIn0sInRpcF9tb25leSI6eyJhbW91bnQiOjAsImN1cnJlbmN5IjoiVVNEIn0sInNlcnZpY2VfY2hhcmdlX21vbmV5Ijp7ImFtb3VudCI6MCwiY3VycmVuY3kiOiJVU0QifX0sImNyZWF0ZWRfYXQiOiIyMDIyLTA4LTIyVDExOjQxOjU0Ljc4MloiLCJ1cGRhdGVkX2F0IjoiMjAyMi0wOC0yMlQxMTo0MTo1NC43ODJaIiwic3RhdGUiOiJEUkFGVCIsInZlcnNpb24iOjEsInRvdGFsX21vbmV5Ijp7ImFtb3VudCI6MTAzNDIsImN1cnJlbmN5IjoiVVNEIn0sInRvdGFsX3RheF9tb25leSI6eyJhbW91bnQiOjAsImN1cnJlbmN5IjoiVVNEIn0sInRvdGFsX2Rpc2NvdW50X21vbmV5Ijp7ImFtb3VudCI6MCwiY3VycmVuY3kiOiJVU0QifSwidG90YWxfdGlwX21vbmV5Ijp7ImFtb3VudCI6MCwiY3VycmVuY3kiOiJVU0QifSwidG90YWxfc2VydmljZV9jaGFyZ2VfbW9uZXkiOnsiYW1vdW50IjowLCJjdXJyZW5jeSI6IlVTRCJ9LCJuZXRfYW1vdW50X2R1ZV9tb25leSI6eyJhbW91bnQiOjEwMzQyLCJjdXJyZW5jeSI6IlVTRCJ9LCJwcm9jZXNzaW5nX21vZGVzIjp7ImNyZWF0aW9uX3Byb2Nlc3NpbmdfbW9kZSI6Ik9OTElORSJ9fQ=='
      }
    })
  })

  document.querySelector('#no').addEventListener('click', (e)=>{
    e.preventDefault()
    gsap.to('#fourth', {
      opacity:0
    })
    
    gsap.to(camera.position, {
      y:3,
      ease: 'power3.in',
      duration: 1.5,
      delay: 1.5,
      onComplete: () =>{
        window.location = 'https://checkout.square.site/preview#order=eyJpZCI6Ikg3b2V3b0tmbDhzcm1hY0tOcW5YVTFSM0hJSFpZIiwibG9jYXRpb25faWQiOiJMQlNEQjk2UVpQRDBNIiwiY3JlYXRvcl9hcHBfaWQiOiJzYW5kYm94LXNxMGlkYi0yUVZQR0FZTUJlRGRRX0xVcGtNVHp3Iiwic291cmNlIjp7Im5hbWUiOiJTYW5kYm94IGZvciBzcTBpZHAtNUVnZk81ekZlajFTWEVDUW1lQXBCUSIsImFwcGxpY2F0aW9uX25hbWUiOiJTYW5kYm94IGZvciBzcTBpZHAtNUVnZk81ekZlajFTWEVDUW1lQXBCUSIsImFwcGxpY2F0aW9uX2lkIjoic2FuZGJveC1zcTBpZGItMlFWUEdBWU1CZURkUV9MVXBrTVR6dyIsImNsaWVudF9vdSI6Im9ubGluZS1jaGVja291dCJ9LCJuYW1lIjoic2hvZSBjbGVhbmVyIiwibWVyY2hhbnRfaWQiOiJNTEQ0MU1WWVZHRVNFIiwibGluZV9pdGVtcyI6W3sidWlkIjoiV25pM29LWW90c0wzUjJWOWpWRUxLQyIsIm5hbWUiOiJzaG9lIGNsZWFuZXIiLCJxdWFudGl0eSI6IjEiLCJpdGVtX3R5cGUiOiJJVEVNIiwiYmFzZV9wcmljZV9tb25leSI6eyJhbW91bnQiOjg3MjIsImN1cnJlbmN5IjoiVVNEIn0sInZhcmlhdGlvbl90b3RhbF9wcmljZV9tb25leSI6eyJhbW91bnQiOjg3MjIsImN1cnJlbmN5IjoiVVNEIn0sImdyb3NzX3NhbGVzX21vbmV5Ijp7ImFtb3VudCI6ODcyMiwiY3VycmVuY3kiOiJVU0QifSwidG90YWxfdGF4X21vbmV5Ijp7ImFtb3VudCI6MCwiY3VycmVuY3kiOiJVU0QifSwidG90YWxfZGlzY291bnRfbW9uZXkiOnsiYW1vdW50IjowLCJjdXJyZW5jeSI6IlVTRCJ9LCJ0b3RhbF9tb25leSI6eyJhbW91bnQiOjg3MjIsImN1cnJlbmN5IjoiVVNEIn19XSwiZnVsZmlsbG1lbnRzIjpbeyJ1aWQiOiJsTm9ZVmVKZFE2bDNXbUg5NjBQVGdEIiwidHlwZSI6IkRJR0lUQUwiLCJzdGF0ZSI6IlBST1BPU0VEIiwiZGlnaXRhbF9kZXRhaWxzIjp7InJlY2lwaWVudCI6eyJkaXNwbGF5X25hbWUiOiIiLCJlbWFpbF9hZGRyZXNzIjoiIn19LCJjcmVhdGVkX2F0IjoiMjAyMi0wOC0yMlQxMTo0Njo0NC44MDNaIn1dLCJuZXRfYW1vdW50cyI6eyJ0b3RhbF9tb25leSI6eyJhbW91bnQiOjg3MjIsImN1cnJlbmN5IjoiVVNEIn0sInRheF9tb25leSI6eyJhbW91bnQiOjAsImN1cnJlbmN5IjoiVVNEIn0sImRpc2NvdW50X21vbmV5Ijp7ImFtb3VudCI6MCwiY3VycmVuY3kiOiJVU0QifSwidGlwX21vbmV5Ijp7ImFtb3VudCI6MCwiY3VycmVuY3kiOiJVU0QifSwic2VydmljZV9jaGFyZ2VfbW9uZXkiOnsiYW1vdW50IjowLCJjdXJyZW5jeSI6IlVTRCJ9fSwiY3JlYXRlZF9hdCI6IjIwMjItMDgtMjJUMTE6NDY6NDQuODAzWiIsInVwZGF0ZWRfYXQiOiIyMDIyLTA4LTIyVDExOjQ2OjQ0LjgwM1oiLCJzdGF0ZSI6IkRSQUZUIiwidmVyc2lvbiI6MSwidG90YWxfbW9uZXkiOnsiYW1vdW50Ijo4NzIyLCJjdXJyZW5jeSI6IlVTRCJ9LCJ0b3RhbF90YXhfbW9uZXkiOnsiYW1vdW50IjowLCJjdXJyZW5jeSI6IlVTRCJ9LCJ0b3RhbF9kaXNjb3VudF9tb25leSI6eyJhbW91bnQiOjAsImN1cnJlbmN5IjoiVVNEIn0sInRvdGFsX3RpcF9tb25leSI6eyJhbW91bnQiOjAsImN1cnJlbmN5IjoiVVNEIn0sInRvdGFsX3NlcnZpY2VfY2hhcmdlX21vbmV5Ijp7ImFtb3VudCI6MCwiY3VycmVuY3kiOiJVU0QifSwibmV0X2Ftb3VudF9kdWVfbW9uZXkiOnsiYW1vdW50Ijo4NzIyLCJjdXJyZW5jeSI6IlVTRCJ9LCJwcm9jZXNzaW5nX21vZGVzIjp7ImNyZWF0aW9uX3Byb2Nlc3NpbmdfbW9kZSI6Ik9OTElORSJ9fQ=='
      }
    })
  })