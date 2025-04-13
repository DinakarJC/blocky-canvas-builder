
import React, { useState } from "react";
import { Code, Copy, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface CodeExporterProps {
  components: any[];
}

export const CodeExporter = ({ components }: CodeExporterProps) => {
  const [copied, setCopied] = useState(false);

  const generateReactCode = () => {
    if (!components.length) return "// No components to export";

    let imports = `import React from 'react';\n`;
    imports += `import { Button } from '@/components/ui/button';\n\n`;

    const generateComponentCode = (component: any) => {
      switch (component.type.toLowerCase()) {
        case 'text':
          return `<p style={${JSON.stringify(component.styles)}}>${component.content}</p>`;
        case 'button':
          return `<Button style={${JSON.stringify(component.styles)}}>${component.content}</Button>`;
        case 'image':
          return `<img src="${component.content}" alt="${component.attributes?.alt || 'Image'}" style={${JSON.stringify(component.styles)}} />`;
        case 'link':
          return `<a href="${component.attributes?.href || '#'}" target="${component.attributes?.target || ''}" style={${JSON.stringify(component.styles)}}>${component.content}</a>`;
        case 'section':
          return `<section style={${JSON.stringify(component.styles)}} className="w-full">
  <div className="py-4 flex items-center justify-center bg-gray-50">
    <span className="text-sm text-gray-500">Section</span>
  </div>
</section>`;
        case 'row':
          return `<div style={${JSON.stringify(component.styles)}} className="flex flex-row w-full gap-4">
  <div className="flex-1 py-8 bg-gray-50 flex items-center justify-center">
    <span className="text-sm text-gray-500">Column 1</span>
  </div>
  <div className="flex-1 py-8 bg-gray-50 flex items-center justify-center">
    <span className="text-sm text-gray-500">Column 2</span>
  </div>
</div>`;
        case 'column':
        case 'container':
        case 'form':
        case 'input':
        case 'video':
        case 'map':
        default:
          return `<div style={${JSON.stringify(component.styles)}}>${component.name} Component</div>`;
      }
    };

    let componentCode = components.map(comp => generateComponentCode(comp)).join('\n  ');

    const fullCode = `const ExportedComponent = () => {
  return (
    <div className="w-full space-y-4">
      ${componentCode}
    </div>
  );
};

export default ExportedComponent;
`;

    return imports + fullCode;
  };

  const generateHTMLCode = () => {
    if (!components.length) return "<!-- No components to export -->";
    
    let htmlCode = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Exported Page</title>\n  <style>\n    body { font-family: system-ui, sans-serif; margin: 0; padding: 0; }\n    .container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 1rem; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n";
    
    const generateHTMLComponent = (component: any) => {
      const styleString = Object.entries(component.styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
      
      switch (component.type.toLowerCase()) {
        case 'text':
          return `    <p style="${styleString}">${component.content}</p>`;
        case 'button':
          return `    <button style="${styleString}">${component.content}</button>`;
        case 'image':
          return `    <img src="${component.content}" alt="${component.attributes?.alt || 'Image'}" style="${styleString}" />`;
        case 'link':
          return `    <a href="${component.attributes?.href || '#'}" target="${component.attributes?.target || ''}" style="${styleString}">${component.content}</a>`;
        case 'section':
          return `    <section style="${styleString}">
      <div style="padding: 1rem; display: flex; align-items: center; justify-content: center; background-color: #f9fafb;">
        <span style="font-size: 0.875rem; color: #6b7280;">Section</span>
      </div>
    </section>`;
        case 'row':
          return `    <div style="${styleString}; display: flex; width: 100%; gap: 1rem;">
      <div style="flex: 1; padding: 2rem; background-color: #f9fafb; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 0.875rem; color: #6b7280;">Column 1</span>
      </div>
      <div style="flex: 1; padding: 2rem; background-color: #f9fafb; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 0.875rem; color: #6b7280;">Column 2</span>
      </div>
    </div>`;
        default:
          return `    <div style="${styleString}">${component.name} Component</div>`;
      }
    };
    
    htmlCode += components.map(comp => generateHTMLComponent(comp)).join('\n') + '\n  </div>\n</body>\n</html>';
    
    return htmlCode;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = (code: string, fileType: string) => {
    const fileName = fileType === "react" ? "ExportedComponent.jsx" : "exported_page.html";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${fileName} downloaded`);
  };

  const reactCode = generateReactCode();
  const htmlCode = generateHTMLCode();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Code size={16} />
          <span>Export Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Export Code</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="react">
          <TabsList className="mb-4">
            <TabsTrigger value="react">React Component</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="react" className="relative">
            <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-sm"><code>{reactCode}</code></pre>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => handleCopyCode(reactCode)}>
                <Copy size={16} className="mr-1" /> {copied ? "Copied!" : "Copy"}
              </Button>
              <Button variant="default" size="sm" onClick={() => handleDownloadCode(reactCode, "react")}>
                <Download size={16} className="mr-1" /> Download
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="html" className="relative">
            <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-sm"><code>{htmlCode}</code></pre>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => handleCopyCode(htmlCode)}>
                <Copy size={16} className="mr-1" /> {copied ? "Copied!" : "Copy"}
              </Button>
              <Button variant="default" size="sm" onClick={() => handleDownloadCode(htmlCode, "html")}>
                <Download size={16} className="mr-1" /> Download
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CodeExporter;
