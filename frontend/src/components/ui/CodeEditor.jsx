import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme for code

export const CodeEditor = ({ code, setCode, language = 'javascript' }) => {
  return (
    <div className="w-full h-full min-h-[300px] bg-[#2d2d2d] rounded-xl border border-white/10 overflow-hidden flex flex-col">
      <div className="bg-[#1e1e1e] px-4 py-2 text-xs font-mono text-neutral-400 border-b border-white/5 flex justify-between items-center">
        <span>main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'java'}</span>
        <span className="px-2 py-1 bg-white/10 rounded">Code Editor</span>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language)}
          padding={15}
          style={{
            fontFamily: '"Fira Code", "JetBrains Mono", "Roboto Mono", monospace',
            fontSize: 14,
            minHeight: '100%',
            backgroundColor: 'transparent',
            color: '#fff',
          }}
          className="editor-container outline-none"
        />
      </div>
    </div>
  );
};
