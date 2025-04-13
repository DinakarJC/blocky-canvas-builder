
import Toolbar from "@/components/Toolbar";
import ComponentsSidebar from "@/components/ComponentsSidebar";
import Canvas from "@/components/Canvas";
import PropertiesPanel from "@/components/PropertiesPanel";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Page Builder</h1>
        <p className="text-muted-foreground mb-6">
          This application is optimized for desktop use. Please open it on a larger screen.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <ComponentsSidebar />
        </div>
        <div className="flex-1 bg-gray-50 overflow-auto">
          <Canvas />
        </div>
        <div className="w-72 flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
