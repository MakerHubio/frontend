import '@google/model-viewer';
import React, {
  forwardRef,
  MutableRefObject, Ref, useEffect, useImperativeHandle,
  useRef, useState,
} from 'react';
import { ActionIcon, createStyles, Group } from '@mantine/core';
import { Vector3 } from 'three';
import { ModelViewerElement } from '@google/model-viewer/lib/model-viewer';
import { hexToRgbA } from '../../utils/color';
import { BiRuler } from 'react-icons/bi';

export interface Hotspot {
  normal: Vector3,
  position: Vector3,
  name: string,
  text: string,
}

export type ModelViewerProps = {
  url: string;
  poster?: string;
  autoRotate?: boolean;
  viewerRef?: MutableRefObject<ModelViewerElement | undefined>;
  addHotspotMode?: boolean;
  hotspots?: Hotspot[];
  onHotspotAdd?: (hotspot: Hotspot) => void;
  color?: string;
  camera?: {
    theta: number;
    phi: number;
    radius: number;
    fov: number;
  }
};

export type ModelViewerHandle = {
  screenshot: () => {
    data: string,
    theta: number;
    phi: number;
    radius: number;
    fov: number;
  } | null,
};

const useStyles = createStyles(theme => ({
  modelWrapper: {
    position: 'relative',
  },
  shutter: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'white',
    opacity: 0,
    pointerEvents: 'none',
  },
  hotspot: {
    backgroundColor: theme.colors.white,
    height: 24,
    width: 24,
    borderRadius: 32,
    border: 'none',
    boxShadow: theme.shadows.md,
    padding: 8,
    position: 'relative',
    transition: 'opacity 0.3s ease 0s',
  },
  hotspotAnnotation: {
    background: 'rgb(255, 255, 255)',
    borderRadius: '4px',
    boxShadow: 'rgb(0 0 0 / 25%) 0px 2px 4px',
    color: 'rgba(0, 0, 0, 0.8)',
    display: 'block',
    fontSize: '18px',
    fontWeight: 700,
    left: 'calc(100% + 1em)',
    maxWidth: '128px',
    overflowWrap: 'break-word',
    padding: '0.5em 1em',
    position: 'absolute',
    transform: 'translateY(-50%)',
    width: 'max-content',
  },
  dot: {
    display: 'block',
    width: '12px',
    height: '12px',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    background: '#fff',
    '--min-hotspot-opacity': '0',
  },
  dim: {
    background: '#fff',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'rgba(0, 0, 0, 0.8)',
    display: 'block',
    fontFamily: 'Futura, Helvetica Neue, sans-serif',
    fontSize: '18px',
    fontWeight: 700,
    border: 'none',
    maxWidth: '128px',
    overflowWrap: 'break-word',
    padding: '0.5em 1em',
    position: 'absolute',
    width: 'max-content',
    height: 'max-content',
    transform: 'translate3d(-50%, -50%, 0)',
    '--min-hotspot-opacity': '0',
  },
  show: { '--min-hotspot-opacity': '1' },
  hide: { display: 'none' },
}));

function ModelViewerComponent(
  {
    url,
    poster,
    autoRotate = true,
    viewerRef,
    addHotspotMode,
    hotspots,
    onHotspotAdd,
    color,
    camera,
  }: ModelViewerProps,
  ref: Ref<ModelViewerHandle | undefined>) {
  let modelViewer = viewerRef;
  if (modelViewer === undefined) {
    modelViewer = useRef<ModelViewerElement>();
    // @ts-ignore
    window.ModelViewerElement = {
      meshoptDecoderLocation: 'https://unpkg.com/meshoptimizer/meshopt_decoder.js',
    };
  }
  const { classes, cx } = useStyles();
  const [showDimensions, setShowDimensions] = useState(false);

  const onViewerClick = (event: PointerEvent) => {
    const viewer: any = modelViewer?.current;

    if (onHotspotAdd && addHotspotMode && viewer !== undefined) {
      // without ts-ignore here would be a false warning
      // @ts-ignore
      const positionAndNormal =
        viewer.positionAndNormalFromPoint(event.clientX,
          event.clientY);

      onHotspotAdd({
        normal: positionAndNormal.normal,
        position: positionAndNormal.position,
        name: `test${positionAndNormal.position.toString()}`,
        text: '',
      });
    }
  };

  const renderHotspots = () => hotspots?.map(hotspot =>
    <button
      type="button"
      key={hotspot.name}
      className={classes.hotspot}
      slot={`hotspot-${hotspot.name}`}
      data-position={hotspot.position.toString()}
      data-normal={hotspot.normal.toString()}
      data-visibility-attribute="visible"
    >
      {hotspot.text.length > 0 ? <div className={classes.hotspotAnnotation}>
        {hotspot.text}
                                 </div> : null}
    </button>
  );

  const toggleDimensions = () => {
    const viewer: any = modelViewer?.current;
    if (viewer) {
      setShowDimensions(!showDimensions);

      setTimeout(() => {
        if (showDimensions) return;
        const center = viewer.getCameraTarget();
        const size = viewer.getDimensions();
        const x2 = size.x / 2;
        const y2 = size.y / 2;
        const z2 = size.z / 2;

        viewer.updateHotspot({
          name: 'hotspot-dot+X-Y+Z',
          position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`,
        });

        viewer.updateHotspot({
          name: 'hotspot-dim+X-Y',
          position: `${center.x + x2} ${center.y - y2} ${center.z}`,
        });
        viewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =
          `${(size.z).toFixed(0)} mm`;

        viewer.updateHotspot({
          name: 'hotspot-dot+X-Y-Z',
          position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`,
        });

        viewer.updateHotspot({
          name: 'hotspot-dim+X-Z',
          position: `${center.x + x2} ${center.y} ${center.z - z2}`,
        });
        viewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =
          `${(size.y).toFixed(0)} mm`;

        viewer.updateHotspot({
          name: 'hotspot-dot+X+Y-Z',
          position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`,
        });

        viewer.updateHotspot({
          name: 'hotspot-dim+Y-Z',
          position: `${center.x} ${center.y + y2} ${center.z - z2}`,
        });
        viewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =
          `${(size.x).toFixed(0)} mm`;

        viewer.updateHotspot({
          name: 'hotspot-dot-X+Y-Z',
          position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`,
        });

        viewer.updateHotspot({
          name: 'hotspot-dim-X-Z',
          position: `${center.x - x2} ${center.y} ${center.z - z2}`,
        });
        viewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =
          `${(size.y).toFixed(0)} mm`;

        viewer.updateHotspot({
          name: 'hotspot-dot-X-Y-Z',
          position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`,
        });

        viewer.updateHotspot({
          name: 'hotspot-dim-X-Y',
          position: `${center.x - x2} ${center.y - y2} ${center.z}`,
        });
        viewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent =
          `${(size.z).toFixed(0)} mm`;

        viewer.updateHotspot({
          name: 'hotspot-dot-X-Y+Z',
          position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`,
        });
      }, 50);
    }
  };

  useEffect(() => {
    const viewer: any = modelViewer?.current;
    if (viewer) {

      if (color) {
        // @ts-ignore
        viewer.addEventListener('load', () => {
          viewer.model?.materials[0].pbrMetallicRoughness.setBaseColorFactor(
            hexToRgbA(color));
        });
      }
      viewer.autoRotate = autoRotate;
      viewer.interactionPrompt = autoRotate ? 'auto' : 'none';
    }
  }, []);

  useEffect(() => {
    const viewer: any = modelViewer?.current;
    if (viewer && color && viewer.model) {
      const [material] = viewer.model.materials;
      material.pbrMetallicRoughness.setBaseColorFactor(hexToRgbA(color));
      material.pbrMetallicRoughness.setRoughnessFactor(0.3);
      material.pbrMetallicRoughness.setMetallicFactor(0.1);
    }
  }, [color]);

  useImperativeHandle(ref, () => ({
    screenshot: () => {
      const viewer: any = modelViewer?.current;
      if (viewer) {
        const orbit = viewer.getCameraOrbit();
        const fov = viewer.getFieldOfView();
        return {
          data: viewer.toDataURL('image/png') as string,
          theta: orbit.theta,
          phi: orbit.phi,
          radius: orbit.radius,
          fov,
        };
      }
      return null;
    },
  }));

// @ts-ignore
  return <model-viewer
    camera-controls="true"
    loading="eager"
    onClick={onViewerClick}
    shadow-intensity="1"
    environment-image="legacy"
    camera-orbit={camera && camera.theta !== 0 ? `${camera.theta}rad ${camera.phi}rad ${camera.radius}m` : 'auto auto auto'}
    field-of-view={camera && camera.fov !== 0 ? `${camera.fov}` : 'auto'}
    poster={poster}
    src={url}
    background-color="transparent"
    ar-scale="fixed"
    ar-modes="webxr scene-viewer quick-look"
    ref={modelViewer}
    min-camera-orbit="auto 0deg auto"
    max-camera-orbit="auto 180deg auto"
    styles={`width: 100%; height: 100%; cursor:${addHotspotMode ? 'cross' : 'inherit'}`}
  >
    {/*progressVisible ? <Group m="sm" spacing="sm">
    <Loader size="sm" />
    <Text color="blue">{progressText}</Text>
                     </Group> : null */}
    {renderHotspots()}
    <Group m="xs" mr={44} position="right">
      <ActionIcon color="dark" variant="filled" size="lg" onClick={() => toggleDimensions() }>
        <BiRuler color="white" size={22} />
      </ActionIcon>
    </Group>
    { showDimensions ?
    <>
    <button slot="hotspot-dot+X-Y+Z" className={classes.dot} data-position="1 -1 1" data-normal="1 0 0"/>
    <button slot="hotspot-dim+X-Y" className={classes.dim} data-position="1 -1 0" data-normal="1 0 0"/>
    <button slot="hotspot-dot+X-Y-Z" className={classes.dot} data-position="1 -1 -1" data-normal="1 0 0"/>
    <button slot="hotspot-dim+X-Z" className={classes.dim} data-position="1 0 -1" data-normal="1 0 0"/>
    <button slot="hotspot-dot+X+Y-Z" className={cx(classes.dot, classes.show)} data-position="1 1 -1" data-normal="0 1 0"/>
    <button slot="hotspot-dim+Y-Z" className={cx(classes.dim, classes.show)} data-position="0 -1 -1" data-normal="0 1 0"/>
    <button slot="hotspot-dot-X+Y-Z" className={cx(classes.dot, classes.show)} data-position="-1 1 -1" data-normal="0 1 0"/>
    <button slot="hotspot-dim-X-Z" className={classes.dim} data-position="-1 0 -1" data-normal="-1 0 0"/>
    <button slot="hotspot-dot-X-Y-Z" className={classes.dot} data-position="-1 -1 -1" data-normal="-1 0 0"/>
    <button slot="hotspot-dim-X-Y" className={classes.dim} data-position="-1 -1 0" data-normal="-1 0 0"/>
    <button slot="hotspot-dot-X-Y+Z" className={classes.dot} data-position="-1 -1 1" data-normal="-1 0 0"/>
    </> : <></> }
    {/* @ts-ignore */}
  </model-viewer>;
}

const Model = forwardRef(ModelViewerComponent);

export default function WrappedModelViewer({ mvRef, ...props } :
  ModelViewerProps & { mvRef?: Ref<ModelViewerHandle | undefined> }) {
  return <Model {...props} ref={mvRef} />;
}
