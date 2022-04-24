import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'






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
    '/models/bg.jpg',
    '/models/bg.jpg',
    '/models/bg.jpg',
    '/models/bg.jpg',
    '/models/bgplain.jpg',
    '/models/bgplain.jpg',
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 2.5
// gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

/**
 * Models
 */
 gltfLoader.load(
    '/models/human_heart/scene.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(.035, .035, .035)
        gltf.scene.position.set(-3.5, -11.5, 1)
        // gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)
        // Animation
        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[2])
        // action.play()
    }
)

// gltfLoader.load(
//     '/models/hamburger.glb',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(0.3, 0.3, 0.3)
//         gltf.scene.position.set(0, - 1, 0)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )

const raycaster = new THREE.Raycaster();

// const points = [
//     {
//         position: new THREE.Vector3(-0.55, -0.8, -0.6),
//         element: document.querySelector('.point-0')
//     },
//     {
//         position: new THREE.Vector3(-.55, 0.3, -0.6),
//         element: document.querySelector('.point-1')
//     },
//     {
//         position: new THREE.Vector3(0.5, 0.3, 1.09),
//         element: document.querySelector('.point-2')
//     },
//     {
//         position: new THREE.Vector3(-.95, 1.3, -0.6),
//         element: document.querySelector('.point-3')
//     },
//     {
//         position: new THREE.Vector3(-.55, 4.3, -0.6),
//         element: document.querySelector('.point-4')
//     }
// ]

const findings = [
    {
        position: new THREE.Vector3(-0.55, -0.8, -0.6),
        element: document.querySelector('.findings')
    },
    {
        position: new THREE.Vector3(-0.55, -0.8, -0.6),
        element: document.querySelector('.more')
    }
    // {
    //     position: new THREE.Vector3(-.55, 0.3, -0.6),
    //     element: document.querySelector('.point-1')
    // },
    // {
    //     position: new THREE.Vector3(0.5, 0.3, 1.09),
    //     element: document.querySelector('.point-2')
    // },
    // {
    //     position: new THREE.Vector3(-.95, 1.3, -0.6),
    //     element: document.querySelector('.point-3')
    // },
    // {
    //     position: new THREE.Vector3(-.55, 4.3, -0.6),
    //     element: document.querySelector('.point-4')
    // }
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

// gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
// gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
// gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
// gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')

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

// const renderPass = new RenderPass(scene, camera)
// effectComposer.addPass(renderPass)

// gui
//     .add(renderer, 'toneMapping', {
//         No: THREE.NoToneMapping,
//         Linear: THREE.LinearToneMapping,
//         Reinhard: THREE.ReinhardToneMapping,
//         Cineon: THREE.CineonToneMapping,
//         ACESFilmic: THREE.ACESFilmicToneMapping
//     })
//     .onFinishChange(() =>
//     {
//         renderer.toneMapping = Number(renderer.toneMapping)
//         updateAllMaterials()
//     })
// gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)


// const point1 = document.querySelector('.point-0');
// console.log(point1)
// point1.position.z = 5

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // for(const point of points)
    // {
    //     const screenPosition = point.position.clone()
    //     screenPosition.project(camera)

    //     raycaster.setFromCamera(screenPosition, camera)
    //     const intersects = raycaster.intersectObjects(scene.children, true)

    //     if(intersects.length === 0)
    //     {
    //         point.element.classList.add('visible')
    //     }
    //     else{
    //         const intersectionDistance = intersects[0].distance
    //         const pointDistance = point.position.distanceTo(camera.position)
    //         point.element.classList.remove('visible')
    //     }

    //     // console.log(screenPosition)
    //     const translateX = screenPosition.x * sizes.width * 0.5;
    //     const translateY = screenPosition.y * sizes.height * 0.5;

    //     point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
    // }
    // Render
    renderer.render(scene, camera)
    // effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()