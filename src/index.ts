import * as THREE from 'three'
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { addVideo, preloadVideo } from './video-test'

let scene
let camera
let renderer
let controls

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

let video1
let video2
let videoMuted1
let videoMuted2

let hasAddedVideo = false

const init = () => {
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x505050)

	camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 100)

	renderer = new THREE.WebGLRenderer({
		antialias: true,
	})
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(WIDTH, HEIGHT)
	renderer.xr.enabled = true
	renderer.localClippingEnabled = true
	document.body.appendChild(VRButton.createButton(renderer))
	document.body.appendChild(renderer.domElement)

	controls = new OrbitControls(camera, renderer.domElement)
	camera.position.set(0, 1.6, 0)
	controls.target = new THREE.Vector3(0, 1, -1.8)
	controls.update()

	const room = new THREE.LineSegments(
		new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
		new THREE.LineBasicMaterial({ color: 0x808080 })
	)

	scene.add(room)

	const axis = new THREE.AxesHelper()
	scene.add(axis)

	video1 = preloadVideo()
	video2 = preloadVideo()
	videoMuted1 = preloadVideo(true)
	videoMuted2 = preloadVideo(true)

	renderer.setAnimationLoop(loop)
}

const loop = () => {
	controls.update()
	renderer.render(scene, camera)

	if (renderer.xr.isPresenting && !hasAddedVideo) {
		hasAddedVideo = true

		// unmuted video, autoplay
		addVideo(scene, video1, false, -1)

		// unmuted video, manually calls play
		addVideo(scene, video2, true, 1)
		setTimeout(() => {
			// muted video, autoplay
			addVideo(scene, videoMuted1, false, -1, 1)

			// muted video, manually calls play
			// this is the only video that plays in headset:
			// if we both preload the video *as muted*, and 
			// explicitly call video.play() after entering WebXR.
			addVideo(scene, videoMuted2, true, 1, 1)
		}, 1000)
	}
}

const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('load', init)
window.addEventListener('resize', onWindowResize)
