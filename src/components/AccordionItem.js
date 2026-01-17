import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import {
  Bold,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  FileCode,
  GripVertical,
  Image,
  Italic,
  Link2,
  List,
  Loader2,
  PenTool,
  Plus,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { imagesApi } from '../services/api';

// Accordion Item Component (for individual questions)
function AccordionItem({ item, isOpen, isEditing, onToggle, onToggleComplete, onUpdate, onDelete, onEdit, isNested = false, dragHandleProps = {} }) {
  const [content, setContent] = useState(item.content);
  const [code, setCode] = useState(item.code);
  const [codeLanguage, setCodeLanguage] = useState(item.codeLanguage);
  const [title, setTitle] = useState(item.title);
  const [showPreview, setShowPreview] = useState(true);
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showCode, setShowCode] = useState(!!item.code); // Show if there's existing code
  const textareaRef = React.useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    setContent(item.content);
    setCode(item.code);
    setCodeLanguage(item.codeLanguage);
    setTitle(item.title);
  }, [item]);

  const loadImages = useCallback(async () => {
    try {
      const imgs = await imagesApi.getByItemId(item.id);
      setImages(imgs);
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  }, [item.id]);

  // Load images when image section is shown
  useEffect(() => {
    if (isOpen && item.id && showImages) {
      loadImages();
    }
  }, [isOpen, item.id, showImages, loadImages]);

  // Show images section if there are existing images
  useEffect(() => {
    if (isOpen && item.id) {
      imagesApi.getByItemId(item.id).then(imgs => {
        if (imgs && imgs.length > 0) {
          setImages(imgs);
        }
      }).catch(() => {});
    }
  }, [isOpen, item.id]);

  const handleImageUpload = async (files, embedInNote = true) => {
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadedImages = [];
      for (const file of files) {
        const uploaded = await imagesApi.upload(file, item.id);
        uploadedImages.push(uploaded);
      }
      await loadImages();

      // Embed images in the note at cursor position
      if (embedInNote && uploadedImages.length > 0) {
        const markdownImages = uploadedImages
          .map(img => `![${img.originalFileName}](${imagesApi.getImageUrl(img.fileName)})`)
          .join('\n');

        // Insert at cursor position
        const pos = cursorPosition || content.length;
        const before = content.substring(0, pos);
        const after = content.substring(pos);
        const newContent = before + (before.endsWith('\n') || before === '' ? '' : '\n') + markdownImages + '\n' + after;

        setContent(newContent);
        // Auto-save after embedding
        setTimeout(() => {
          onUpdate({ content: newContent });
        }, 100);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Insert an existing image from gallery into the note
  const insertImageInNote = (img) => {
    const markdown = `![${img.originalFileName}](${imagesApi.getImageUrl(img.fileName)})`;
    const pos = cursorPosition || content.length;
    const before = content.substring(0, pos);
    const after = content.substring(pos);
    const newContent = before + (before.endsWith('\n') || before === '' ? '' : '\n') + markdown + '\n' + after;

    setContent(newContent);
    // Auto-save after embedding
    setTimeout(() => {
      onUpdate({ content: newContent });
    }, 100);
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await imagesApi.delete(imageId);
      await loadImages();
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles = [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    if (imageFiles.length > 0) {
      handleImageUpload(imageFiles);
    }
  };

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
        {/* Drag Handle */}
        <div className="drag-handle" {...dragHandleProps}>
          <GripVertical size={14} />
        </div>

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
                  <div className="editor-divider" />
                  <button
                    className={`editor-btn ${showImages ? 'active' : ''}`}
                    onClick={() => setShowImages(!showImages)}
                    title="Toggle Images"
                  >
                    <Image size={16} />
                  </button>
                  <button
                    className={`editor-btn ${showCode ? 'active' : ''}`}
                    onClick={() => setShowCode(!showCode)}
                    title="Toggle Code Snippet"
                  >
                    <FileCode size={16} />
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
                      ref={textareaRef}
                      className="editor-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onBlur={handleSave}
                      onSelect={(e) => setCursorPosition(e.target.selectionStart)}
                      onClick={(e) => setCursorPosition(e.target.selectionStart)}
                      onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
                      placeholder="Write your notes in markdown..."
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Image Upload Section - Toggle */}
              <AnimatePresence>
                {showImages && (
                  <motion.div
                    className="image-upload-container"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    onPaste={handlePaste}
                  >
                    <div className="image-upload-header">
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <Image size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                        Images & GIFs
                      </span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <label className="image-upload-btn">
                          <Upload size={14} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                          />
                        </label>
                        <button
                          className="section-close-btn"
                          onClick={() => setShowImages(false)}
                          title="Hide images section"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Drop Zone */}
                    <div
                      className={`image-drop-zone ${dragActive ? 'active' : ''} ${uploadingImage ? 'uploading' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {uploadingImage ? (
                        <div className="upload-progress">
                          <Loader2 className="spinning" size={24} />
                          <span>Uploading...</span>
                        </div>
                      ) : images.length === 0 ? (
                        <div className="drop-zone-placeholder">
                          <Image size={32} style={{ opacity: 0.5 }} />
                          <p>Drag & drop images here, or paste from clipboard</p>
                          <span className="drop-hint">Supports PNG, JPG, GIF, WebP</span>
                        </div>
                      ) : (
                        <div className="image-gallery">
                          {images.map((img) => (
                            <div key={img.id} className="image-item">
                              <img
                                src={imagesApi.getImageUrl(img.fileName)}
                                alt={img.originalFileName}
                                loading="lazy"
                              />
                              <div className="image-overlay">
                                <span className="image-name">{img.originalFileName}</span>
                                <div className="image-actions">
                                  <button
                                    className="image-insert-btn"
                                    onClick={() => insertImageInNote(img)}
                                    title="Insert in note"
                                  >
                                    <Plus size={14} />
                                  </button>
                                  <button
                                    className="image-delete-btn"
                                    onClick={() => handleDeleteImage(img.id)}
                                    title="Delete image"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Add more button */}
                          <label className="image-add-more">
                            <Plus size={24} />
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                              onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Code Block - Toggle */}
              <AnimatePresence>
                {showCode && (
                  <motion.div
                    className="code-block-container"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="code-block-header">
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <FileCode size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                        Code Snippet
                      </span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                        <button
                          className="section-close-btn"
                          onClick={() => setShowCode(false)}
                          title="Hide code section"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <Editor
                      value={code || ''}
                      onValueChange={(newCode) => setCode(newCode)}
                      onBlur={handleSave}
                      highlight={(code) => {
                        const lang = codeLanguage === 'cpp' ? 'cpp' : codeLanguage;
                        if (Prism.languages[lang]) {
                          return Prism.highlight(code || '', Prism.languages[lang], lang);
                        }
                        return code || '';
                      }}
                      padding={14}
                      placeholder="// Add your code here..."
                      className="code-editor-container"
                      textareaClassName="code-editor-textarea"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.85rem',
                        lineHeight: '1.7',
                        minHeight: '600px',
                        background: '#030508',
                        borderRadius: '0 0 10px 10px',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AccordionItem;
