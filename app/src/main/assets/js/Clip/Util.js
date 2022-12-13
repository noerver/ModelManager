const setAxis = function (intersectionPoint, axis) {
    switch (axis) {
        case "X1":
        case "x2":
            return intersectionPoint.setX(0);
        case "y1":
        case "y2":
            return intersectionPoint.setY(0);
        case "z1":
        case "z2":
            return intersectionPoint.setZ(0);
        default:
            return false;
    }
}


const creatPointer = function (event) {
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return pointer;
}


export {
    setAxis,
    creatPointer
}