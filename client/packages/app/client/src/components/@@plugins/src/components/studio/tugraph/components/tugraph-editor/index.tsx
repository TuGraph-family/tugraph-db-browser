import { EditorProvider, MonacoEnvironment } from '@alipay/e2-editor-core';
import { FunctionDetails } from '@alipay/e2-language-cypher';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';

const schemaData = {
  nodes: [
    {
      label: 'Person',
      properties: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'born',
          type: 'number',
        },
      ],
      primary: 'name',
    },
    {
      label: 'Movie',
      properties: [
        {
          name: 'tagline',
          type: 'string',
        },
        {
          name: 'votes',
          type: 'number',
        },
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'released',
          type: 'number',
        },
      ],
      primary: 'title',
    },
  ],
  edges: [
    {
      label: 'ACTED_IN',
      properties: [
        {
          name: 'roles',
          type: 'array',
        },
      ],
      primary: 'name',
      constraints: [['person', 'dog']],
    },
    {
      label: 'PRODUCED',
      properties: [],
      primary: 'name',
      constraints: [['person', 'movie']],
    },
    {
      label: 'DIRECTED',
      properties: [],
      primary: 'name',
      constraints: [['person', 'movie']],
    },
    {
      label: 'WROTE',
      properties: [],
      primary: 'name',
      constraints: [['person', 'movie']],
    },
  ],
};

interface Props {
  value: string;
  onCreated?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onChange?: (content: string) => void;
  isReadOnly?: boolean;
}
const Functions: FunctionDetails[] = [
  {
    name: 'customAddA',
    type: '自定义',
    signatures: [],
    desc: '这是用来AddA',
  },
  {
    name: 'customAddB',
    type: '自定义',
    signatures: [],
    desc: '这是用来AddB',
  },
  {
    name: 'customAddC',
    type: '自定义',
    signatures: [],
    desc: '这是用来AddC',
  },
];
const queryFunctions = () => {
  return Promise.resolve(Functions);
};

export const GraphEditor: React.FC<Props> = (props) => {
  const { onCreated, onChange, value, isReadOnly = false } = props;
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const [state, setState] = useImmer<{
    codeEditor: monaco.editor.IStandaloneCodeEditor | null;
  }>({
    codeEditor: null,
  });
  const { codeEditor } = state;

  useEffect(() => {
    MonacoEnvironment.init().then(async () => {
      if (editorRef && editorRef.current) {
        const editorProvider = MonacoEnvironment.container.get<EditorProvider>(EditorProvider);
        const editor = editorProvider.create(editorRef.current, {
          language: 'cypher',
          value,
          theme: 'cypherTheme',
          suggestLineHeight: 24,
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 20,
          folding: true,
          wordWrap: 'on',
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          readOnly: false,
          hover: {
            delay: 800,
          },
          suggestSelection: 'first',
          wordBasedSuggestions: false,
          suggest: { snippetsPreventQuickSuggestions: false },
          autoClosingQuotes: 'always',
          fixedOverflowWidgets: true,
          bracketPairColorization: { enabled: true },
        });
        setState((draft) => {
          draft.codeEditor = editor.codeEditor;
        });

        if (onCreated) {
          onCreated(editor.codeEditor);
        }

        if (onChange) {
          editor.codeEditor.onDidChangeModelContent(() => onChange(editor.codeEditor.getValue()));
        }
      }
    });

    return () => {
      if (codeEditor) {
        codeEditor.dispose();
      }
    };
  }, [editorRef]);

  useEffect(() => {
    codeEditor?.updateOptions({
      readOnly: isReadOnly,
    });
  }, [isReadOnly]);
  return (
    <>
      <div style={{ width: '100%', height: '100%' }} ref={editorRef} />
    </>
  );
};
