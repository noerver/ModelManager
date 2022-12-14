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
        //this.intersectObjects = null;
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
      const fileName = window.localStorage.getItem("model_data");
      const filePath = fileName ? "./FileModel/" + fileName : "";
      this.threeModel.loadObject(filePath);
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
    },
    setClipPlanes() {
      const box = new THREE.Box3();
      box.expandByObject(this.threeModel.mainObject);
      const boxSize = box.getSize();
      const zoom = 1;
      this.clipBoxNormals = new ClipBoxNormals();
      const planes = this.clipBoxNormals.createPlanes(
        boxSize.x,
        boxSize.y,
        boxSize.z,
        zoom
      );
      this.planes = planes;
      this.threeModel.renderer.clippingPlanes = planes;
      this.threeModel.renderer.localClippingEnabled = true;
      this.creatOutMesh(boxSize, zoom);
    },
    creatOutMesh(boxSize, zoom) {
      const clipSelection = new CAPSClipping(
        new THREE.Vector3(
          -boxSize.x * zoom,
          -boxSize.y * zoom,
          -boxSize.z * zoom
        ),
        new THREE.Vector3(boxSize.x * zoom, boxSize.y * zoom, boxSize.z * zoom),
        250000,
        0.4
      );

      this.threeModel.scene.add(clipSelection.displayMeshes);
      this.threeModel.clipSelection = clipSelection;
    },
    setGUI() {
      this.gui = new GUI({ title: "Clip", autoPlace: true, width: 200 });
      this.clipBoxNormals.planes.forEach((planeItem) => {
        this.creatPlanGUI(planeItem.name, planeItem.plane);
      });
    },
    setClip() {
      window.removeEventListener("pointermove", this.pointerMoive);
      this.setClipPlanes();
      this.setGUI();
    },
    openDetail() {
      //构建信息表的打开和数据获取
      if (this.intersectObjects) {
        $("#layer_content").window({
          width: 400,
          height: 400,
          modal: true,
          closable: true,
        });
        $("#layer_content").window("open");
        $("#layer_content").html("");
        $("#layer_content").append("Detail");
        const tableData = document.createElement("table"); //动态创建table表格
        tableData.border = "1";
        const obj = this.intersectObjects;
        for (var item in obj.object.userData) {
          var currentRow = tableData.insertRow(-1);
          var tableTd = currentRow.insertCell(-1);
          tableTd.innerHTML = item;
          currentRow.insertCell(-1).innerHTML = obj.object.userData[item];
        }
        $("#layer_content").append(tableData);
      } else {
        $("#layer_content").window("close");
      }
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
