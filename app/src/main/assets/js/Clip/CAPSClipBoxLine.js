export default class CAPSClipBoxLine {
    constructor(v0, v1, f0, f1, selection) {
        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(v0, v1);
        lineGeometry.dynamic = true;
        selection.lineGeometries.push(lineGeometry);
        this.line = new THREE.LineSegments(lineGeometry, CAPSMATERIAL.BoxWireframe);
        selection.displayMeshes.add(this.line);
        f0.lines.push(this);
        f1.lines.push(this);
    }

    setHighlight(isHighlight) {
        this.line.material = isHighlight
            ? CAPSMATERIAL.BoxWireActive
            : CAPSMATERIAL.BoxWireframe;
    }
}