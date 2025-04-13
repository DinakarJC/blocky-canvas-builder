
import { useState } from "react";

export const Canvas = () => {
  const [droppedComponents, setDroppedComponents] = useState<any[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData('component');
    
    if (componentData) {
      try {
        const component = JSON.parse(componentData);
        setDroppedComponents([...droppedComponents, component]);
      } catch (error) {
        console.error("Failed to parse dropped component:", error);
      }
    }
  };

  return (
    <div 
      className="canvas-area relative p-8"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {droppedComponents.length > 0 ? (
        <div className="w-full">
          {droppedComponents.map((component, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md mb-4 bg-white">
              <div className="flex items-center gap-2">
                {component.icon && <div>{component.icon}</div>}
                <span>{component.name} Component</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg mb-2">Drop components here</p>
          <p className="text-sm">Drag elements from the sidebar to build your page</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
