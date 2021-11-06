import Model from './Model';

export default interface Project extends Model {
    name: string;
    isLiked: boolean;
    likeCount: number;
}
