export const getEditorTotalCountByLineNumber = (
  lineNumber?: number,
  editor?: monaco.editor.IStandaloneCodeEditor,
) => {
  if (!lineNumber || !editor) {
    return 0;
  }
  let count = 0;
  for (let i = 1; i < lineNumber; i++) {
    count = count + (editor?.getModel()?.getLineLength(i) || 0) + 1;
  }
  return count;
};