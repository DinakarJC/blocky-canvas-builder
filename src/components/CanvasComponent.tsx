
import React, { CSSProperties } from 'react';
import { Button } from "@/components/ui/button";
import { ComponentIcon } from "@/components/ComponentIcon";
import { DroppedComponent } from '@/types/canvas';

interface CanvasComponentProps {
  component: DroppedComponent;
  isSelected: boolean;
  isResizing: boolean;
  isPreviewMode: boolean;
  onSelect: (component: DroppedComponent, e: React.MouseEvent) => void;
  onRemove: (id: string) => void;
  onStartResize: (id: string, e: React.MouseEvent) => void;
  onDragOver: (e: React.DragEvent, targetId?: string) => void;
  onDrop: (e: React.DragEvent, targetId?: string) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  isResizing,
  isPreviewMode,
  onSelect,
  onRemove,
  onStartResize,
  onDragOver,
  onDrop
}) => {
  const baseStyles: CSSProperties = {
    ...component.styles,
    border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
    position: 'relative',
    cursor: isPreviewMode ? 'default' : 'pointer',
    transition: 'all 0.2s ease'
  };

  if (component.styles.height === 'auto') {
    baseStyles.minHeight = '50px';
  }

  const canContainChildren = ['section', 'row', 'column', 'container'].includes(component.type.toLowerCase());
  const resizeHandleClasses = "absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-bl cursor-se-resize";

  const renderContent = () => {
    switch(component.type.toLowerCase()) {
      case 'text':
        return <p style={baseStyles}>{component.content}</p>;
      case 'button':
        return <Button style={baseStyles} className="block">{component.content}</Button>;
      case 'image':
        return <img src={component.content} alt="Component" style={baseStyles} className="max-w-full h-auto" />;
      case 'link':
        return <a href="#" style={baseStyles} className="inline-block">{component.content}</a>;
      case 'section':
        return (
          <section style={baseStyles} className="w-full relative" onDragOver={(e) => onDragOver(e, component.id)} onDrop={(e) => onDrop(e, component.id)}>
            {component.children && component.children.length > 0 ? (
              component.children.map(child => (
                <CanvasComponent
                  key={child.id}
                  component={child}
                  isSelected={false}
                  isResizing={false}
                  isPreviewMode={isPreviewMode}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  onStartResize={onStartResize}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                />
              ))
            ) : (
              <div className="py-4 flex items-center justify-center bg-gray-50">
                <span className="text-sm text-gray-500">Drop components here</span>
              </div>
            )}
          </section>
        );
      case 'row':
        return (
          <div style={baseStyles} className="flex flex-row w-full gap-4" onDragOver={(e) => onDragOver(e, component.id)} onDrop={(e) => onDrop(e, component.id)}>
            {component.children && component.children.length > 0 ? (
              component.children.map(child => (
                <div key={child.id} className="flex-1 nested-component">
                  <CanvasComponent
                    component={child}
                    isSelected={false}
                    isResizing={false}
                    isPreviewMode={isPreviewMode}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    onStartResize={onStartResize}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                  />
                </div>
              ))
            ) : (
              <>
                <div className="flex-1 py-8 bg-gray-50 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Drop component here</span>
                </div>
                <div className="flex-1 py-8 bg-gray-50 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Drop component here</span>
                </div>
              </>
            )}
          </div>
        );
      default:
        return <div style={baseStyles}><span>{component.name} Component</span></div>;
    }
  };

  return (
    <div 
      onClick={(e) => onSelect(component, e)}
      className={`relative group ${isPreviewMode ? 'pointer-events-none' : ''}`}
    >
      {renderContent()}
      
      {!isPreviewMode && (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove(component.id);
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 text-gray-500 hover:text-red-500 z-10"
            style={{ display: isResizing ? 'none' : 'block' }}
          >
            &times;
          </button>
          
          <div 
            className={resizeHandleClasses}
            onMouseDown={(e) => onStartResize(component.id, e)}
            style={{ display: isResizing ? 'none' : 'block' }}
          ></div>
        </>
      )}
    </div>
  );
};

export default CanvasComponent;
