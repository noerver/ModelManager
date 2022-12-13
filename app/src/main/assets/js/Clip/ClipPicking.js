import THREE from "../three.min.js"
import ClipBoxNormals from "./ClipBoxNormals.js";
import { setAxis, creatPointer } from "./Util.js";

export default class ClipPicking {
    constructor(simulation) {
        this.intersected = null;
        var _this = this;
        const ray = new THREE.Raycaster();
        this.pSimulation = simulation;
        const domElement = simulation.renderer.domElement;
        const normalsA = new ClipBoxNormals();

        var plane = null;

        this.targeting = function (event) {
            let pointer = creatPointer(event);
            ray.setFromCamera(pointer, simulation.camera);
            const intersects = ray.intersectObjects(
                simulation.clipSelection.selectables
            );

            if (intersects.length > 0) {
                const candidate = intersectionObject.object;

                if (this.intersected !== candidate) {
                    if (this.intersected) {
                        this.intersected.guardian.rayOut();
                    }

                    candidate.guardian.rayOver();

                    this.intersected = candidate;

                    simulation.renderer.domElement.style.cursor = "pointer";
                    //simulation.throttledRender();
                }
            } else if (this.intersected) {
                // this.intersected.guardian.rayOut();
                // this.intersected = null;
                // simulation.renderer.domElement.style.cursor = "auto";
                // simulation.throttledRender();
            }
        };

        this.mark = function () {
            if (this.intersected) {
                simulation.renderer.domElement.style.cursor = "pointer";
            }
        };

        this.beginDrag = function (event) {
            let pointer = creatPointer(event);
            ray.setFromCamera(pointer, simulation.camera);
            const intersects = ray.intersectObjects(
                simulation.clipSelection.selectables
            );

            if (intersects.length > 0) {
                event.preventDefault();
                simulation.controls.enabled = false;
                if (!(plane && plane.geometry)) {
                    const vlimitValue = simulation.clipSelection.limitValue;
                    plane = new THREE.Mesh(
                        new THREE.PlaneGeometry(vlimitValue, vlimitValue, 4, 4),
                        CAPSMATERIAL.Invisible
                    );
                    simulation.scene.add(plane);
                }

                const intersectionObject = intersectionObject;
                const intersectionPoint = intersectionObject.point;
                const axis = intersectionObject.object.axis;

                setAxis(intersectionPoint, axis);
                plane.position.copy(intersectionPoint);

                const newNormal = simulation.camera.position
                    .clone()
                    .sub(
                        simulation.camera.position.clone().projectOnVector(normalsA.normals[axis])
                    );
                plane.lookAt(newNormal.add(intersectionPoint));

                simulation.renderer.domElement.style.cursor = "move";
                //simulation.throttledRender();

                var continueDrag = function (event) {
                    event.preventDefault();
                    let pointer = creatPointer(event);
                    ray.setFromCamera(pointer, simulation.camera);
                    const intersects = ray.intersectObject(plane);
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
                            vgPlane = simulation.clipPlanex1;
                            vValue = value + 0.1;
                        } else if (axis === "x1") {
                            vgPlane = simulation.clipPlanex2;
                            vValue = -(value - 0.1);
                        } else if (axis === "y1") {
                            vgPlane = simulation.clipPlaney1;
                            vValue = -(value - 0.1);
                        } else if (axis === "y2") {
                            vgPlane = simulation.clipPlaney2;
                            vValue = value + 0.1;
                        } else if (axis === "z1") {
                            vgPlane = simulation.clipPlanez1;
                            vValue = -(value - 0.1);
                        } else if (axis === "z2") {
                            vgPlane = simulation.clipPlanez2;
                            vValue = value + 0.1;
                        }
                        if (null != vgPlane) vgPlane.constant = vValue;

                        simulation.clipSelection.setValue(axis, value);
                        //simulation.throttledRender();
                    }
                };

                var endDrag = function (event) {
                    simulation.controls.enabled = true;
                    simulation.renderer.domElement.style.cursor = "pointer";
                    document.removeEventListener("mousemove", continueDrag, true);
                    document.removeEventListener("touchmove", continueDrag, true);
                    document.removeEventListener("mouseup", endDrag, false);
                    document.removeEventListener("touchend", endDrag, false);
                    document.removeEventListener("touchcancel", endDrag, false);
                    document.removeEventListener("touchleave", endDrag, false);
                };

                document.addEventListener("mousemove", continueDrag, true);
                document.addEventListener("touchmove", continueDrag, true);

                document.addEventListener("mouseup", endDrag, false);
                document.addEventListener("touchend", endDrag, false);
                document.addEventListener("touchcancel", endDrag, false);
                document.addEventListener("touchleave", endDrag, false);
            }
        };

        simulation.renderer.domElement.addEventListener(
            "mousemove",
            this.targeting,
            true
        );

        simulation.renderer.domElement.addEventListener("onClick", this.mark, true);

        simulation.renderer.domElement.addEventListener(
            "mousedown",
            this.beginDrag,
            false
        );
        simulation.renderer.domElement.addEventListener(
            "touchstart",
            this.beginDrag,
            false
        );
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
