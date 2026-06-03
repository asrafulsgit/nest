import { Prisma } from '@prisma/client';

type QueryParams = Record<string, any>;

export class PrismaQueryBuilder<T = any> {
  private where: Prisma.Args<T, 'findMany'>['where'] = {};
  private orderBy: Prisma.Args<T, 'findMany'>['orderBy'] = {};
  private skip: number = 0;
  private take: number = 10;
  private queryParams: QueryParams = {};

  // Custom excluded fields (you can override this per entity)
  private excludedFields: string[] = [
    'searchTerm',
    'sortBy',
    'sortOrder',
    'page',
    'limit',
    'include',
    'select',
    // Add more global exclusions here
  ];

  constructor(queryParams: QueryParams) {
    this.queryParams = queryParams;
  }
  // Add custom excluded fields for specific use cases
  addExcludedFields(fields: string[]) {
    this.excludedFields.push(...fields);
    return this;
  }

  // Search across multiple fields with partial matching

  search(fields: string[]) {
    if (this.queryParams.searchTerm) {
      this.where = {
        ...this.where,
        OR: fields.map((field) => ({
          [field]: {
            contains: this.queryParams.searchTerm,
            mode: 'insensitive',
          },
        })),
      };
    }
    return this;
  }

  // Filter fields dynamically
  filter() {
    const filters = { ...this.queryParams };

    // Remove excluded fields
    this.excludedFields.forEach((field) => delete filters[field]);

    // Process each filter
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        let value: any = filters[key];

        // Type conversion
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (!isNaN(value) && value !== '') value = Number(value);

        this.where[key] = value;
      }
    });

    return this;
  }

  // range filtering
  numberRange(minField: string, maxField: string, targetField: string) {
    if (this.queryParams[minField] && this.queryParams[maxField]) {
      this.where[targetField] = {
        gte: Number(this.queryParams[minField]),
        lte: Number(this.queryParams[maxField]),
      };
    } else if (this.queryParams[minField]) {
      this.where[targetField] = {
        gte: Number(this.queryParams[minField]),
      };
    } else if (this.queryParams[maxField]) {
      this.where[targetField] = {
        lte: Number(this.queryParams[maxField]),
      };
    }
    return this;
  }

  // Sorting
  sort(
    defaultSortBy: string = 'createdAt',
    defaultSortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const sortBy = this.queryParams.sortBy || defaultSortBy;
    const sortOrder = this.queryParams.sortOrder || defaultSortOrder;

    this.orderBy = {
      [sortBy]: sortOrder,
    };

    return this;
  }

  // Pagination
  pagination() {
    const page = Number(this.queryParams.page) || 1;
    let limit = Number(this.queryParams.limit) || 10;

    const skip = (page - 1) * limit;

    this.skip = skip;
    this.take = limit;

    return this;
  }

  // Build final query
  build() {
    return {
      where: this.where,
      orderBy: this.orderBy,
      skip: this.skip,
      take: this.take,
    };
  }

  // Get pagination metadata helper
  getPaginationMeta(total: number) {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  }
}
