
import { useState, useEffect } from "react";
import { Paintbrush, Settings, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ComponentIcon } from "./ComponentIcon";
import { Skeleton } from "./ui/skeleton";

// StylesTab component
interface StylesProps {
  selectedComponent: any;
  onUpdate: (updatedStyles: any) => void;
}

const StylesTab = ({ selectedComponent, onUpdate }: StylesProps) => {
  if (!selectedComponent) {
    return <div className="p-4 text-center text-muted-foreground">Select a component to edit its styles</div>;
  }

  const handleStyleChange = (property: string, value: string) => {
    const updatedComponent = {
      ...selectedComponent,
      styles: {
        ...selectedComponent.styles,
        [property]: value,
      }
    };
    onUpdate(updatedComponent);
  };

  const handleContentChange = (value: string) => {
    const updatedComponent = {
      ...selectedComponent,
      content: value
    };
    onUpdate(updatedComponent);
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* Content editor for text components */}
        {['text', 'button', 'link'].includes(selectedComponent.type.toLowerCase()) && (
          <div>
            <h3 className="text-sm font-medium mb-2">Content</h3>
            <Textarea 
              value={selectedComponent.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter content text"
              className="w-full"
            />
          </div>
        )}

        {/* Image URL for image components */}
        {selectedComponent.type.toLowerCase() === 'image' && (
          <div>
            <h3 className="text-sm font-medium mb-2">Image URL</h3>
            <input 
              type="text" 
              className="w-full border border-input rounded-md h-8 px-2 text-sm" 
              value={selectedComponent.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="https://example.com/image.jpg" 
            />
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-2">Dimensions</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Width</label>
              <input 
                type="text" 
                className="w-full border border-input rounded-md h-8 px-2 text-sm" 
                value={selectedComponent.styles.width} 
                onChange={(e) => handleStyleChange('width', e.target.value)}
                placeholder="100%" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Height</label>
              <input 
                type="text" 
                className="w-full border border-input rounded-md h-8 px-2 text-sm" 
                value={selectedComponent.styles.height} 
                onChange={(e) => handleStyleChange('height', e.target.value)}
                placeholder="Auto" 
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Typography</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">Font Family</label>
              <select 
                className="w-full border border-input rounded-md h-8 px-2 text-sm"
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                value={selectedComponent.styles.fontFamily || "Inter"}
              >
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>Playfair Display</option>
                <option>Montserrat</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Size</label>
                <input 
                  type="text" 
                  className="w-full border border-input rounded-md h-8 px-2 text-sm" 
                  value={selectedComponent.styles.fontSize} 
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  placeholder="16px" 
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Weight</label>
                <select 
                  className="w-full border border-input rounded-md h-8 px-2 text-sm"
                  value={selectedComponent.styles.fontWeight}
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                >
                  <option value="normal">Regular</option>
                  <option value="medium">Medium</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Text Align</label>
              <select 
                className="w-full border border-input rounded-md h-8 px-2 text-sm"
                value={selectedComponent.styles.textAlign || "left"}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Colors</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Text Color</label>
              <div className="flex">
                <input 
                  type="color" 
                  className="border border-input rounded-l-md h-8 w-10"
                  value={selectedComponent.styles.color}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                />
                <input 
                  type="text" 
                  className="w-full border border-input border-l-0 rounded-r-md h-8 px-2 text-sm"
                  value={selectedComponent.styles.color}
                  onChange={(e) => handleStyleChange('color', e.target.value)} 
                  placeholder="#000000" 
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Background</label>
              <div className="flex">
                <input 
                  type="color" 
                  className="border border-input rounded-l-md h-8 w-10"
                  value={selectedComponent.styles.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
                <input 
                  type="text" 
                  className="w-full border border-input border-l-0 rounded-r-md h-8 px-2 text-sm"
                  value={selectedComponent.styles.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} 
                  placeholder="#FFFFFF" 
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Spacing</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Padding</label>
              <input 
                type="text" 
                className="w-full border border-input rounded-md h-8 px-2 text-sm"
                value={selectedComponent.styles.padding}
                onChange={(e) => handleStyleChange('padding', e.target.value)} 
                placeholder="12px" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Margin</label>
              <input 
                type="text" 
                className="w-full border border-input rounded-md h-8 px-2 text-sm"
                value={selectedComponent.styles.margin}
                onChange={(e) => handleStyleChange('margin', e.target.value)}  
                placeholder="0px" 
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Border</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Radius</label>
              <input 
                type="text" 
                className="w-full border border-input rounded-md h-8 px-2 text-sm"
                value={selectedComponent.styles.borderRadius}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)} 
                placeholder="4px" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SettingsTab component
const SettingsTab = ({ selectedComponent, onUpdate }: StylesProps) => {
  if (!selectedComponent) {
    return <div className="p-4 text-center text-muted-foreground">Select a component to edit its settings</div>;
  }

  const handleAttributeChange = (key: string, value: string) => {
    const updatedComponent = {
      ...selectedComponent,
      attributes: {
        ...(selectedComponent.attributes || {}),
        [key]: value,
      }
    };
    onUpdate(updatedComponent);
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Element Settings</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">ID</label>
              <input 
                type="text" 
                className="w-full border border-input rounded-md h-8 px-2 text-sm" 
                placeholder="element-id" 
                value={selectedComponent.attributes?.id || ''}
                onChange={(e) => handleAttributeChange('id', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Class</label>
              <input 
                type="text" 
                className="w-full border border-input rounded-md h-8 px-2 text-sm" 
                placeholder="element-class" 
                value={selectedComponent.attributes?.className || ''}
                onChange={(e) => handleAttributeChange('className', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {selectedComponent.type.toLowerCase() === 'link' && (
          <div>
            <h3 className="text-sm font-medium mb-2">Link Settings</h3>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground">URL</label>
                <input 
                  type="text" 
                  className="w-full border border-input rounded-md h-8 px-2 text-sm" 
                  placeholder="https://" 
                  value={selectedComponent.attributes?.href || '#'}
                  onChange={(e) => handleAttributeChange('href', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="target-blank"
                  checked={selectedComponent.attributes?.target === '_blank'}
                  onCheckedChange={(checked) => 
                    handleAttributeChange('target', checked ? '_blank' : '')
                  }
                />
                <label htmlFor="target-blank" className="text-xs">Open in new tab</label>
              </div>
            </div>
          </div>
        )}
        
        {selectedComponent.type.toLowerCase() === 'image' && (
          <div>
            <h3 className="text-sm font-medium mb-2">Image Settings</h3>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground">Alt Text</label>
                <input 
                  type="text" 
                  className="w-full border border-input rounded-md h-8 px-2 text-sm" 
                  placeholder="Image description" 
                  value={selectedComponent.attributes?.alt || ''}
                  onChange={(e) => handleAttributeChange('alt', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        
        {selectedComponent.type.toLowerCase() === 'button' && (
          <div>
            <h3 className="text-sm font-medium mb-2">Button Settings</h3>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground">Button Type</label>
                <select 
                  className="w-full border border-input rounded-md h-8 px-2 text-sm"
                  value={selectedComponent.attributes?.type || 'button'}
                  onChange={(e) => handleAttributeChange('type', e.target.value)}
                >
                  <option value="button">Button</option>
                  <option value="submit">Submit</option>
                  <option value="reset">Reset</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface LayerItem {
  id: string;
  name: string;
  type: string;
  path?: string;
}

const LayersTab = ({ onSelectLayer, layers }: { onSelectLayer: (id: string) => void, layers: LayerItem[] }) => (
  <div className="p-4">
    <div className="space-y-1">
      {layers.length > 0 ? (
        layers.map((layer, index) => (
          <div 
            key={layer.id}
            className="bg-white rounded-md p-2 flex items-center justify-between border border-border hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectLayer(layer.id)}
          >
            <div className="flex items-center">
              <ComponentIcon type={layer.type} />
              <div className="ml-2">
                <span className="text-sm block">{layer.name}</span>
                {layer.path && <span className="text-xs text-muted-foreground">{layer.path}</span>}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{index + 1}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-muted-foreground py-4">
          No components on canvas
        </div>
      )}
    </div>
  </div>
);

export const PropertiesPanel = () => {
  const [activeTab, setActiveTab] = useState("styles");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for component selection events from Canvas
  useEffect(() => {
    const handleComponentSelected = (e: CustomEvent) => {
      setSelectedComponent(e.detail.component);
      setIsLoading(false);
    };

    const handleLayersUpdated = (e: CustomEvent) => {
      const { components } = e.detail;
      // Transform components into layer items
      const layerItems: LayerItem[] = components;
      setLayers(layerItems);
    };

    const handleTabRequest = (e: CustomEvent) => {
      if (e.detail.tab) {
        setActiveTab(e.detail.tab);
      }
    };

    window.addEventListener('component-selected' as any, handleComponentSelected as any);
    window.addEventListener('layers-updated' as any, handleLayersUpdated as any);
    window.addEventListener('styles-panel-requested' as any, handleTabRequest as any);
    
    return () => {
      window.removeEventListener('component-selected' as any, handleComponentSelected as any);
      window.removeEventListener('layers-updated' as any, handleLayersUpdated as any);
      window.removeEventListener('styles-panel-requested' as any, handleTabRequest as any);
    };
  }, []);

  // Update component in Canvas when styles are changed
  const handleComponentUpdate = (updatedComponent: any) => {
    setSelectedComponent(updatedComponent);
    
    // Broadcast the updated component to Canvas
    window.dispatchEvent(new CustomEvent('component-updated', { 
      detail: { component: updatedComponent } 
    }));
  };

  // Handle layer selection from layers panel
  const handleLayerSelect = (id: string) => {
    // Set loading state
    setIsLoading(true);
    
    // Request the component details from Canvas
    window.dispatchEvent(new CustomEvent('layer-selected', {
      detail: { id }
    }));
  };

  return (
    <div className="bg-white h-full border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm">Properties</h2>
        {selectedComponent && (
          <p className="text-xs text-muted-foreground mt-1">
            Editing: {selectedComponent.name}
          </p>
        )}
      </div>
      <div className="flex border-b border-border">
        <button 
          className={`panel-tab ${activeTab === "styles" ? "active bg-gray-100" : ""} flex-1 py-2 text-sm font-medium`}
          onClick={() => setActiveTab("styles")}
        >
          <div className="flex items-center justify-center gap-1">
            <Paintbrush size={14} />
            <span>Styles</span>
          </div>
        </button>
        <button 
          className={`panel-tab ${activeTab === "settings" ? "active bg-gray-100" : ""} flex-1 py-2 text-sm font-medium`}
          onClick={() => setActiveTab("settings")}
        >
          <div className="flex items-center justify-center gap-1">
            <Settings size={14} />
            <span>Settings</span>
          </div>
        </button>
        <button 
          className={`panel-tab ${activeTab === "layers" ? "active bg-gray-100" : ""} flex-1 py-2 text-sm font-medium`}
          onClick={() => setActiveTab("layers")}
        >
          <div className="flex items-center justify-center gap-1">
            <Layers size={14} />
            <span>Layers</span>
          </div>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            {activeTab === "styles" && <StylesTab selectedComponent={selectedComponent} onUpdate={handleComponentUpdate} />}
            {activeTab === "settings" && <SettingsTab selectedComponent={selectedComponent} onUpdate={handleComponentUpdate} />}
            {activeTab === "layers" && <LayersTab onSelectLayer={handleLayerSelect} layers={layers} />}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
