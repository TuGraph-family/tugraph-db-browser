export const initEditorPlaceholder = (options: {
  editor: monaco.editor.IStandaloneCodeEditor;
  placeholderId: string;
  editorInitialValue?: string;
}) => {
  const { editor, placeholderId, editorInitialValue } = options;
  const placeholderDom = document.getElementById(placeholderId);
  const hidePlaceholder = () => {
    if (placeholderDom) {
      placeholderDom.style.display = 'none';
    }
  };
  const showPlaceholder = (value?: string) => {
    if (
      (value === '' || value === undefined || value === null) &&
      placeholderDom
    ) {
      placeholderDom.style.display = 'inline-block';
    }
  };

  showPlaceholder(editorInitialValue);
  editor.onDidBlurEditorWidget(() => {
    showPlaceholder(editor.getValue());
  });

  editor.onDidFocusEditorWidget(() => {
    hidePlaceholder();
  });
};
