import type { Request, Response } from 'express';
import type { CategoryListQuery } from '../schemas/category.schema.js';
import type { CategoryService } from '../services/category.service.js';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Función flecha: el router la recibe suelta y tiene que conservar el this.
  list = async (req: Request, res: Response) => {
    // validate ya reemplazó req.query por la consulta parseada (page y limit como números).
    const query = req.query as unknown as CategoryListQuery;
    res.json(await this.categoryService.list(query));
  };
}
