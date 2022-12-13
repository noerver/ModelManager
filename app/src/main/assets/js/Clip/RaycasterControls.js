import { creatPointer } from "./Util.js";

export default class RaycasterControls {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.prevObject = null;
  }

  resetObject() {
    this.prevObject.material = this.prevObject.userData.material;
    delete this.prevObject.userData.material;
  }

  highLightObject(mesh) {
    if (mesh && mesh.isMesh) {
      meshIntersect.userData.material = mesh.userData.material || mesh.material;
      var materials = [];
      for (var i = 0; i < mesh.material.length; i++) {
        var material = mesh.userData.material[i].clone();
        material.color.set(0xff0000);
        materials.push(material);
      }
      mesh.material = materials;
      this.prevObject = mesh;
    }
  }

  addEventListener() {
    window.addEventListener("click", this.onMouseClick, false);
  }
  removeEventListener() {
    window.removeEventListener("click", this.onMouseClick, false);
  }
  onMouseClick(event) {
    const pointer = creatPointer(event);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      if (this.prevObject) {
        this.prevObject.material = this.prevObject.userData.material;
        delete this.prevObject.userData.material;
      }
      const meshIntersect = intersectionObject.object;
      highLightObject(meshIntersect);
    } else {
      if (this.prevObject) {
        resetObject();
      }
      this.prevObject = null;
    }
  }
}
