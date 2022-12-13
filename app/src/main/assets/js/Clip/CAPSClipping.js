import { CAPSMATERIAL, CAPSUNIFORMS } from "./ClipConfig.js";
import CAPSClipBoxFace from "./CAPSClipBoxFace.js";
import CAPSClipBoxLine from "./CAPSClipBoxLine.js";

export default class CAPSClipping {
  constructor(low, high, limitvalue, limitstep) {
    this.limitLow = low;
    this.limitHigh = high;
    this.limitValue = limitvalue;
    this.limitStep = limitstep;
    this.touchMeshes = new THREE.Object3D();
    this.displayMeshes = new THREE.Object3D();
    this.box = new THREE.BoxGeometry(1, 1, 1);
    this.boxMesh = new THREE.Mesh(this.box, CAPSMATERIAL.cap);

    this.vertices = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ];
    this.updateVertices();

    var v = this.vertices;

    this.meshGeometries = [];
    this.lineGeometries = [];
    this.selectables = [];

    this.faces = [];
    var f = this.faces;
    this.faces.push(new CAPSClipBoxFace("y1", v[0], v[1], v[5], v[4], this));
    this.faces.push(new CAPSClipBoxFace("z1", v[0], v[2], v[3], v[1], this));
    this.faces.push(new CAPSClipBoxFace("x1", v[0], v[4], v[6], v[2], this));
    this.faces.push(new CAPSClipBoxFace("x2", v[7], v[5], v[1], v[3], this));
    this.faces.push(new CAPSClipBoxFace("y2", v[7], v[3], v[2], v[6], this));
    this.faces.push(new CAPSClipBoxFace("z2", v[7], v[6], v[4], v[5], this));

    var l0 = new CAPSClipBoxLine(v[0], v[1], f[0], f[1], this);
    var l1 = new CAPSClipBoxLine(v[0], v[2], f[1], f[2], this);
    var l2 = new CAPSClipBoxLine(v[0], v[4], f[0], f[2], this);
    var l3 = new CAPSClipBoxLine(v[1], v[3], f[1], f[3], this);
    var l4 = new CAPSClipBoxLine(v[1], v[5], f[0], f[3], this);
    var l5 = new CAPSClipBoxLine(v[2], v[3], f[1], f[4], this);
    var l6 = new CAPSClipBoxLine(v[2], v[6], f[2], f[4], this);
    var l7 = new CAPSClipBoxLine(v[3], v[7], f[3], f[4], this);
    var l8 = new CAPSClipBoxLine(v[4], v[5], f[0], f[5], this);
    var l9 = new CAPSClipBoxLine(v[4], v[6], f[2], f[5], this);
    var l10 = new CAPSClipBoxLine(v[5], v[7], f[3], f[5], this);
    var l11 = new CAPSClipBoxLine(v[6], v[7], f[4], f[5], this);

    this.setBox();
    this.setUniforms();
  }

  updateVertices() {
    this.vertices[0].set(this.limitLow.x, this.limitLow.y, this.limitLow.z);
    this.vertices[1].set(this.limitHigh.x, this.limitLow.y, this.limitLow.z);
    this.vertices[2].set(this.limitLow.x, this.limitHigh.y, this.limitLow.z);
    this.vertices[3].set(this.limitHigh.x, this.limitHigh.y, this.limitLow.z);
    this.vertices[4].set(this.limitLow.x, this.limitLow.y, this.limitHigh.z);
    this.vertices[5].set(this.limitHigh.x, this.limitLow.y, this.limitHigh.z);
    this.vertices[6].set(this.limitLow.x, this.limitHigh.y, this.limitHigh.z);
    this.vertices[7].set(this.limitHigh.x, this.limitHigh.y, this.limitHigh.z);
  }

  updateGeometries() {
    for (var i = 0; i < this.meshGeometries.length; i++) {
      this.meshGeometries[i].verticesNeedUpdate = true;
      this.meshGeometries[i].computeBoundingSphere();
      this.meshGeometries[i].computeBoundingBox();
    }
    for (var i = 0; i < this.lineGeometries.length; i++) {
      this.lineGeometries[i].verticesNeedUpdate = true;
    }
  }
  setBox() {
    var width = new THREE.Vector3();
    width.subVectors(this.limitHigh, this.limitLow);

    this.boxMesh.scale.copy(width);
    width.multiplyScalar(0.5).add(this.limitLow);
    this.boxMesh.position.copy(width);
  }

  setUniforms() {
    var uniforms = CAPSUNIFORMS.clipping;
    uniforms.clippingLow.value.copy(this.limitLow);
    uniforms.clippingHigh.value.copy(this.limitHigh);
  }

  setValue(axis, value) {
    var buffer = this.limitStep;
    var limit = this.limitValue;

    if (axis === "x1") {
      this.limitLow.x = Math.max(
        -limit,
        Math.min(this.limitHigh.x - buffer, value)
      );
    } else if (axis === "x2") {
      this.limitHigh.x = Math.max(
        this.limitLow.x + buffer,
        Math.min(limit, value)
      );
    } else if (axis === "y1") {
      this.limitLow.y = Math.max(
        -limit,
        Math.min(this.limitHigh.y - buffer, value)
      );
    } else if (axis === "y2") {
      this.limitHigh.y = Math.max(
        this.limitLow.y + buffer,
        Math.min(limit, value)
      );
    } else if (axis === "z1") {
      this.limitLow.z = Math.max(
        -limit,
        Math.min(this.limitHigh.z - buffer, value)
      );
    } else if (axis === "z2") {
      this.limitHigh.z = Math.max(
        this.limitLow.z + buffer,
        Math.min(limit, value)
      );
    }

    this.setBox();
    this.setUniforms();

    this.updateVertices();
    this.updateGeometries();
  }

  setVisuable(bFlag) {
    this.displayMeshes.visible = bFlag;
    this.touchMeshes.visible = bFlag;
    this.boxMesh.visible = bFlag;
  }
}
