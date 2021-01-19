import { Category } from '../common/interfaces';

export const generateCategoryMap = (categories: Category[]) => new Map(categories.map((category: Category) => [category.id, category.name]));

export const getCategoryNameList = (categories: Map<number, string>, ids: number[]) => ids.map(id => categories.get(id) || '');;