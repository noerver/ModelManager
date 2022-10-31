import THREE_Model from "./js/THREE_Model.js";

new Vue({
  el: "#three_model",
  data() {
    return {
      threeModel: null,
      spheres: [],
      currentSphere: new THREE.Mesh(),
      INTERSECTED: null,
    };
  },
  methods: {
    addSphere(event) {
      console.log(this.threeModel.scene.width, this.threeModel.scene.height);
      console.log(event.clientX, event.clientY);
      let x = event.clientX - window.innerWidth / 2;
      const y = event.clientY - window.innerHeight / 2;
      console.log(x, y);
      const sphere = this.threeModel.createSpheres(this.INTERSECTED);
      this.currentSphere = sphere;
      //document.getElementById("s.z").value = sphere.position.z;
    },
    selectPlan() {
      const pointer = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      let _thisModel = this.threeModel;
      let _this =this;
      let INTERSECTED;
      function pointerMoive(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        console.log("pointer move");
        raycaster.setFromCamera(pointer, _thisModel.camera);
        const intersects = raycaster.intersectObjects(
          _thisModel.scene.children,
          true
        );
        console.log("intersects", intersects);

        var selMaterial = new THREE.MeshBasicMaterial({
          color: "blue",
          side: "2",
          opacity: 0.5,
          transparent: true,
        });

        if (intersects.length > 0) {
          if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) {
              //INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
              INTERSECTED.material = INTERSECTED.currentMterial;
            }

            INTERSECTED = intersects[0].object;
            
            INTERSECTED.currentMterial = INTERSECTED.material;
            INTERSECTED.material = selMaterial;
            _this.INTERSECTED =INTERSECTED;
            // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            // INTERSECTED.material.emissive.setHex(0xff0000);
          }
        } else {
          if (INTERSECTED) INTERSECTED.material = INTERSECTED.currentMterial;
          //INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

          INTERSECTED = null;
        }
        // for (let i = 0; i < intersects.length; i++) {
        //   intersects[i].object.material = selMaterial;
        // }
      }

      window.addEventListener("pointermove", pointerMoive);
    },
    loadObject() {
      //
      this.threeModel.loadObject();
      document
        .getElementById("canvas3d")
        .addEventListener("click", this.addSphere);
      this.selectPlan();
    },
  },
  mounted() {
    this.threeModel = new THREE_Model("canvas3d");
    this.threeModel.init();
  },
});

function clear() {
  threeModel.clear();
}

//document.getElementById("idShow3D").addEventListener("click", threeStart);
//document.getElementById("idAddSphere").addEventListener("click", addSphere);

// 点选
// function initSelectOneElement() {
//   renderer.domElement.addEventListener("click", onDocumentClick, false);
//   // console.log('initSelectOneElement finished');
// }

// 视点放大缩小,移动视角
// function initViewcontrol() {
//   vPlease3D = new Model.Please3D(renderer, scene, camera);

//   $("#btnSection").click(function () {
//     console.log($("#btnSection").val());
//     if ($("#btnSection").val() == "开启剖面框") {
//       vPlease3D.ctrlSection(controls, true);
//       $("#btnSection").val("关闭剖面框");
//     } else {
//       vPlease3D.ctrlSection(controls, false);
//       $("#btnSection").val("开启剖面框");
//     }
//   });
// }
