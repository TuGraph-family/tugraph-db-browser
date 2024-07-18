import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import { MonacoLanguageClient } from 'monaco-languageclient';
import isogqlFile from './tmp/model.ttf';

export type ExampleJsonEditor = {
  languageId: string;
  editor: monaco.editor.IStandaloneCodeEditor;
  uri: monaco.Uri;
  modelRef: IReference<ITextFileEditorModel>;
};

import {
  createConfiguredEditor,
  createModelReference,
  IReference,
  ITextFileEditorModel,
} from 'vscode/monaco';
import normalizeUrl from 'normalize-url';
import {
  CloseAction,
  ErrorAction,
  MessageTransports,
} from 'vscode-languageclient';
import {
  toSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from 'vscode-ws-jsonrpc';
import '../theme-defaults/theme-default';

export const createLanguageClient = (
  transports: MessageTransports,
): MonacoLanguageClient => {
  return new MonacoLanguageClient({
    name: 'ISOGQL Language Client',
    clientOptions: {
      documentSelector: ['isogql'],
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.Restart }),
      },
    },
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports);
      },
    },
  });
};

export const createUrl = (hostname: string, path: string): string => {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  return normalizeUrl(`${protocol}://${hostname}${path}`);
};

export const createWebSocket = (url: string): WebSocket => {
  const webSocket = new WebSocket(url);
  webSocket.onopen = () => {
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const languageClient = createLanguageClient({
      reader,
      writer,
    });
    languageClient.start();
    reader.onClose(() => {
      createWebSocket(url);
    });
  };
  return webSocket;
};

export const createJsonEditor = async (config: {
  htmlElement: HTMLElement;
  content: string;
  init: boolean;
}) => {
  const languageId = 'isogql';

  if (config.init === true) {
    // await initServices({
    //   enableThemeService: true,
    //   enableTextmateService: true,
    //   enableModelService: true,
    //   enableKeybindingsService: true,
    //   enableLanguagesService: true,
    //   enableOutputService: true,
    //   enableAccessibilityService: true,
    // });
  }

  monaco.languages.register({
    id: languageId,
    extensions: ['.isogql'],
    aliases: ['isogql'],
  });

  // create the model
  const uri = monaco.Uri.parse(isogqlFile);
  const modelRef = await createModelReference(uri);
  modelRef.object.setLanguageId(languageId);

  // create monaco editor
  const editor = createConfiguredEditor(config.htmlElement, {
    model: modelRef.object.textEditorModel,
    automaticLayout: true,
    snippetSuggestions: 'bottom',
    minimap: { enabled: false },
    fixedOverflowWidgets: true,
    autoClosingQuotes: 'always',
    lineNumbers: 'interval',
    lineNumbersMinChars: 0,
  });

  const result = {
    languageId,
    editor,
    uri,
    modelRef,
  } as ExampleJsonEditor;
  return Promise.resolve(result);
};
