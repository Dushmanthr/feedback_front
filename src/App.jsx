import { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function FeedbackCollector() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'https://feedback-back-nrf3.onrender.com/api';

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${API_URL}/feedbacks`);
      if (!response.ok) throw new Error('Failed to fetch feedbacks');
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setMessage('Error loading feedbacks');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/feedbacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, comment })
      });
      
      if (!response.ok) throw new Error('Failed to submit feedback');
      
      const data = await response.json();
      setFeedbacks([data, ...feedbacks]);
      setName('');
      setComment('');
      setMessage('Feedback submitted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setMessage('Error submitting feedback');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <MessageSquare className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Feedback Collector</h1>
          <p className="text-gray-600">Share your thoughts with us</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submit Feedback</h2>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="Share your feedback..."
              />
            </div>
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Feedback</h2>
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No feedback yet. Be the first to share!</p>
            ) : (
              feedbacks.map((feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{feedback.name}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{feedback.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}