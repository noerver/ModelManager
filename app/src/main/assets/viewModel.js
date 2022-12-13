import THREE_Model from "./js/THREE_Model.js";
import { GUI } from "./js/jsm/libs/lil-gui.module.min.js";
import Clipping from "./js/Clipping.js";

new Vue({
  el: "#three_model",
  data() {
    return {
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
      var selMaterial = new THREE.MeshBasicMaterial({
        color: "blue",
        side: "2",
        opacity: 0.5,
        transparent: true,
      });

      if (intersects.length > 0) {
        this.selectMesh = intersects[0];
        this.selectMesh.object.material = selMaterial;
      }
    },
    pointerMoive: function (event) {
      let pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(pointer, this.threeModel.camera);
      const objectMeshes = this.getSelectModel();
      const intersects = this.raycaster.intersectObjects(objectMeshes, true);
      var selMaterial = new THREE.MeshBasicMaterial({
        color: "blue",
        side: "2",
        opacity: 0.5,
        transparent: true,
      });

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
      if (fileName) {
        const filePath = "./FileModel/" + fileName;
        this.threeModel.loadObject2(filePath);
        document
          .getElementById("canvas3d")
          .removeEventListener("click", this.addSphere);
        // document
        //   .getElementById("canvas3d")
        //   .addEventListener("click", this.addSphere);

        this.selectPlan();
      }
    },
    removeSelect() {
      this.select = false;
      document
        .getElementById("canvas3d")
        .removeEventListener("click", this.addSphere);
    },
    setPointModel() {
      this.select = 1;
    },
    reset() {
      this.select = 0;
      document
        .getElementById("canvas3d")
        .removeEventListener("click", this.alert);
      document
        .getElementById("canvas3d")
        .addEventListener("click", this.addSphere);
    },
    creatOutMesh() {
      this.select = 2;
      window.removeEventListener("pointermove", this.pointerMoive);
      const box = new THREE.Box3();
      //box.setFromCenterAndSize( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 20000, 10000, 10000 ) );
      box.expandByObject(this.threeModel.mainObject);
      const s = box.getSize();

      const planes = [
        THREE.Plane(new THREE.Vector3(0, 0, 1), 10000),
        THREE.Plane(new THREE.Vector3(0, 0, -1), 10000),
        THREE.Plane(new THREE.Vector3(0, 1, 0), 10000),
        THREE.Plane(new THREE.Vector3(0, -1, 0), 10000),
        THREE.Plane(new THREE.Vector3(1, 0, 0), 10000),
        THREE.Plane(new THREE.Vector3(-1, 0, 0), 10000),
      ];

      this.threeModel.render.clippingPlanes = planes;
      this.threeModel.render.localClippingEnabled = true;
      const zoom = 1.05;
      const clipSelection = new Clipping.CAPSClipping(
        new THREE.Vector3(-s.x * zoom, -s.y * zoom, -s.z * zoom),
        new THREE.Vector3(s.x * zoom, s.y * zoom, s.z * zoom),
        250000,
        0.4
      );
      this.threeModel.scene.add(clipSelection.displayMeshes);
      this.threeModel.clipSelection = clipSelection;
      this.groupPlan = clipSelection.selectables;

      const ssdaf = new Clipping.ClipPicking(this.threeModel);
      ssdaf.setEventListener(true);
      this.addGUI();
      document
        .getElementById("canvas3d")
        .addEventListener("click", this.pointClick);
     
    },
    clip() {},
    addGUI() {
      const gui = new GUI({ title: "Clip" });
      const model = this.threeModel;

      const API = {
        x: 100,
      };
      const _this = this;
      gui
        .add(API, "x", 0, 1000, 100)
        .name("x")
        .onChange(function () {
          const mesh = _this.selectMesh;
          mesh.object.position.x = API.x;
          model.render();
        });
    },
  },
  mounted() {
    this.threeModel = new THREE_Model("canvas3d");
    this.threeModel.init();
    this.loadObject();
  },
});
