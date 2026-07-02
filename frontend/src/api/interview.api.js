import api from './axios';

export const interviewApi = {
  startSession: async (data) => {
    const response = await api.post('/interviews/start', data);
    return response.data;
  },

  getNextQuestion: async (sessionId) => {
    const response = await api.get(`/interviews/${sessionId}/next-question`);
    return response.data;
  },

  submitAnswer: async (sessionId, questionId, answerText) => {
    const response = await api.post(`/interviews/${sessionId}/answer`, { questionId, answerText });
    return response.data;
  },

  analyzeSession: async (sessionId) => {
    const response = await api.post(`/interviews/${sessionId}/analyze`);
    return response.data;
  },

  getFeedback: async (sessionId) => {
    const response = await api.get(`/interviews/${sessionId}/feedback`);
    return response.data;
  },

  endInterviewEarly: async (sessionId) => {
    const response = await api.post(`/interviews/${sessionId}/end-early`);
    return response.data;
  }
};
