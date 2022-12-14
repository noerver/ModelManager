import THREE_Model from "./js/THREE_Model.js";
import { GUI } from "./js/jsm/libs/lil-gui.module.min.js";
import { ClipBoxNormals, CAPSClipping, ClipPicking } from "./js/Clip/index.js";
import { creatPointer } from "./js/Clip/Util.js";
import { CAPSMATERIAL, CAPSUNIFORMS } from "./js/Clip/ClipConfig.js";

new Vue({
  el: "#three_model",
  data() {
    return {
      rootDom: null,
      threeModel: null,
      spheres: [],
      currentSphere: new THREE.Mesh(),
      INTERSECTED: null,
      intersectObjects: null,
      raycaster: new THREE.Raycaster(),
      points: [],
      mainBox: null,
      select: 0,
      groupPlan: [],
      selectMesh: null,
    };
  },
  methods: {
    getSelectModel() {
      switch (this.select) {
        case 1:
          return this.points;
        case 2:
          return this.groupPlan;
        default:
          return this.threeModel.scene.children;
      }
    },
    pointClick: function (event) {
      let pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(pointer, this.threeModel.camera);
      const objectMeshes = this.getSelectModel();
      const intersects = this.raycaster.intersectObjects(objectMeshes, true);
      const selMaterial = CAPSMATERIAL.selectMaterial;

      if (intersects.length > 0) {
        this.selectMesh = intersects[0];
        this.selectMesh.object.material = selMaterial;
      }
    },
    pointerMoive: function (event) {
      let pointer = creatPointer(event);
      this.raycaster.setFromCamera(pointer, this.threeModel.camera);
      const objectMeshes = this.getSelectModel();
      const intersects = this.raycaster.intersectObjects(objectMeshes, true);
      const selMaterial = CAPSMATERIAL.selectMaterial;
      let INTERSECTED = this.INTERSECTED;
      if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
          if (INTERSECTED) {
            INTERSECTED.material = INTERSECTED.currentMterial;
          }

          INTERSECTED = intersects[0].object;

          INTERSECTED.currentMterial = INTERSECTED.material;
          INTERSECTED.material = selMaterial;
          this.intersectObjects = intersects[0];
          this.INTERSECTED = INTERSECTED;
        } else {
          INTERSECTED.material = selMaterial;
          this.intersectObjects = intersects[0];
          this.INTERSECTED = INTERSECTED;
        }
      } else {
        if (INTERSECTED) INTERSECTED.material = INTERSECTED.currentMterial;
        INTERSECTED = null;
        this.intersectObjects = null;
      }
    },
    addSphere(event) {
      if (this.intersectObjects) {
        const sphere = this.threeModel.createSpheres(this.intersectObjects);
        this.currentSphere = sphere;
        this.points.push(sphere);
      }
    },
    selectPlan() {
      window.addEventListener("pointermove", this.pointerMoive);
    },
    loadObject() {
      //
      const fileName = window.localStorage.getItem("model_data");
      const filePath = fileName ? "./FileModel/" + fileName : "";
      this.threeModel.loadObject2(filePath);
      this.rootDom.removeEventListener("click", this.addSphere);
      this.selectPlan();
    },
    removeSelect() {
      this.select = false;
      this.rootDom.removeEventListener("click", this.addSphere);
    },
    setPointModel() {
      this.select = 1;
    },
    reset() {
      window.location.reload();
      // this.select = 0;
      // this.rootDom.removeEventListener("click", this.alert);
      // this.rootDom.addEventListener("click", this.addSphere.bind(this));
    },
    creatOutMesh() {
      this.select = 2;
      window.removeEventListener("pointermove", this.pointerMoive);
      const box = new THREE.Box3();
      //box.setFromCenterAndSize( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 20000, 10000, 10000 ) );
      box.expandByObject(this.threeModel.mainObject);
      const s = box.getSize();
      const zoom = 1;
      const normalsA = new ClipBoxNormals();
      const planes = normalsA.createPlanes(s.x, s.y, s.z, zoom);
      this.planes = planes;
      this.threeModel.renderer.clippingPlanes = planes;
      this.threeModel.renderer.localClippingEnabled = true;

      const clipSelection = new CAPSClipping(
        new THREE.Vector3(-s.x * zoom, -s.y * zoom, -s.z * zoom),
        new THREE.Vector3(s.x * zoom, s.y * zoom, s.z * zoom),
        250000,
        0.4
      );
      this.threeModel.scene.add(clipSelection.displayMeshes);
      this.threeModel.clipSelection = clipSelection;
      this.groupPlan = clipSelection.selectables;

      const ssdaf = new ClipPicking(this.threeModel);
      ssdaf.setEventListener(true);
      this.gui = new GUI({ title: "Clip",autoPlace:true ,width:200});

      normalsA.planes.forEach((planeItem) => {
        this.creatPlanGUI(planeItem.name, planeItem.plane);
      });
    },
    creatPlanGUI(name, plane) {
      const start = plane.constant;
      this.addGUI(name, plane, -start, start, start);
    },
    addGUI(name, plane, min, max, start, stepLimit = 100) {
      const model = this.threeModel;
      const API = {
        x: start,
      };
      const planes = this.planes;
      const _this = this;
      this.gui
        .add(API, "x", min, max, stepLimit)
        .name(name)
        .onChange(() => {
          plane.constant = API.x;
          model.render();
        });
    },
  },
  mounted() {
    if (!this.rootDom) {
      this.rootDom = document.getElementById("canvas3d");
    }
    this.threeModel = new THREE_Model("canvas3d");
    this.threeModel.init();
    this.loadObject();
  },
});
