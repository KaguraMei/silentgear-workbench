import {Component, lazy, Suspense, type ReactNode} from 'react';
import type {Build} from './engine.js';

const Inspector = lazy(() => import('./CanvasStage').then(module => ({default: module.GearArt})));

class PreviewBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() {
    return this.state.failed ? <div className="preview-status" role="status">
      <b>立体预览暂时无法加载</b><span>配装和属性计算仍可使用</span>
      <button type="button" className="chip-button" onClick={() => location.reload()}>重新加载页面</button>
    </div> : this.props.children;
  }
}

export default function GearPreview({build}: {build: Build}) {
  return <PreviewBoundary><Suspense fallback={<div className="preview-status" role="status">
    <span className="preview-symbol" aria-hidden="true">◇</span>
    <b>正在加载立体预览</b><span>可以先选择材料与配置部件</span>
  </div>}><Inspector build={build}/></Suspense></PreviewBoundary>;
}
