import { ApiError } from "./custom_error.js";

export function asyncHandler(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error(error.message);
            const statusCode = error.statusCode || 500;
            next(new ApiError(error.message || "Internal Server Error", statusCode));
        }
    };
}
