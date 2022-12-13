import * as THREE from "../three.module.js"
import CAPSPGeometry from "./CAPSPGeometry.js"

export default class CAPSClipBoxFace {
    constructor(axis, v0, v1, v2, v3, selection) {
        const frontFaceGeometry = new CAPSPGeometry(v0, v1, v2, v3);
        frontFaceGeometry.dynamic = true;
        selection.meshGeometries.push(frontFaceGeometry);

        const frontFaceMesh = new THREE.Mesh(
            frontFaceGeometry,
            CAPSMATERIAL.Invisible
        );
        frontFaceMesh.axis = axis;
        frontFaceMesh.guardian = this;

        selection.touchMeshes.add(frontFaceMesh);
        selection.selectables.push(frontFaceMesh);

        const backFaceGeometry = new CAPSPGeometry(v3, v2, v1, v0);
        backFaceGeometry.dynamic = true;
        selection.meshGeometries.push(backFaceGeometry);

        const backFaceMesh = new THREE.Mesh(
            backFaceGeometry,
            CAPSMATERIAL.BoxBackFace
        );
        selection.displayMeshes.add(backFaceMesh);

        this.lines = new Array();
    }

    rayOver() {
        this.highlightLines(true);
    }

    rayOut() {
        this.highlightLines(false);
    }

    highlightLines(b) {
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].setHighlight(b);
        }
    }
}