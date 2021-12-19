import '@google/model-viewer';
import React, {
  BaseSyntheticEvent,
  MutableRefObject, SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Loader, Text, Group } from '@mantine/core';
import * as THREE from 'three';
import { BufferGeometry } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ModelViewerElement } from '@google/model-viewer/lib/model-viewer';
import { degToRad } from 'three/src/math/MathUtils';

type ModelViewerProps = {
  url: string;
  autoRotate?: boolean;
  viewerRef?: MutableRefObject<ModelViewerElement | undefined>;
  onClick?: (event: MouseEvent) => void;
};

export default function ModelViewerComponent(
  {
    url,
    autoRotate,
    viewerRef,
    onClick,
  }: ModelViewerProps) {
  let modelViewer = viewerRef;
  if (modelViewer === undefined) {
    modelViewer = useRef<ModelViewerElement>();
  }
  const [progressText, setProgressText] = useState<string>();
  const [progressVisible, setProgressVisible] = useState<boolean>(true);

  useEffect(() => {
    const loader = new STLLoader();
    loader.loadAsync(url, (event: ProgressEvent) => {
      setProgressText(`Loading stl ... ${Math.round(event.loaded / event.total) * 100}`);
    })
      .then((geometry: BufferGeometry) => {
        const material = new THREE.MeshStandardMaterial({
          color: 0x334756,
          roughness: 0.7,
          name: 'main',
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.rotateX(degToRad(-90));

        mesh.scale.set(0.1, 0.1, 0.1);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const gltfExporter = new GLTFExporter();
        setProgressText('Prepare model ...');
        gltfExporter.parse(mesh, (result: object) => {
          const output = JSON.stringify(result, null, 2);
          const blob = new Blob([output], { type: 'text/plain' });
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            if (modelViewer!.current != null) {
              modelViewer!.current.src = reader.result as string;
              if (autoRotate === undefined) {
                modelViewer!.current.autoRotate = true;
              } else {
                modelViewer!.current.autoRotate = autoRotate;
              }
            }
          }, false);

          if (result) {
            reader.readAsDataURL(blob);
          }
          setProgressVisible(false);
        }, {});
      });
  }, []);

// @ts-ignore
return <model-viewer
  camera-controls
  loading="eager"
  onClick={onClick}
  shadow-intensity="1"
  environment-image="neutral"
  ar
  ar-scale="fixed"
  ar-modes="webxr scene-viewer quick-look"
  ref={modelViewer}
  styles="width: 100%"
>
  {progressVisible ? <Group m="sm" spacing="sm">
    <Loader size="sm" />
    <Text color="blue">{progressText}</Text>
                     </Group> : null}
  {/* @ts-ignore */}
       </model-viewer>;
}
