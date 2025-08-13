export interface Product {
  id: number;
  imageUrl: string;
  name: string;
  count: number;
  size: {
    width: number;
    height: number;
  };
  weight: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  productId: number;
  description: string;
  date: string;
}

export interface ProductCreate {
  imageUrl: string;
  name: string;
  count: number;
  width: number;
  height: number;
  weight: string;
}

export interface CommentCreate {
  productId: number;
  description: string;
  date: string;
}

export interface ProductUpdate extends Partial<ProductCreate> {
  id: number;
}

export interface CommentUpdate extends Partial<CommentCreate> {
  id: number;
}
