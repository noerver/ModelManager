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

    this.pSimulation.renderer.domElement.addEventListener(
      "mousedown",
      this.beginDrag.bind(this),
      false
    );
    this.pSimulation.renderer.domElement.addEventListener(
      "touchstart",
      this.beginDrag.bind(this),
      false
    );
  }

  beginDrag(event) {
    let pointer = creatPointer(event);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(pointer, this.pSimulation.camera);
    const intersects = ray.intersectObjects(
      this.pSimulation.clipSelection.selectables
    );

    if (intersects.length > 0) {
      event.preventDefault();
      this.pSimulation.controls.enabled = false;
      if (!(this.plane && this.plane.geometry)) {
        const vlimitValue = this.pSimulation.clipSelection.limitValue;
        this.plane = new THREE.Mesh(
          new THREE.PlaneGeometry(vlimitValue, vlimitValue, 4, 4),
          CAPSMATERIAL.Invisible
        );
        this.pSimulation.scene.add(this.plane);
      }

      const intersectionObject = intersects[0];
      const intersectionPoint = intersectionObject.point;
      const axis = intersectionObject.object.axis;
      this.intersectionObject =intersectionObject;
      this.axis =axis;

      setAxis(intersectionPoint, axis);
      this.plane.position.copy(intersectionPoint);
      const normalsA = new ClipBoxNormals();

      const newNormal = this.pSimulation.camera.position
        .clone()
        .sub(
          this.pSimulation.camera.position
            .clone()
            .projectOnVector(normalsA.normals[axis])
        );
      this.plane.lookAt(newNormal.add(intersectionPoint));

      this.pSimulation.renderer.domElement.style.cursor = "move";
      //simulation.throttledRender();

      document.addEventListener(
        "mousemove",
        this.continueDrag.bind(this),
        true
      );
      document.addEventListener(
        "touchmove",
        this.continueDrag.bind(this),
        true
      );

      document.addEventListener("mouseup", this.endDrag.bind(this), false);
      document.addEventListener("touchend", this.endDrag.bind(this), false);
      document.addEventListener("touchcancel", this.endDrag.bind(this), false);
      document.addEventListener("touchleave", this.endDrag.bind(this), false);
    }
  }

  continueDrag = function (event) {
    event.preventDefault();
    let pointer = creatPointer(event);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(pointer, this.pSimulation.camera);
    const intersects = ray.intersectObject(this.plane);
    const axis = this.axis;
    const intersectionObject =this.intersectionObject;
    let value = 0;
    if (intersects.length > 0) {
      if (axis === "x1" || axis === "x2") {
        value = intersectionObject.point.x;
      } else if (axis === "y1" || axis === "y2") {
        value = intersectionObject.point.y;
      } else if (axis === "z1" || axis === "z2") {
        value = intersectionObject.point.z;
      }

      var vgPlane = null;
      var vValue;
      if (axis === "x2") {
        vgPlane = this.pSimulation.clipPlanex1;
        vValue = value + 0.1;
      } else if (axis === "x1") {
        vgPlane = this.pSimulation.clipPlanex2;
        vValue = -(value - 0.1);
      } else if (axis === "y1") {
        vgPlane = this.pSimulation.clipPlaney1;
        vValue = -(value - 0.1);
      } else if (axis === "y2") {
        vgPlane = this.pSimulation.clipPlaney2;
        vValue = value + 0.1;
      } else if (axis === "z1") {
        vgPlane = this.pSimulation.clipPlanez1;
        vValue = -(value - 0.1);
      } else if (axis === "z2") {
        vgPlane = this.pSimulation.clipPlanez2;
        vValue = value + 0.1;
      }
      if (null != vgPlane) vgPlane.constant = vValue;

      this.pSimulation.clipSelection.setValue(axis, value);
      //simulation.throttledRender();
    }
  };

  endDrag(event) {
    this.pSimulation.controls.enabled = true;
    this.pSimulation.renderer.domElement.style.cursor = "pointer";
    document.removeEventListener("mousemove", this.continueDrag, true);
    document.removeEventListener("touchmove", this.continueDrag, true);
    document.removeEventListener("mouseup", this.endDrag, false);
    document.removeEventListener("touchend", this.endDrag, false);
    document.removeEventListener("touchcancel", this.endDrag, false);
    document.removeEventListener("touchleave", this.endDrag, false);
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
