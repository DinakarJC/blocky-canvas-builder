
import { useState } from "react";
import { Paintbrush, Settings, Layers } from "lucide-react";

const StylesTab = () => (
  <div className="p-4">
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Dimensions</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Width</label>
            <input type="text" className="w-full border border-input rounded-md h-8 px-2 text-sm" placeholder="100%" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Height</label>
            <input type="text" className="w-full border border-input rounded-md h-8 px-2 text-sm" placeholder="Auto" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Typography</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground">Font Family</label>
            <select className="w-full border border-input rounded-md h-8 px-2 text-sm">
              <option>Inter</option>
              <option>Roboto</option>
              <option>Open Sans</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Size</label>
              <input type="text" className="w-full border border-input rounded-md h-8 px-2 text-sm" placeholder="16px" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Weight</label>
              <select className="w-full border border-input rounded-md h-8 px-2 text-sm">
                <option>Regular</option>
                <option>Medium</option>
                <option>Bold</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Background</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Color</label>
            <div className="flex">
              <input type="color" className="border border-input rounded-l-md h-8 w-10" />
              <input type="text" className="w-full border border-input border-l-0 rounded-r-md h-8 px-2 text-sm" placeholder="#FFFFFF" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Image</label>
            <button className="w-full border border-input rounded-md h-8 px-2 text-sm">Add Image</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="p-4">
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Element Settings</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground">ID</label>
            <input type="text" className="w-full border border-input rounded-md h-8 px-2 text-sm" placeholder="element-id" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Class</label>
            <input type="text" className="w-full border border-input rounded-md h-8 px-2 text-sm" placeholder="element-class" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Attributes</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground">Link URL</label>
            <input type="text" className="w-full border border-input rounded-md h-8 px-2 text-sm" placeholder="https://" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Alt Text</label>
            <input type="text" className="w-full border border-input rounded-md h-8 px-2 text-sm" placeholder="Description" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Actions</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" id="action-click" className="mr-2" />
            <label htmlFor="action-click" className="text-xs">On Click</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="action-hover" className="mr-2" />
            <label htmlFor="action-hover" className="text-xs">On Hover</label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LayersTab = () => (
  <div className="p-4">
    <div className="space-y-1">
      <div className="bg-secondary rounded-md p-2 flex items-center justify-between">
        <span className="text-sm">Section</span>
        <span className="text-xs text-muted-foreground">1</span>
      </div>
      <div className="bg-white rounded-md p-2 pl-4 flex items-center justify-between border border-border">
        <span className="text-sm">Row</span>
        <span className="text-xs text-muted-foreground">1.1</span>
      </div>
      <div className="bg-white rounded-md p-2 pl-6 flex items-center justify-between border border-border">
        <span className="text-sm">Column</span>
        <span className="text-xs text-muted-foreground">1.1.1</span>
      </div>
      <div className="bg-white rounded-md p-2 pl-8 flex items-center justify-between border border-border">
        <span className="text-sm">Text</span>
        <span className="text-xs text-muted-foreground">1.1.1.1</span>
      </div>
      <div className="bg-white rounded-md p-2 pl-6 flex items-center justify-between border border-border">
        <span className="text-sm">Column</span>
        <span className="text-xs text-muted-foreground">1.1.2</span>
      </div>
      <div className="bg-white rounded-md p-2 pl-8 flex items-center justify-between border border-border">
        <span className="text-sm">Button</span>
        <span className="text-xs text-muted-foreground">1.1.2.1</span>
      </div>
    </div>
  </div>
);

export const PropertiesPanel = () => {
  const [activeTab, setActiveTab] = useState("styles");

  return (
    <div className="bg-white h-full border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm">Properties</h2>
      </div>
      <div className="flex border-b border-border">
        <button 
          className={`panel-tab ${activeTab === "styles" ? "active" : ""}`}
          onClick={() => setActiveTab("styles")}
        >
          <div className="flex items-center gap-1">
            <Paintbrush size={14} />
            <span>Styles</span>
          </div>
        </button>
        <button 
          className={`panel-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <div className="flex items-center gap-1">
            <Settings size={14} />
            <span>Settings</span>
          </div>
        </button>
        <button 
          className={`panel-tab ${activeTab === "layers" ? "active" : ""}`}
          onClick={() => setActiveTab("layers")}
        >
          <div className="flex items-center gap-1">
            <Layers size={14} />
            <span>Layers</span>
          </div>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === "styles" && <StylesTab />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "layers" && <LayersTab />}
      </div>
    </div>
  );
};

export default PropertiesPanel;
