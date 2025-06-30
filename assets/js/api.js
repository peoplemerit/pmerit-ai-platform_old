/**
 * API Communication Module for Gabriel AI
 * Handles all backend communication and data management
 */

// API Configuration
const API_CONFIG = {
    endpoints: {
        production: 'https://gabriel-ai-backend.peoplemerit.workers.dev',
        development: 'http://localhost:8000'
    },
    timeout: 10000,
    retries: 2,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'PMERIT-Gabriel-AI/1.0'
    }
};

// API State
let apiState = {
    currentEndpoint: null,
    isOnline: false,
    lastHealthCheck: null,
    requestCount: 0,
    errorCount: 0
};

/**
 * Make API request with retry logic and error handling
 */
async function makeAPIRequest(endpoint, data, options = {}) {
    const requestOptions = {
        method: 'POST',
        headers: { ...API_CONFIG.headers, ...options.headers },
        body: JSON.stringify(data),
        timeout: options.timeout || API_CONFIG.timeout
    };

    let lastError;
    
    for (let attempt = 0; attempt <= API_CONFIG.retries; attempt++) {
        try {
            apiState.requestCount++;
            
            const response = await fetchWithTimeout(endpoint, requestOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            lastError = error;
            apiState.errorCount++;
            
            console.warn(`API request attempt ${attempt + 1} failed:`, error.message);
            
            // Don't retry on certain errors
            if (error.name === 'AbortError' || error.message.includes('401') || error.message.includes('403')) {
                break;
            }
            
            // Exponential backoff for retries
            if (attempt < API_CONFIG.retries) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }
    
    throw lastError;
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Health check for API endpoints
 */
async function healthCheck(endpoint) {
    try {
        const startTime = Date.now();
        
        const response = await makeAPIRequest(`${endpoint}/health`, {
            timestamp: Date.now(),
            version: APP_CONFIG.version
        }, { timeout: 5000 });
        
        const latency = Date.now() - startTime;
        
        return {
            success: true,
            latency,
            endpoint,
            timestamp: new Date().toISOString(),
            data: response
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            endpoint,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Discover and connect to best available endpoint
 */
async function discoverEndpoint() {
    updateStatus('🔍 Discovering educational services...', 'connecting');
    
    const endpoints = [
        API_CONFIG.endpoints.production,
        API_CONFIG.endpoints.development
    ];
    
    const healthChecks = await Promise.allSettled(
        endpoints.map(endpoint => healthCheck(endpoint))
    );
    
    // Find the best working endpoint
    let bestEndpoint = null;
    let bestLatency = Infinity;
    
    healthChecks.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
            if (result.value.latency < bestLatency) {
                bestLatency = result.value.latency;
                bestEndpoint = endpoints[index];
            }
        }
    });
    
    if (bestEndpoint) {
        apiState.currentEndpoint = bestEndpoint;
        apiState.isOnline = true;
        apiState.lastHealthCheck = Date.now();
        
        const endpointType = bestEndpoint.includes('localhost') ? 'Local' : 'Cloud';
        updateStatus(`✅ Connected to ${endpointType} Services (${bestLatency}ms)`, 'working');
        
        return true;
    } else {
        apiState.isOnline = false;
        updateStatus('📚 Offline Mode - Demo responses available', 'info');
        return false;
    }
}

/**
 * Educational Q&A API call
 */
async function processEducationalQuery(question, context = {}) {
    if (!apiState.isOnline || !apiState.currentEndpoint) {
        throw new Error('No connection available');
    }
    
    const requestData = {
        question: question.trim(),
        context: {
            conversation_history: context.history || [],
            user_preferences: {
                language: appState.language || 'en',
                learning_style: context.learningStyle || 'adaptive',
                difficulty_level: context.difficultyLevel || 'intermediate'
            },
            session_info: {
                timestamp: new Date().toISOString(),
                session_id: context.sessionId || generateSessionId(),
                platform: 'web'
            }
        },
        options: {
            max_length: 500,
            temperature: 0.7,
            focus: 'educational',
            safe_content: true
        }
    };
    
    try {
        const response = await makeAPIRequest(
            `${apiState.currentEndpoint}/qa/process`,
            requestData
        );
        
        return {
            success: true,
            answer: response.answer || response.response || response.message,
            confidence: response.confidence || 0.8,
            sources: response.sources || [],
            suggestions: response.suggestions || [],
            learning_resources: response.learning_resources || []
        };
    } catch (error) {
        console.error('Educational query failed:', error);
        throw error;
    }
}

/**
 * Personality assessment submission
 */
async function submitPersonalityAssessment(assessmentData) {
    if (!apiState.isOnline || !apiState.currentEndpoint) {
        return { success: false, error: 'Offline mode - assessment saved locally' };
    }
    
    try {
        const response = await makeAPIRequest(
            `${apiState.currentEndpoint}/personality/submit`,
            {
                assessment_type: assessmentData.type,
                responses: assessmentData.responses,
                user_info: {
                    session_id: assessmentData.sessionId,
                    timestamp: new Date().toISOString(),
                    language: appState.language
                }
            }
        );
        
        return {
            success: true,
            results: response.results,
            recommendations: response.recommendations,
            learning_path: response.learning_path
        };
    } catch (error) {
        console.error('Assessment submission failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get course recommendations
 */
async function getCourseRecommendations(preferences = {}) {
    if (!apiState.isOnline || !apiState.currentEndpoint) {
        return getOfflineCourseRecommendations(preferences);
    }
    
    try {
        const response = await makeAPIRequest(
            `${apiState.currentEndpoint}/courses/recommend`,
            {
                user_preferences: preferences,
                filters: {
                    level: preferences.level || 'beginner',
                    track: preferences.track || 'all',
                    duration: preferences.duration || 'flexible'
                }
            }
        );
        
        return {
            success: true,
            recommendations: response.courses || [],
            learning_paths: response.learning_paths || [],
            next_steps: response.next_steps || []
        };
    } catch (error) {
        console.error('Course recommendation failed:', error);
        return getOfflineCourseRecommendations(preferences);
    }
}

/**
 * Offline course recommendations fallback
 */
function getOfflineCourseRecommendations(preferences) {
    const recommendations = {
        technology: [
            { title: 'Web Development Fundamentals', duration: '8 weeks', level: 'beginner' },
            { title: 'Introduction to Cloud Computing', duration: '6 weeks', level: 'intermediate' },
            { title: 'Data Analysis with Python', duration: '10 weeks', level: 'intermediate' }
        ],
        business: [
            { title: 'Project Management Essentials', duration: '6 weeks', level: 'beginner' },
            { title: 'Digital Marketing Strategy', duration: '8 weeks', level: 'intermediate' },
            { title: 'Excel for Business Analytics', duration: '4 weeks', level: 'beginner' }
        ],
        creative: [
            { title: 'Graphic Design Principles', duration: '6 weeks', level: 'beginner' },
            { title: 'Content Creation Strategy', duration: '8 weeks', level: 'intermediate' },
            { title: 'UI/UX Design Fundamentals', duration: '10 weeks', level: 'intermediate' }
        ]
    };
    
    const track = preferences.track || 'technology';
    return {
        success: true,
        recommendations: recommendations[track] || recommendations.technology,
        learning_paths: [`${track.charAt(0).toUpperCase() + track.slice(1)} Learning Path`],
        next_steps: ['Take a personality assessment', 'Set learning goals', 'Join study groups']
    };
}

/**
 * User progress tracking
 */
async function updateUserProgress(progressData) {
    if (!apiState.isOnline || !apiState.currentEndpoint) {
        // Store locally for now
        localStorage.setItem('userProgress', JSON.stringify(progressData));
        return { success: true, stored: 'locally' };
    }
    
    try {
        const response = await makeAPIRequest(
            `${apiState.currentEndpoint}/progress/update`,
            {
                user_id: progressData.userId || 'anonymous',
                progress: progressData,
                timestamp: new Date().toISOString()
            }
        );
        
        return { success: true, data: response };
    } catch (error) {
        // Fallback to local storage
        localStorage.setItem('userProgress', JSON.stringify(progressData));
        return { success: true, stored: 'locally', error: error.message };
    }
}

/**
 * Generate session ID
 */
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get API statistics
 */
function getAPIStats() {
    return {
        endpoint: apiState.currentEndpoint,
        isOnline: apiState.isOnline,
        requestCount: apiState.requestCount,
        errorCount: apiState.errorCount,
        successRate: apiState.requestCount > 0 ? 
            ((apiState.requestCount - apiState.errorCount) / apiState.requestCount * 100).toFixed(1) + '%' : 
            'N/A',
        lastHealthCheck: apiState.lastHealthCheck ? 
            new Date(apiState.lastHealthCheck).toLocaleString() : 
            'Never'
    };
}

/**
 * Periodic health monitoring
 */
function startHealthMonitoring() {
    setInterval(async () => {
        if (apiState.currentEndpoint && apiState.isOnline) {
            const health = await healthCheck(apiState.currentEndpoint);
            if (!health.success) {
                console.warn('Health check failed, attempting reconnection...');
                await discoverEndpoint();
            }
        }
    }, 300000); // Check every 5 minutes
}

// Initialize API system
document.addEventListener('DOMContentLoaded', function() {
    discoverEndpoint();
    startHealthMonitoring();
});

// Export API functions
window.processEducationalQuery = processEducationalQuery;
window.submitPersonalityAssessment = submitPersonalityAssessment;
window.getCourseRecommendations = getCourseRecommendations;
window.updateUserProgress = updateUserProgress;
window.getAPIStats = getAPIStats;
window.discoverEndpoint = discoverEndpoint;
