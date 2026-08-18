import { Matrix4, Quaternion, Vector3, type InstancedMesh } from "three";

const tempMatrix = new Matrix4();
const position = new Vector3();
const rotation = new Quaternion(); // Required placeholder for decomposition
const scale = new Vector3();    // Required placeholder for decomposition

export function getInstancePosition(instances: InstancedMesh, index: number) {
    // 2. Fetch the instance's transformation matrix by its index
    instances.getMatrixAt(index, tempMatrix);

    // 3. Deconstruct the matrix into individual position, rotation, and scale variables
    tempMatrix.decompose(position, rotation, scale);

    // 4. The 'position' Vector3 now holds your coordinates (x, y, z)
    return position;
}

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
