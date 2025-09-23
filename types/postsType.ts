type PostsType = {
    id_postagem: string
    content: string
    created_at: string
    username: string
    id_user: string
    total_likes: string
    foto: string
    nome: string
    total_comments: number;
    alredyliked: boolean;
}

export type { PostsType }