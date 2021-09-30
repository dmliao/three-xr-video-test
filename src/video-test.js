import * as THREE from 'three'

export const preloadVideo = (withMute = false) => {
	const video = document.createElement('video')
	video.src = '/assets/video.mp4'
	if (withMute) {
		video.muted = true;
		video.playsInline = true;
	}
	video.loop = true
	video.autoplay = true
	video.hidden = true
	document.body.appendChild(video)

	return video
}

export const addVideo = (scene, video, shouldPlay = true, offsetX = 0, offsetY = 2) => {
	const texture = new THREE.VideoTexture(video)
	if (shouldPlay) {
		video.play();
	}
	const shape = new THREE.Shape()
		.moveTo(0, 0)
		.lineTo(0, 1)
		.lineTo(1, 1)
		.lineTo(1, 0)
		.lineTo(0, 0)

	const geometry = new THREE.ShapeGeometry(shape)
	const mesh = new THREE.Mesh(
		geometry,
		new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })
	)

	mesh.position.x = offsetX - 0.5;
	mesh.position.y = offsetY;
	mesh.position.z = -2;
	scene.add(mesh);
}
