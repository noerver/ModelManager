import * as THREE from "../three.module.js"

export default class ClipBoxNormals {
    constructor() {
        this.normals = {
            x1: new THREE.Vector3(-1, 0, 0),
            x2: new THREE.Vector3(1, 0, 0),
            y1: new THREE.Vector3(0, -1, 0),
            y2: new THREE.Vector3(0, 1, 0),
            z1: new THREE.Vector3(0, 0, -1),
            z2: new THREE.Vector3(0, 0, 1),
        }
    }

    createPlanes(x, y, z, zoom = 1) {
        return Object.entries(this.normals).map(([key, value]) => {
            const v = key.startsWith("x") ? x : (key.startsWith("y") ? y : (key.startsWith("z") ? z : 0));
            const vZoom = v*zoom;
            return new THREE.Plane(value, vZoom);
        })
    }
}

