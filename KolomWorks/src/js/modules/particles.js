export function initParticles() {
	particlesJS("particles-js", {
		"particles": {
			"number": {
				"value": 12,
				"density": {
					"enable": true,
					"value_area": 800
				}
			},
			"color": {
				"value": "#2faa83"
			},
			"shape": {
				"type": "circle",
				"stroke": {
					"width": 3,
					"color": "#2faa83"
				},
				"polygon": {
					"nb_sides": 3
				},
				"image": {
					"src": "",
					"width": 0,
					"height": 0
				}
			},
			"opacity": {
				"value": 0.8,
				"random": false,
				"anim": {
					"enable": false,
					"speed": 0,
					"opacity_min": 0,
					"sync": false
				}
			},
			"size": {
				"value": 3,
				"random": true,
				"anim": {
					"enable": false,
					"speed": 0,
					"size_min": 0,
					"sync": false
				}
			},
			"line_linked": {
				"enable": true,
				"distance": 170,
				"color": "#2faa83",
				"opacity": 1,
				"width": 3
			},
			"move": {
				"enable": true,
				"speed": 1,
				"direction": "none",
				"random": false,
				"straight": false,
				"out_mode": "out",
				"bounce": false,
				"attract": {
					"enable": false,
					"rotateX": 0,
					"rotateY": 0
				}
			}
		},
		"interactivity": {
			"detect_on": "canvas",
			"events": {
				"onhover": {
					"enable": false,
					"mode": "grab"
				},
				"onclick": {
					"enable": false,
					"mode": "push"
				},
				"resize": true
			},
			"modes": {
				"grab": {
					"distance": 120,
					"line_linked": {
						"opacity": 1
					}
				},
				"bubble": {
					"distance": 400,
					"size": 40,
					"duration": 2,
					"opacity": 8,
					"speed": 3
				},
				"repulse": {
					"distance": 200,
					"duration": 0.4
				},
				"push": {
					"particles_nb": 4
				},
				"remove": {
					"particles_nb": 2
				}
			}
		},
		"retina_detect": true
	});
}

