class RaycasterControls {
  constructor(scene) {
    this.scene = scene;
    this.prevObject = null;
  }

  addEventListener() {
    window.addEventListener("click", this.onMouseClick, false);
  }
  removeEventListener() {
    window.removeEventListener("click", this.onMouseClick, false);
  }
  onMouseClick(event) {
    var mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      if (this.prevObject) {
        this.prevObject.material = this.prevObject.userData.material;
        delete this.prevObject.userData.material;
      }

      var mesh = intersects[0].object;
      if (mesh && mesh.isMesh) {
        mesh.userData.material = mesh.userData.material || mesh.material;
        var materials = [];
        for (var i = 0; i < mesh.material.length; i++) {
          var material = mesh.userData.material[i].clone();
          material.color.set(0xff0000);
          materials.push(material);
        }
        mesh.material = materials;
        this.prevObject = mesh;
      }
    } else {
      if (this.prevObject) {
        this.prevObject.material = this.prevObject.userData.material;
        delete this.prevObject.userData.material;
      }

      this.prevObject = null;
    }
  }
}

const CAPSUNIFORMS = {
  clipping: {
    color: { type: "c", value: new THREE.Color(0x3d9ecb) },
    clippingLow: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
    clippingHigh: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
  },

  caps: {
    color: { type: "c", value: new THREE.Color(0xf83610) },
  },
};

const CAPSSHADER = {
  vertex:
    "\
          uniform vec3 color;\
          varying vec3 pixelNormal;\
          \
          void main() {\
              \
              pixelNormal = normal;\
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
              \
          }",

  vertexClipping:
    "\
          uniform vec3 color;\
          uniform vec3 clippingLow;\
          uniform vec3 clippingHigh;\
          \
          varying vec3 pixelNormal;\
          varying vec4 worldPosition;\
          varying vec3 camPosition;\
          \
          void main() {\
              \
              pixelNormal = normal;\
              worldPosition = modelMatrix * vec4( position, 1.0 );\
              camPosition = cameraPosition;\
              \
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
              \
          }",

  fragment:
    "\
          uniform vec3 color;\
          varying vec3 pixelNormal;\
          \
          void main( void ) {\
              \
              float shade = (\
                    3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
                  + 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
                  + 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
              ) / 3.0;\
              \
              gl_FragColor = vec4( color * shade, 1.0 );\
              \
          }",

  fragmentClipping:
    "\
          uniform vec3 color;\
          uniform vec3 clippingLow;\
          uniform vec3 clippingHigh;\
          \
          varying vec3 pixelNormal;\
          varying vec4 worldPosition;\
          \
          void main( void ) {\
              \
              float shade = (\
                    3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
                  + 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
                  + 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
              ) / 3.0;\
              \
              if (\
                     worldPosition.x < clippingLow.x\
                  || worldPosition.x > clippingHigh.x\
                  || worldPosition.y < clippingLow.y\
                  || worldPosition.y > clippingHigh.y\
                  || worldPosition.z < clippingLow.z\
                  || worldPosition.z > clippingHigh.z\
              ) {\
                  \
                  discard;\
                  \
              } else {\
                  \
                  gl_FragColor = vec4( color * shade, 1.0 );\
                  \
              }\
              \
          }",

  fragmentClippingFront:
    "\
          uniform vec3 color;\
          uniform vec3 clippingLow;\
          uniform vec3 clippingHigh;\
          \
          varying vec3 pixelNormal;\
          varying vec4 worldPosition;\
          varying vec3 camPosition;\
          \
          void main( void ) {\
              \
              float shade = (\
                    3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
                  + 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
                  + 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
              ) / 3.0;\
              \
              if (\
                     worldPosition.x < clippingLow.x  && camPosition.x < clippingLow.x\
                  || worldPosition.x > clippingHigh.x && camPosition.x > clippingHigh.x\
                  || worldPosition.y < clippingLow.y  && camPosition.y < clippingLow.y\
                  || worldPosition.y > clippingHigh.y && camPosition.y > clippingHigh.y\
                  || worldPosition.z < clippingLow.z  && camPosition.z < clippingLow.z\
                  || worldPosition.z > clippingHigh.z && camPosition.z > clippingHigh.z\
              ) {\
                  \
                  discard;\
                  \
              } else {\
                  \
                  gl_FragColor = vec4( color * shade, 1.0 );\
                  \
              }\
              \
          }",

  invisibleVertexShader:
    "\
          void main() {\
              vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\
              gl_Position = projectionMatrix * mvPosition;\
          }",

  invisibleFragmentShader:
    "\
          void main( void ) {\
              gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\
              discard;\
          }",
};

const CAPSMATERIAL = {
  sheet: new THREE.ShaderMaterial({
    uniforms: CAPSUNIFORMS.clipping,
    vertexShader: CAPSSHADER.vertexClipping,
    fragmentShader: CAPSSHADER.fragmentClipping,
  }),

  cap: new THREE.ShaderMaterial({
    uniforms: CAPSUNIFORMS.caps,
    vertexShader: CAPSSHADER.vertex,
    fragmentShader: CAPSSHADER.fragment,
  }),

  backStencil: new THREE.ShaderMaterial({
    uniforms: CAPSUNIFORMS.clipping,
    vertexShader: CAPSSHADER.vertexClipping,
    fragmentShader: CAPSSHADER.fragmentClippingFront,
    colorWrite: false,
    depthWrite: false,
    side: THREE.BackSide,
  }),

  frontStencil: new THREE.ShaderMaterial({
    uniforms: CAPSUNIFORMS.clipping,
    vertexShader: CAPSSHADER.vertexClipping,
    fragmentShader: CAPSSHADER.fragmentClippingFront,
    colorWrite: false,
    depthWrite: false,
  }),

  BoxBackFace: new THREE.MeshBasicMaterial({
    color: 0xc0c0c0,
    transparent: true,
    opacity: 0.25,
  }),
  BoxWireframe: new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linewidth: 2,
  }),
  BoxWireActive: new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 4,
  }),

  Invisible: new THREE.ShaderMaterial({
    vertexShader: CAPSSHADER.invisibleVertexShader,
    fragmentShader: CAPSSHADER.invisibleFragmentShader,
  }),
};

class CAPSPGeometry extends THREE.Geometry {
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

class CAPSClipBoxFace {
  constructor(axis, v0, v1, v2, v3, selection) {
    const frontFaceGeometry = new CAPSPGeometry(v0, v1, v2, v3);
    frontFaceGeometry.dynamic = true;
    selection.meshGeometries.push(frontFaceGeometry);

    var frontFaceMesh = new THREE.Mesh(
      frontFaceGeometry,
      CAPSMATERIAL.Invisible
    );
    frontFaceMesh.axis = axis;
    frontFaceMesh.guardian = this;
    selection.touchMeshes.add(frontFaceMesh);
    selection.selectables.push(frontFaceMesh);

    var backFaceGeometry = new CAPSPGeometry(v3, v2, v1, v0);
    backFaceGeometry.dynamic = true;
    selection.meshGeometries.push(backFaceGeometry);

    var backFaceMesh = new THREE.Mesh(
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

class ClipPicking {
  constructor(simulation) {
    this.intersected = null;
    var _this = this;
    var ray = new THREE.Raycaster();
    this.pSimulation = simulation;
    var domElement = simulation.renderer.domElement;
    _this.domElement = domElement !== undefined ? domElement : document;

    var normals = {
      x1: new THREE.Vector3(-1, 0, 0),
      x2: new THREE.Vector3(1, 0, 0),
      y1: new THREE.Vector3(0, -1, 0),
      y2: new THREE.Vector3(0, 1, 0),
      z1: new THREE.Vector3(0, 0, -1),
      z2: new THREE.Vector3(0, 0, 1),
    };

    var plane = null;
    //var plane = new THREE.Mesh( new THREE.PlaneGeometry( limitvalue, limitvalue, 4, 4 ), CAPSMATERIAL.Invisible );
    //plane.name='SlicingPlane';
    //simulation.scene.add( plane );

    this.targeting = function (event) {
      let pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log("targeting");
      // if (!simulation.bPick) return;
      // _this.switchCoordinate(event);

      ray.setFromCamera(pointer, simulation.camera);

      var intersects = ray.intersectObjects(
        simulation.clipSelection.selectables
      );

      if (intersects.length > 0) {
        var candidate = intersects[0].object;

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
      if (!simulation.bPick) return;

      let pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      ray.setFromCamera(pointer, simulation.camera);

      var intersects = ray.intersectObjects(
        simulation.clipSelection.selectables
      );

      if (intersects.length > 0) {
        event.preventDefault();
        //event.stopPropagation();

        simulation.controls.enabled = false;
        if (null == plane || null == plane.geometry) {
          var vlimitValue = simulation.clipSelection.limitValue;
          plane = new THREE.Mesh(
            new THREE.PlaneGeometry(vlimitValue, vlimitValue, 4, 4),
            CAPSMATERIAL.Invisible
          );
          simulation.scene.add(plane);
        }

        var intersectionPoint = intersects[0].point;

        var axis = intersects[0].object.axis;

        if (axis === "x1" || axis === "x2") {
          intersectionPoint.setX(0);
        } else if (axis === "y1" || axis === "y2") {
          intersectionPoint.setY(0);
        } else if (axis === "z1" || axis === "z2") {
          intersectionPoint.setZ(0);
        }
        plane.position.copy(intersectionPoint);

        var newNormal = simulation.camera.position
          .clone()
          .sub(
            simulation.camera.position.clone().projectOnVector(normals[axis])
          );
        plane.lookAt(newNormal.add(intersectionPoint));

        simulation.renderer.domElement.style.cursor = "move";
        //simulation.throttledRender();

        var continueDrag = function (event) {
          event.preventDefault();
          //event.stopPropagation();
          let pointer = new THREE.Vector2();
          pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
          pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

          //mouse.setToNormalizedDeviceCoordinates( event, window );
          //_this.switchCoordinate(event);

          ray.setFromCamera(pointer, simulation.camera);

          var intersects = ray.intersectObject(plane);
          let value = 0;
          if (intersects.length > 0) {
            //console.log(" intersects.length ");

            if (axis === "x1" || axis === "x2") {
              value = intersects[0].point.x;
            } else if (axis === "y1" || axis === "y2") {
              value = intersects[0].point.y;
            } else if (axis === "z1" || axis === "z2") {
              value = intersects[0].point.z;
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

class CAPSClipping {
  constructor(low, high, limitvalue, limitstep) {
    this.limitLow = low;
    this.limitHigh = high;
    this.limitValue = limitvalue;
    this.limitStep = limitstep;

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

    this.touchMeshes = new THREE.Object3D();
    this.displayMeshes = new THREE.Object3D();
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

class CAPSClipBoxLine {
  constructor(v0, v1, f0, f1, selection) {
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(v0, v1);
    //lineGeometry.computeLineDistances();
    lineGeometry.dynamic = true;
    selection.lineGeometries.push(lineGeometry);

    this.line = new THREE.LineSegments(lineGeometry, CAPSMATERIAL.BoxWireframe);
    selection.displayMeshes.add(this.line);

    f0.lines.push(this);
    f1.lines.push(this);
  }

  setHighlight(b) {
    this.line.material = b
      ? CAPSMATERIAL.BoxWireActive
      : CAPSMATERIAL.BoxWireframe;
  }
}

const Clipping = {
  RaycasterControls,
  CAPSPGeometry,
  CAPSUNIFORMS,
  CAPSMATERIAL,
  CAPSSHADER,
  CAPSClipBoxFace,
  ClipPicking,
  CAPSClipping,
};

export {
  RaycasterControls,
  CAPSPGeometry,
  CAPSUNIFORMS,
  CAPSMATERIAL,
  CAPSSHADER,
  CAPSClipBoxFace,
  ClipPicking,
  CAPSClipping,
};
export default Clipping;
