import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import {
  ChevronDown, Check, Trash2, Edit3, Bold, Italic, List, Link2,
  FileCode, Eye, PenTool
} from 'lucide-react';

function AccordionItem({ item, isOpen, isEditing, onToggle, onToggleComplete, onUpdate, onDelete, onEdit, isNested = false }) {
  const [content, setContent] = useState(item.content);
  const [code, setCode] = useState(item.code);
  const [codeLanguage, setCodeLanguage] = useState(item.codeLanguage);
  const [title, setTitle] = useState(item.title);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setContent(item.content);
    setCode(item.code);
    setCodeLanguage(item.codeLanguage);
    setTitle(item.title);
  }, [item]);

  const handleSave = () => {
    onUpdate({ content, code, codeLanguage, title });
  };

  // Smooth accordion animation variants
  const accordionVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.25, ease: "easeOut" }
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.35, delay: 0.1, ease: "easeIn" }
      }
    }
  };

  const contentVariants = {
    collapsed: {
      y: -10,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    expanded: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.35, delay: 0.15, ease: "easeOut" }
    }
  };

  const chevronVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  };

  return (
    <motion.div
      className={`accordion-item ${item.completed ? 'completed' : ''} ${isOpen ? 'open' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      layout="position"
    >
      <div className="accordion-header">
        <label className="accordion-checkbox" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={item.completed}
            onChange={onToggleComplete}
          />
          <motion.span 
            className="checkmark"
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Check size={14} />
          </motion.span>
        </label>

        {isEditing && isOpen ? (
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, padding: '8px 12px' }}
          />
        ) : (
          <span className="accordion-title" onClick={onToggle}>{item.title}</span>
        )}

        <div className="accordion-actions">
          <motion.button 
            className="nav-action-btn" 
            onClick={onEdit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit3 size={14} />
          </motion.button>
          <motion.button 
            className="nav-action-btn delete" 
            onClick={onDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={14} />
          </motion.button>
        </div>

        <motion.button 
          className="accordion-toggle" 
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            variants={chevronVariants}
            initial="collapsed"
            animate={isOpen ? "expanded" : "collapsed"}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="accordion-body"
            variants={accordionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <motion.div 
              className="accordion-content"
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <div className="editor-container">
                <div className="editor-toolbar">
                  <button
                    className={`editor-btn ${!showPreview ? 'active' : ''}`}
                    onClick={() => setShowPreview(false)}
                    title="Edit"
                  >
                    <PenTool size={16} />
                  </button>
                  <button
                    className={`editor-btn ${showPreview ? 'active' : ''}`}
                    onClick={() => setShowPreview(true)}
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <div className="editor-divider" />
                  <button className="editor-btn" onClick={() => setContent(content + '\n## ')} title="Heading">
                    <Bold size={16} />
                  </button>
                  <button className="editor-btn" onClick={() => setContent(content + '*italic*')} title="Italic">
                    <Italic size={16} />
                  </button>
                  <button className="editor-btn" onClick={() => setContent(content + '\n- ')} title="List">
                    <List size={16} />
                  </button>
                  <button className="editor-btn" onClick={() => setContent(content + '[link](url)')} title="Link">
                    <Link2 size={16} />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {showPreview ? (
                    <motion.div 
                      key="preview"
                      className="markdown-preview"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </motion.div>
                  ) : (
                    <motion.textarea
                      key="editor"
                      className="editor-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onBlur={handleSave}
                      placeholder="Write your notes in markdown..."
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Code Block */}
              <motion.div 
                className="code-block-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="code-block-header">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <FileCode size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    Code Snippet
                  </span>
                  <select
                    className="code-language-select"
                    value={codeLanguage}
                    onChange={(e) => {
                      setCodeLanguage(e.target.value);
                      onUpdate({ codeLanguage: e.target.value });
                    }}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="cpp">C++</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <textarea
                  className="code-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onBlur={handleSave}
                  placeholder="// Add your code here..."
                  spellCheck={false}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AccordionItem;

