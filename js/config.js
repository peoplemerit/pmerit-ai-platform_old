/**
 * Gabriel AI Educational Platform - Configuration
 * Backend integration placeholders and API endpoints
 */

// API Configuration
const API_CONFIG = {
    // Development endpoints (local)
    development: {
        baseURL: 'http://localhost:8000',
        endpoints: {
            auth: '/auth',
            users: '/users',
            courses: '/courses',
            assessments: '/assessments',
            chat: '/qa/process',
            progress: '/progress'
        }
    },
    
    // Production endpoints (Cloudflare Workers)
    production: {
        baseURL: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
        endpoints: {
            auth: '/auth',
            users: '/users',
            courses: '/courses',
            assessments: '/assessments',
            chat: '/qa/process',
            progress: '/progress'
        }
    },
    
    // Current environment
    environment: 'development' // Change to 'production' when ready
};

// Get current API configuration
function getAPIConfig() {
    return API_CONFIG[API_CONFIG.environment];
}

// API utility functions
const API = {
    // Base request function
    async request(endpoint, options = {}) {
        const config = getAPIConfig();
        const url = `${config.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        // Add authentication token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const finalOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    },
    
    // Authentication endpoints
    auth: {
        login: async (email, password) => {
            return API.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        },
        
        register: async (name, email, password) => {
            return API.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
        },
        
        logout: async () => {
            return API.request('/auth/logout', {
                method: 'POST'
            });
        }
    },
    
    // Chat/AI endpoints
    chat: {
        sendMessage: async (message, context = []) => {
            return API.request('/qa/process', {
                method: 'POST',
                body: JSON.stringify({ 
                    question: message,
                    context: context,
                    user_preferences: {
                        language: 'en',
                        learning_style: 'adaptive'
                    }
                })
            });
        }
    },
    
    // User endpoints
    users: {
        getProfile: async () => {
            return API.request('/users/profile');
        },
        
        updateProfile: async (profileData) => {
            return API.request('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
        }
    },
    
    // Course endpoints
    courses: {
        list: async () => {
            return API.request('/courses');
        },
        
        get: async (courseId) => {
            return API.request(`/courses/${courseId}`);
        },
        
        enroll: async (courseId) => {
            return API.request(`/courses/${courseId}/enroll`, {
                method: 'POST'
            });
        }
    },
    
    // Assessment endpoints
    assessments: {
        list: async () => {
            return API.request('/assessments');
        },
        
        submit: async (assessmentId, answers) => {
            return API.request(`/assessments/${assessmentId}/submit`, {
                method: 'POST',
                body: JSON.stringify({ answers })
            });
        }
    }
};

// Connection status checker
async function checkBackendConnection() {
    try {
        const config = getAPIConfig();
        const response = await fetch(`${config.baseURL}/health`);
        return response.ok;
    } catch (error) {
        console.log('Backend connection failed:', error);
        return false;
    }
}

// Export for use in other modules
window.API_CONFIG = API_CONFIG;
window.API = API;
window.checkBackendConnection = checkBackendConnection;

console.log('🔧 Backend integration config loaded');
