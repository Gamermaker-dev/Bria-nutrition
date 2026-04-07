export type Response<T> = Promise<{
    status: number;
    data?: T;
    message?: string;
}>;

export type ResponseCheck = {
    status: number;
    message?: string;
}