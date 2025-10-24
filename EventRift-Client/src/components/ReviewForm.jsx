import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ReviewForm = ({ eventId, onSubmit, onCancel }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [rating, setRating] = useState(5);

    const submitHandler = (data) => {
        // Prepare data with the selected rating and eventId
        const reviewData = {
            ...data,
            rating: rating,
            event_id: eventId,
            // user_id: (from Auth context)
        };
        onSubmit(reviewData);
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                onClick={() => setRating(star)}
                className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            {/* Rating Input */}
            <div>
                <label className="block text-sm font-medium text-er-light mb-1">Your Rating: ({rating}/5)</label>
                <div className="flex space-x-1">{renderStars()}</div>
            </div>

            {/* Comment Input */}
            <div>
                <label className="block text-sm font-medium text-er-light mb-1">Your Comments</label>
                <textarea
                    rows="3"
                    placeholder="Tell us about your experience..."
                    {...register('comment', { required: 'Review comment is required.' })}
                    className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
                />
                {errors.comment && <p className="text-red-400 text-sm mt-1">{errors.comment.message}</p>}
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-400 border border-gray-700 rounded hover:bg-gray-800 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-er-primary text-white font-semibold rounded hover:bg-pink-700 transition disabled:bg-gray-600"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;