const getBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // If we're accessing via IP (like on an iPad), use that same IP for the backend
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:8080/api`;
  }
  
  return 'http://localhost:8080/api';
};

const API_BASE_URL = getBaseUrl();

// Helper function for API calls
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ============ TABS API ============
export const tabsApi = {
  getAll: () => fetchApi('/tabs'),
  
  getAllWithData: () => fetchApi('/tabs/with-data'),
  
  getById: (id) => fetchApi(`/tabs/${id}`),
  
  getWithData: (id) => fetchApi(`/tabs/${id}/with-data`),
  
  getProgress: (id) => fetchApi(`/tabs/${id}/progress`),
  
  getTabsWithSubtopics: () => fetchApi('/tabs/with-subtopics'),
  
  create: (tab) => fetchApi('/tabs', {
    method: 'POST',
    body: JSON.stringify(tab),
  }),
  
  update: (id, tab) => fetchApi(`/tabs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tab),
  }),
  
  delete: (id) => fetchApi(`/tabs/${id}`, {
    method: 'DELETE',
  }),
};

// ============ SUBTOPICS API ============
export const subtopicsApi = {
  getByTabId: (tabId) => fetchApi(`/subtopics/tab/${tabId}`),
  
  getWithItemsByTabId: (tabId) => fetchApi(`/subtopics/tab/${tabId}/with-items`),
  
  getById: (id) => fetchApi(`/subtopics/${id}`),
  
  getWithItems: (id) => fetchApi(`/subtopics/${id}/with-items`),
  
  getProgress: (id) => fetchApi(`/subtopics/${id}/progress`),
  
  create: (subtopic) => fetchApi('/subtopics', {
    method: 'POST',
    body: JSON.stringify(subtopic),
  }),
  
  update: (id, subtopic) => fetchApi(`/subtopics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subtopic),
  }),
  
  delete: (id) => fetchApi(`/subtopics/${id}`, {
    method: 'DELETE',
  }),
  
  reorder: (updates) => fetchApi('/subtopics/reorder', {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
};

// ============ ITEMS API ============
export const itemsApi = {
  getAll: () => fetchApi('/items'),
  
  getById: (id) => fetchApi(`/items/${id}`),
  
  getByTabId: (tabId) => fetchApi(`/items/tab/${tabId}`),
  
  getBySubtopicId: (subtopicId) => fetchApi(`/items/subtopic/${subtopicId}`),
  
  create: (item) => fetchApi('/items', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  
  update: (id, item) => fetchApi(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  
  toggleCompletion: (id) => fetchApi(`/items/${id}/toggle`, {
    method: 'PATCH',
  }),
  
  delete: (id) => fetchApi(`/items/${id}`, {
    method: 'DELETE',
  }),
  
  reorder: (updates) => fetchApi('/items/reorder', {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
};

// ============ CHECKLIST API ============
export const checklistApi = {
  getAll: () => fetchApi('/checklist'),
  
  getById: (id) => fetchApi(`/checklist/${id}`),
  
  create: (item) => fetchApi('/checklist', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  
  update: (id, item) => fetchApi(`/checklist/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  
  toggle: (id) => fetchApi(`/checklist/${id}/toggle`, {
    method: 'PATCH',
  }),
  
  delete: (id) => fetchApi(`/checklist/${id}`, {
    method: 'DELETE',
  }),
};

// ============ APPLICATIONS API ============
export const applicationsApi = {
  getAll: () => fetchApi('/applications'),
  
  getById: (id) => fetchApi(`/applications/${id}`),
  
  getByStatus: (status) => fetchApi(`/applications/status/${status}`),
  
  search: (company) => fetchApi(`/applications/search?company=${encodeURIComponent(company)}`),
  
  create: (application) => fetchApi('/applications', {
    method: 'POST',
    body: JSON.stringify(application),
  }),
  
  update: (id, application) => fetchApi(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(application),
  }),
  
  updateStatus: (id, status) => fetchApi(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  delete: (id) => fetchApi(`/applications/${id}`, {
    method: 'DELETE',
  }),
};

// ============ ACTIVITY LOG API ============
export const activityApi = {
  getAll: () => fetchApi('/activity'),
  
  getByDate: (date) => fetchApi(`/activity/date/${date}`),
  
  getByDateRange: (startDate, endDate) => 
    fetchApi(`/activity/range?startDate=${startDate}&endDate=${endDate}`),
  
  getByTabId: (tabId) => fetchApi(`/activity/tab/${tabId}`),
  
  create: (activity) => fetchApi('/activity', {
    method: 'POST',
    body: JSON.stringify(activity),
  }),
  
  delete: (id) => fetchApi(`/activity/${id}`, {
    method: 'DELETE',
  }),
};

// ============ DASHBOARD API ============
export const dashboardApi = {
  getStats: () => fetchApi('/dashboard/stats'),
  
  exportAll: () => fetchApi('/dashboard/export'),
};

// ============ CACHE API ============
export const cacheApi = {
  clearAll: () => fetchApi('/cache', { method: 'DELETE' }),
  
  clear: (cacheName) => fetchApi(`/cache/${cacheName}`, { method: 'DELETE' }),
};

// ============ IMAGES API ============
export const imagesApi = {
  // Get image URL for display
  getImageUrl: (fileName) => `${API_BASE_URL}/images/${fileName}`,
  
  // Get all images for an item
  getByItemId: (itemId) => fetchApi(`/images/item/${itemId}`),
  
  // Upload single image
  upload: async (file, itemId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('itemId', itemId);
    
    const url = `${API_BASE_URL}/images/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `Upload failed: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Upload multiple images
  uploadMultiple: async (files, itemId) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    formData.append('itemId', itemId);
    
    const url = `${API_BASE_URL}/images/upload-multiple`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `Upload failed: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Delete an image
  delete: (imageId) => fetchApi(`/images/${imageId}`, {
    method: 'DELETE',
  }),
};

// ============ HEALTH API ============
export const healthApi = {
  ping: () => fetchApi('/ping'),
  health: () => fetchApi('/health'),
};

// Named export for default
const api = {
  tabs: tabsApi,
  subtopics: subtopicsApi,
  items: itemsApi,
  checklist: checklistApi,
  applications: applicationsApi,
  activity: activityApi,
  dashboard: dashboardApi,
  cache: cacheApi,
  images: imagesApi,
  health: healthApi,
};

export default api;

