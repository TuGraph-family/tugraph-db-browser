import { SchemaProperty } from "@/types/services";

/* properties conversion  */
export const propertiesTranslator = (properties?: SchemaProperty[]) => {
    const newProperties = {};
  
    properties?.forEach(item => {
      newProperties[item.name] = {
        schemaType: item?.type,
      };
    });
  
    return newProperties;
  };
  