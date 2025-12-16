export const sendSuccess = (res, status = 200, payload = {}) => {
    return res.status(status).json(payload);
};
export const sendError = (next, error) => {
    const err = error instanceof Error ? error : new Error(String(error));
    next(err);
};

