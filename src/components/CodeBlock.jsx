import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './CodeBlock.module.css'

/**
 * VS Code 风格的代码块，带行号、语法高亮和复制按钮
 * @param {string} code - 代码内容
 * @param {string} language - 语言：javascript, jsx, bash, json 等
 */
export default function CodeBlock({ code, language = 'javascript' }) {
  const trimmed = typeof code === 'string' ? code.trimEnd() : ''
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(trimmed)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 降级：部分环境无 clipboard API
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.copyBtn}
        onClick={handleCopy}
        title={copied ? '已复制' : '复制代码'}
        aria-label={copied ? '已复制' : '复制代码'}
      >
        {copied ? (
          <span className={styles.copyText}>已复制</span>
        ) : (
          <svg className={styles.copyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          lineHeight: 1.6,
        }}
        lineNumberStyle={{
          minWidth: '2.25em',
          paddingRight: '1em',
          color: '#858585',
          userSelect: 'none',
        }}
      >
        {trimmed}
      </SyntaxHighlighter>
    </div>
  )
}
