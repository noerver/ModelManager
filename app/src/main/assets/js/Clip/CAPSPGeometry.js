import * as THREE from "../three.module.js"
export default class CAPSPGeometry extends THREE.Geometry {
    constructor(v0, v1, v2, v3) {
        super();
        //THREE.Geometry.call(this);
        this.vertices.push(v0, v1, v2, v3);
        this.faces.push(new THREE.Face3(0, 1, 2));
        this.faces.push(new THREE.Face3(0, 2, 3));
        this.computeFaceNormals();
        this.computeVertexNormals();
    }
}