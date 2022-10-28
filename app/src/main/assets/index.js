import THREE_Model from "./js/THREE_Model.js";

const threeModel = new THREE_Model("canvas3d");
let xStart = -1600;
let yStart = -1200;
function threeStart() {
  threeModel.init();
  document.addEventListener("click", addSphere, false);
  // document
  //   .getElementById("canvas3d")
  //   .addEventListener("click", addSphere, false);
}

function addSphere(event) {
  let x = (event.clientX  - window.innerWidth/2)*10;
  xStart =x;
  const y = (event.clientY  - window.innerHeight/2)*10;
  const sphere = threeModel.createSpheres(x, y);
  document.getElementById("s.x").value = sphere.position.x;
  document.getElementById("s.y").value = sphere.position.y;
  //document.getElementById("s.z").value = sphere.position.z;  
}

function clear(){
  threeModel.clear();
}

document.getElementById("idShow3D").addEventListener("click", threeStart);
document.getElementById("idAddSphere").addEventListener("click", addSphere);

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
