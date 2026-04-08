import toast from 'react-hot-toast';
import api from './api';
import userApi from './userApi';

// create poll api
export const createPoll = async (pollData) => {
  try {
    const payload = JSON.stringify({
      question: pollData.question,
      options: pollData.options.map(opt => ( opt.text))
    })
    const response = await api.post('/api/v1/poll', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        // toast.success("Poll created successfully!");
        await  userApi.fetchUserProfile();
        return response.data?.data || response.data;
      }

      return null;
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error(error.response?.data?.message || "Failed to create poll");
      return null;
    }
  };

// create vote with help of id 
export const voteOnPoll = async (pollId, optionId) => {
  try {
    const response = await api.post(`/api/v1/poll/${pollId}/vote/${optionId}`, '', {
      headers: {
        'accept': '*/*',
      },
    });

    if (response.status === 200) {
      toast.success("Vote submitted successfully!");
      return response.data?.data || response.data;
    }

    return null;
  } catch (error) {
    console.error('Error voting on poll:', error);
    toast.error(error.response?.data?.message || "Failed to submit vote");
    return null;
  }
};

// updating poll by id
export const updatePoll = async (pollId, pollData) => {
  try {
    const payload = JSON.stringify({
      question: pollData.question,
      options: pollData.options.map(opt => ({ answer: opt.text }))
    });
    
    const response = await api.put(`/api/v1/poll/${pollId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // toast.success("Poll updated successfully!");
      await userApi.fetchUserProfile();
      return response.data?.data || response.data;
    }

    return null;
  } catch (error) {
    console.error('Error updating poll:', error);
    toast.error(error.response?.data?.message || "Failed to update poll");
    return null;
  }
};

// get poll data through id
export const getPoll = async (pollId) => {
  try {
    const response = await api.get(`/api/v1/poll/${pollId}`);

    if (response.status === 200) {
      return response.data?.data || response.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching poll:', error);
    toast.error(error.response?.data?.message || "Failed to fetch poll");
    return null;
  }
};

// check poll status
export const togglePollStatus = async (pollId, enabled, showLoader, hideLoader) => {
  try {
    showLoader();
    const response = await api.put(`/api/v1/poll/${pollId}/status?enabled=${enabled}`, '', {
      headers: {
        'accept': '*/*',
      },
    });

    if (response.status === 200) {
      // const status = enabled ? 'enabled' : 'disabled';
      // toast.success(`Poll ${status} successfully!`);
      await userApi.fetchUserProfile();
      return response.data?.data || response.data;
    }

    return null;
  } catch (error) {
    console.error('Error toggling poll status:', error);
    toast.error(error.response?.data?.message || "Failed to toggle poll status");
    return null;
  } finally {
    hideLoader();
  }
};

// fetch poll analytics
export const getPollAnalytics = async () => {
  try {
    const response = await api.get('/api/v1/analytics/poll', {
      headers: {
        'accept': '*/*',
      },
    });

    if (response.status === 200) {
      return response.data?.data || response.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching poll analytics:', error);
    // toast.error(error.response?.data?.message || "Failed to fetch poll analytics");
    return null;
  }
};

// delete poll api
export const deletePoll = async () => {
  try {
    const response = await api.delete("/api/v1/poll");

    if (response.status === 200) {
      // toast.success("Poll deleted successfully!");
      await userApi.fetchUserProfile();
      return response.data?.data || response.data;
    }

    const data = await response.data?.data || response.data;
    console.log("Poll deleted:", data);
    return data;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
}

