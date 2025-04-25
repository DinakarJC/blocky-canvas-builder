
import React, { useEffect } from "react";
import { toast } from "sonner";
import CanvasComponent from "./CanvasComponent";
import { useCanvas } from "@/hooks/useCanvas";
import { DroppedComponent } from "@/types/canvas";
import { 
  removeComponentById, 
  updateComponentById, 
  flattenComponents 
} from "@/utils/canvasUtils";

export const Canvas = () => {
  const {
    droppedComponents,
    selectedComponent,
    isPreviewMode,
    resizing,
    canvasRef,
    setIsPreviewMode,
    setSelectedComponent,
    setResizing,
    handleDrop,
    handleResize,
    addToHistory,
    updateLayersPanel,
    setDroppedComponents
  } = useCanvas();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleRemoveComponent = (id: string) => {
    const newComponents = removeComponentById(droppedComponents, id);
    setDroppedComponents(newComponents);
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
    addToHistory(newComponents);
    updateLayersPanel(newComponents);
  };

  const handleSelectComponent = (component: DroppedComponent, e: React.MouseEvent) => {
    if (!isPreviewMode) {
      e.stopPropagation();
      setSelectedComponent(component.id);
      window.dispatchEvent(new CustomEvent('component-selected', { 
        detail: { component } 
      }));
    }
  };

  const startResize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(id);
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const stopResize = () => {
    if (resizing) {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
      setResizing(null);
      addToHistory(droppedComponents);
      updateLayersPanel(droppedComponents);
    }
  };

  useEffect(() => {
    const handleStyleUpdate = (e: CustomEvent) => {
      const { component } = e.detail;
      const newComponents = updateComponentById(droppedComponents, component);
      setDroppedComponents(newComponents);
      updateLayersPanel(newComponents);
    };

    const handlePreviewToggle = (e: CustomEvent) => {
      setIsPreviewMode(e.detail.isPreviewMode);
      if (e.detail.isPreviewMode) {
        setSelectedComponent(null);
      }
    };

    const handleClearCanvas = () => {
      setDroppedComponents([]);
      setSelectedComponent(null);
      addToHistory([]);
      updateLayersPanel([]);
    };

    window.addEventListener('component-updated' as any, handleStyleUpdate as any);
    window.addEventListener('preview-mode-toggled' as any, handlePreviewToggle as any);
    window.addEventListener('clear-canvas-requested' as any, handleClearCanvas as any);
    
    updateLayersPanel(droppedComponents);
    
    return () => {
      window.removeEventListener('component-updated' as any, handleStyleUpdate as any);
      window.removeEventListener('preview-mode-toggled' as any, handlePreviewToggle as any);
      window.removeEventListener('clear-canvas-requested' as any, handleClearCanvas as any);
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, [droppedComponents, selectedComponent]);

  return (
    <div 
      className="canvas-area relative p-8 min-h-[calc(100vh-4rem)]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={canvasRef}
    >
      {droppedComponents.length > 0 ? (
        <div className="w-full h-full">
          {droppedComponents.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent === component.id}
              isResizing={resizing === component.id}
              isPreviewMode={isPreviewMode}
              onSelect={handleSelectComponent}
              onRemove={handleRemoveComponent}
              onStartResize={startResize}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
          <p className="text-lg mb-2">Drop components here</p>
          <p className="text-sm">Drag elements from the sidebar to build your page</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
