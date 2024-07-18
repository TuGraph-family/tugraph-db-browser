import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { useImmer } from 'use-immer';
import styles from '../../index.less';
import { createJsonEditor, createUrl, createWebSocket } from './utils';

let init = true;

export interface ISOGQLGraphEditorRef {
  getEditor: () => monaco.editor.IStandaloneCodeEditor | null;
  doFormat: () => void;
}

export type EditorProps = {
  initialValue?: string;
  isReadOnly?: boolean;
  width?: string | number;
  height?: string | number;
  onCreated?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onChange?: (content: string) => void;
  onSelectChange?: (
    content: string,
    selectionInfo: { start: number; end: number },
  ) => void;
  graphEditorRef?: React.MutableRefObject<ISOGQLGraphEditorRef | null>;
  createConfig?: monaco.editor.IStandaloneEditorConstructionOptions;
  graphId?: number;
  env?: API.GraphDeployEnvEnum;
  language?: 'ISOGQL' | 'Gremlin' | 'python' | 'json';
};

import { getEditorTotalCountByLineNumber } from '@/utils/getEditorTotalCountByLineNumber';
import {
  IReference,
  ITextFileEditorModel,
} from 'vscode/monaco';
import { EDITOR_PLACEHOLDER } from '../../constant';
import { initEditorPlaceholder } from '../../utils/initPlaceholder';

const proxyHostname = 'xxx';
export const ISOGQLEditor: React.FC<EditorProps> = forwardRef(
  ({
    initialValue,
    isReadOnly,
    width,
    height,
    onCreated,
    onChange,
    onSelectChange,
    graphEditorRef,
    graphId,
    env,
  }) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
    const ref = createRef<HTMLDivElement>();
    const [state, setState] = useImmer<{
      codeEditor: monaco.editor.IStandaloneCodeEditor | null;
      modelRef: IReference<ITextFileEditorModel> | null;
    }>({
      codeEditor: null,
      modelRef: null,
    });
    const { codeEditor } = state;

    useEffect(() => {
      let lspWebSocket: WebSocket;

      const currentEditor = editorRef.current;

      if (ref.current !== null) {
        const start = async () => {
          const { editor, modelRef } = await createJsonEditor({
            htmlElement: ref.current!,
            content: initialValue || '',
            init,
          });
          setState((draft) => {
            draft.codeEditor = editor;
            draft.modelRef = modelRef;
          });
          onCreated?.(editor);
          initEditorPlaceholder({
            editor,
            editorInitialValue: initialValue,
            placeholderId: 'isogqlEditorPlaceholder',
          });
          if (onChange) {
            editor.onDidChangeModelContent(() => onChange(editor.getValue()));
          }
          if (onSelectChange) {
            editor.onDidChangeCursorSelection(() => {
              const selection = editor.getSelection();
              const selected = editor
                .getModel()
                ?.getValueInRange(selection as monaco.IRange);
              const start = getEditorTotalCountByLineNumber(
                selection?.startLineNumber,
                editor as any,
              );
              onSelectChange(selected || '', {
                start: start + (selection?.startColumn || 0),
                end: start + (selection?.endColumn || 0),
              });
            });
          }
          if (init) {
            init = false;
          }

          const url = createUrl(proxyHostname, `/ws/${graphId}/${env}`);
          lspWebSocket = createWebSocket(url);
        };
        start();

        return () => {
          currentEditor?.dispose();
        };
      }

      return () => {
        // On component unmount, close web socket connection
        lspWebSocket?.close();
      };
    }, []);
    const getEditor = () => {
      return codeEditor;
    };
    const doFormat = (): Promise<boolean> => {
      if (!codeEditor) {
        return Promise.resolve(false);
      }
      const selection = codeEditor.getSelection();
      const hasSelection = selection && !selection.isEmpty();
      const action = codeEditor.getAction(
        hasSelection
          ? 'editor.action.formatSelection'
          : 'editor.action.formatDocument',
      );
      if (action) {
        return new Promise((resolve, reject) => {
          action.run().then(
            () => {
              resolve(true);
            },
            (err: Error) => {
              reject(err);
            },
          );
        });
      }
      return Promise.reject(new Error('format not support'));
    };

    useEffect(() => {
      codeEditor?.updateOptions({
        readOnly: isReadOnly,
      });
    }, [isReadOnly]);

    useImperativeHandle(graphEditorRef, () => {
      return {
        getEditor,
        doFormat,
      };
    });

    return (
      <div
        ref={ref}
        style={{ height, width: width || '100%' }}
        className={styles.editor}
      >
        <div
          id="isogqlEditorPlaceholder"
          className={styles['editor-placeholder']}
        >
          {EDITOR_PLACEHOLDER}
        </div>
      </div>
    );
  },
);

export default ISOGQLEditor;
