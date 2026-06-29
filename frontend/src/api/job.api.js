import api from './axios';

export const jobApi = {
  createJob: async (data) => {
    const response = await api.post('/jobs', data);
    return response.data;
  },
  
  getMyJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },

  analyzeMatch: async (resumeId, jobId) => {
    const response = await api.post('/jobs/analyze', { resumeId, jobId });
    return response.data;
  }
};
