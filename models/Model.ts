import ApiError from './ApiError';

export default interface Model extends ApiError {
    id?: string;
    createdAt?: Date;
    updateAt?: Date;
    deletedAt?: Date;
}
