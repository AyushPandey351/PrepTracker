import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

function AppModals({
  showModal,
  setShowModal,
  modalData,
  setModalData,
  saveNewTab,
  saveEditedTab,
  saveNewSubtopic,
  saveApplication
}) {
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(null)}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Add/Edit Tab Modal */}
            {(showModal === 'addTab' || showModal === 'editTab') && (
              <>
                <div className="modal-header">
                  <h3 className="modal-title">
                    {showModal === 'addTab' ? 'Add Category' : 'Edit Category'}
                  </h3>
                  <button className="modal-close" onClick={() => setShowModal(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Category name"
                      value={modalData.name || ''}
                      onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Icon</label>
                    <select
                      className="form-select"
                      value={modalData.icon || 'BookOpen'}
                      onChange={(e) => setModalData({ ...modalData, icon: e.target.value })}
                    >
                      <option value="BookOpen">Book</option>
                      <option value="Code2">Code</option>
                      <option value="Database">Database</option>
                      <option value="Layers">Layers</option>
                      <option value="Cpu">CPU</option>
                      <option value="FileCode">File Code</option>
                      <option value="Sparkles">Sparkles</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['#ff6b6b', '#4ecdc4', '#ffe66d', '#a78bfa', '#38bdf8', '#10b981', '#f59e0b'].map(color => (
                        <button
                          key={color}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: color,
                            border: modalData.color === color ? '3px solid white' : 'none',
                            cursor: 'pointer'
                          }}
                          onClick={() => setModalData({ ...modalData, color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={showModal === 'addTab' ? saveNewTab : saveEditedTab}
                  >
                    {showModal === 'addTab' ? 'Add Category' : 'Save Changes'}
                  </button>
                </div>
              </>
            )}

            {/* Add Topic Modal */}
            {showModal === 'addSubtopic' && (
              <>
                <div className="modal-header">
                  <h3 className="modal-title">Add Topic</h3>
                  <button className="modal-close" onClick={() => setShowModal(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Topic Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Dynamic Programming"
                      value={modalData.name || ''}
                      onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['#ff6b6b', '#4ecdc4', '#ffe66d', '#a78bfa', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'].map(color => (
                        <button
                          key={color}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: color,
                            border: modalData.color === color ? '3px solid white' : 'none',
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease'
                          }}
                          onClick={() => setModalData({ ...modalData, color })}
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={saveNewSubtopic}>
                    Add Topic
                  </button>
                </div>
              </>
            )}

            {/* Add Application Modal */}
            {showModal === 'addApplication' && (
              <>
                <div className="modal-header">
                  <h3 className="modal-title">Add Application</h3>
                  <button className="modal-close" onClick={() => setShowModal(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Company name"
                      value={modalData.company || ''}
                      onChange={(e) => setModalData({ ...modalData, company: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Job role"
                      value={modalData.role || ''}
                      onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={modalData.status || 'APPLIED'}
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="OFFERED">Offered</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={modalData.date || ''}
                      onChange={(e) => setModalData({ ...modalData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={saveApplication}>
                    Add Application
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AppModals;
