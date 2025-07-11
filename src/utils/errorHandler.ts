
// Centralized error handling utility
export const handleError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  
  // You can extend this to send errors to a logging service
  // or show user-friendly error messages
  return {
    message: error?.message || 'An unexpected error occurred',
    code: error?.code || 'UNKNOWN_ERROR',
    context
  };
};

export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  context: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context);
    return fallback;
  }
};
