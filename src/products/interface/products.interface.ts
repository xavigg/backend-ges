import { Brand } from "src/brands/entities/brand.entity";
import { Category } from "src/categories/entities/category.entity";
import { SearchOrderBy } from "src/shared/types/shared.types";

export interface ProductQuery {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    orderBy?: SearchOrderBy;
  }
  
  export interface ProductResponse {
    idproduct: number;
    name: string;
    price: number;
    details: string;
    warranty: number;
    img_url: string;
    idcategory: number;
    idbrand: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    category?: Category; // Opcional si usas relaciones
    brand?: Brand; // Opcional si usas relaciones
  }
  