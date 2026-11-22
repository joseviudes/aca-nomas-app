import { toPage } from '../../../shared/pagination/pagination.js';
import type { CategoryRepository } from '../../../shared/ports/category.repository.js';
import type { CategoryListQuery, CategoryListResponse } from '../schemas/category.schema.js';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async list(query: CategoryListQuery): Promise<CategoryListResponse> {
    const { items, total } = await this.categoryRepository.findPage(query);
    return toPage(items, total, query);
  }
}
