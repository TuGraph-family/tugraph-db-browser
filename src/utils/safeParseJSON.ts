export const safeParseJSON = (jsonString?: string | null) => {
  if (!jsonString) {
    return {};
  }
  try {
    const obj = JSON.parse(jsonString);
    return obj;
  } catch (error) {
    console.error('Invalid JSON string:', error);
    return {};
  }
};
