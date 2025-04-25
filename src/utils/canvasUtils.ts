
import { DroppedComponent } from "@/types/canvas";

export const getDefaultContent = (type: string): string => {
  switch(type.toLowerCase()) {
    case 'text':
      return 'This is a sample text. Click to edit.';
    case 'button':
      return 'Button';
    case 'link':
      return 'Link';
    case 'image':
      return 'https://via.placeholder.com/300x200';
    default:
      return '';
  }
};

export const findComponentById = (components: DroppedComponent[], id: string): DroppedComponent | null => {
  for (const comp of components) {
    if (comp.id === id) return comp;
    
    if (comp.children && comp.children.length > 0) {
      const found = findComponentById(comp.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const removeComponentById = (components: DroppedComponent[], id: string): DroppedComponent[] => {
  const filteredComponents = components.filter(comp => comp.id !== id);
  
  return filteredComponents.map(comp => {
    if (comp.children && comp.children.length > 0) {
      return {
        ...comp,
        children: removeComponentById(comp.children, id)
      };
    }
    return comp;
  });
};

export const updateComponentById = (components: DroppedComponent[], updatedComponent: DroppedComponent): DroppedComponent[] => {
  return components.map(comp => {
    if (comp.id === updatedComponent.id) {
      return updatedComponent;
    } else if (comp.children && comp.children.length > 0) {
      return {
        ...comp,
        children: updateComponentById(comp.children, updatedComponent)
      };
    }
    return comp;
  });
};

export const addChildToParent = (components: DroppedComponent[], parentId: string, newChild: DroppedComponent): DroppedComponent[] => {
  return components.map(comp => {
    if (comp.id === parentId) {
      return {
        ...comp,
        children: [...(comp.children || []), newChild]
      };
    } else if (comp.children && comp.children.length > 0) {
      return {
        ...comp,
        children: addChildToParent(comp.children, parentId, newChild)
      };
    } else {
      return comp;
    }
  });
};

export const flattenComponents = (components: DroppedComponent[], parentNames: string[] = []): any[] => {
  let result: any[] = [];
  
  components.forEach(comp => {
    const path = [...parentNames, comp.name];
    result.push({
      id: comp.id,
      name: comp.name,
      type: comp.type,
      path: path.join(' > ')
    });
    
    if (comp.children && comp.children.length > 0) {
      result = [...result, ...flattenComponents(comp.children, path)];
    }
  });
  
  return result;
};
