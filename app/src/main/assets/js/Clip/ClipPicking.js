import ClipBoxNormals from "./ClipBoxNormals.js";
import { setAxis, creatPointer } from "./Util.js";
import { CAPSMATERIAL, CAPSUNIFORMS } from "./ClipConfig.js";

export default class ClipPicking {
  constructor(simulation) {
    this.intersected = null;
    var _this = this;
    this.pSimulation = simulation;
    const domElement = simulation.renderer.domElement;
    this.axis ="";
    this.intersectionObject =null;

    this.plane = null;

    this.mark = function () {
      if (this.intersected) {
        this.pSimulation.renderer.domElement.style.cursor = "pointer";
      }
    };

    this.pSimulation.renderer.domElement.addEventListener(
      "mousemove",
      this.targeting.bind(this),
      true
    );

    this.pSimulation.renderer.domElement.addEventListener(
      "onClick",
      this.mark.bind(this),
      true
    );
  }

  targeting(event) {
    let pointer = creatPointer(event);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(pointer, this.pSimulation.camera);
    const intersects = ray.intersectObjects(
      this.pSimulation.clipSelection.selectables
    );

    if (intersects.length > 0) {
      const intersectionObject = intersects[0];
      const candidate = intersectionObject.object;

      if (this.intersected !== candidate) {
        if (this.intersected) {
          this.intersected.guardian.rayOut();
        }

        candidate.guardian.rayOver();

        this.intersected = candidate;

        this.pSimulation.renderer.domElement.style.cursor = "pointer";
        //simulation.throttledRender();
      }
    } else if (this.intersected) {
      // this.intersected.guardian.rayOut();
      // this.intersected = null;
      // simulation.renderer.domElement.style.cursor = "auto";
      // simulation.throttledRender();
    }
  }

  setEventListener(bFlag) {
    this.pSimulation.bPick = bFlag;
    return;
  }
  switchCoordinate(event) {
    var left = this.getOffsetLeft(this.domElement);
    var top = this.getOffsetTop(this.domElement);
    this.mouse.x =
      ((event.clientX - left) / this.domElement.offsetWidth) * 2 - 1;
    this.mouse.y =
      -((event.clientY - top) / this.domElement.offsetHeight) * 2 + 1;
  }
  getOffsetLeft(obj) {
    var l = obj.offsetLeft;
    while ((obj = obj.offsetParent)) {
      l += obj.offsetLeft;
    }
    return l;
  }
  getOffsetTop(obj) {
    var t = obj.offsetTop;
    while ((obj = obj.offsetParent)) {
      t += obj.offsetTop;
    }
    return t;
  }
}
