import { CrudOptions, CrudRequest } from '@dataui/crud';
import { SortDto } from './dto/app.dto';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { plainToClass } from 'class-transformer';

const AppUtils = {
  mapperObjectToArray(input: any): any[] {
    if (Array.isArray(input)) {
      return input;
    } else {
      return [input];
    }
  },

  generateRandomInt(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1)) + from;
  },

  mapperSortOptions(input: any): SortDto[] {
    return this.mapperObjectToArray(input).map((sortString) => {
      const sortObject = JSON.parse(sortString);
      return plainToClass(SortDto, {
        orderBy: String(sortObject.orderBy),
        order: String(sortObject.order),
      });
    });
  },

  capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  getValueByKey<T extends Record<string, any>>(obj: T, key: string): any {
    return obj[key] ?? undefined;
  },

  generateBaseCrudOptions<T = any>(): CrudOptions {
    const crudOptions: CrudOptions = {
      model: {
        type: {} as T,
      },
      query: {
        join: {},
      },
    };
    return crudOptions;
  },

  generateBaseCrudRequest<T>({
    crudOptions,
    page,
    count,
    sortOptions,
  }: {
    crudOptions?: CrudOptions;
    page?: number;
    count?: number;
    sortOptions?: string[] | string | SortDto | SortDto[];
  }): CrudRequest {
    const crudRequest: CrudRequest = {
      parsed: {
        search: {
          $and: [],
        },
        join: [],
        fields: [],
        sort: [],
        page: page || 1,
        limit: count || 0,
        paramsFilter: [],
        authPersist: {},
        classTransformOptions: undefined,
        filter: [],
        or: [],
        offset: 0,
        cache: 0,
        includeDeleted: 0,
      },
      options: crudOptions || generateBaseCrudOptions<T>(),
    };

    if (sortOptions) {
      if (Array.isArray(sortOptions)) {
        const sortOptionList = sortOptions.map((sort: string | SortDto) => {
          if (typeof sort === 'string') {
            return JSON.parse(sort);
          } else {
            return sort;
          }
        });
        crudRequest.parsed.sort.push(
          ...sortOptionList.map((sortOptionObject) => ({
            field: sortOptionObject.field,
            order: sortOptionObject.order as 'ASC' | 'DESC',
          })),
        );
      } else {
        const sortOptionObject =
          typeof sortOptions === 'string'
            ? JSON.parse(sortOptions)
            : sortOptions;
        crudRequest.parsed.sort.push({
          field: sortOptionObject.field,
          order: sortOptionObject.order as 'ASC' | 'DESC',
        });
      }
    }

    return crudRequest;
  },

  autoGenerateJoinsRelationShip({
    crudRequest,
    crudOptions,
    joinPath,
    selectedFields,
    eagerFields,
  }: {
    crudRequest: CrudRequest;
    crudOptions: CrudOptions;
    joinPath: string;
    selectedFields?: { [key: string]: string[] };
    eagerFields?: { [key: string]: boolean };
  }) {
    const joins = autoGenerateJoinsFieldAndAliasFromPath({
      joinPath,
      selectedFields,
      eagerFields,
    });
    addJoinsRelationShip({ crudRequest, crudOptions, joins });
  },

  autoGenerateSlug({
    input,
    isTimeStampUsed = true,
    isUuidUsed = false,
  }: {
    input: string;
    isTimeStampUsed?: boolean;
    isUuidUsed?: boolean;
  }): string {
    let baseSlug = slugify(input, { lower: true, replacement: '-' });
    if (isTimeStampUsed) {
      const genValue: number = Date.now();
      baseSlug = baseSlug ? `${baseSlug}-${genValue}` : String(genValue);
    }

    if (isUuidUsed) {
      const genValue: string = v4();
      baseSlug = baseSlug ? `${baseSlug}-${genValue}` : String(genValue);
    }

    return baseSlug;
  },
};

export default AppUtils;

function generateBaseCrudOptions<T = any>(): CrudOptions {
  const crudOptions: CrudOptions = {
    model: {
      type: {} as T,
    },
    query: {
      join: {},
    },
  };
  return crudOptions;
}

function addJoinTable({
  crudRequest,
  tables,
}: {
  crudRequest: CrudRequest;
  tables: {
    field: string;
    on?: any;
    select?: any;
  }[];
}): CrudRequest {
  const joinMap = new Map(
    crudRequest.parsed.join.map((join) => [join.field, join]),
  );

  tables.forEach(({ field, on, select }) => {
    joinMap.set(field, { field, on, select });
  });

  crudRequest.parsed.join = Array.from(joinMap.values());

  return crudRequest;
}

function addJoinsRelationShip({
  crudRequest,
  crudOptions,
  joins,
}: {
  crudRequest: CrudRequest;
  crudOptions: CrudOptions;
  joins: {
    field: string;
    alias: string;
    eager?: boolean;
    selectedFields?: string[];
  }[];
}) {
  joins.forEach(({ field, alias, eager, selectedFields }) => {
    Object.assign(crudOptions.query.join, {
      [field]: {
        eager: eager || false,
        alias,
        allow: selectedFields || [],
      },
    });
  });

  addJoinTable({
    crudRequest,
    tables: joins.map(({ field }) => ({ field })),
  });

  crudRequest.options = crudOptions;
}

function autoGenerateJoinsFieldAndAliasFromPath({
  joinPath,
  selectedFields,
  eagerFields,
}: {
  joinPath: string;
  selectedFields?: { [key: string]: string[] };
  eagerFields?: { [key: string]: boolean };
}): {
  field: string;
  alias: string;
  eager?: boolean;
  selectedFields?: string[];
}[] {
  const splitArray = joinPath.split('.');
  let fieldStr = '';
  let aliasStr = '';
  const joins = [] as {
    field: string;
    alias: string;
    eager?: boolean;
    selectedFields?: string[];
  }[];
  for (let i = 0; i < splitArray.length; i += 1) {
    if (i === 0) {
      fieldStr = splitArray[0];
      aliasStr = splitArray[0];
    } else {
      fieldStr = fieldStr + '.' + splitArray[i];
      aliasStr = aliasStr + AppUtils.capitalizeFirstLetter(splitArray[i]);
    }
    const join: {
      field: string;
      alias: string;
      eager?: boolean;
      selectedFields?: string[];
    } = {
      field: fieldStr,
      alias: aliasStr,
      eager: eagerFields
        ? AppUtils.getValueByKey(eagerFields, fieldStr)
          ? AppUtils.getValueByKey(eagerFields, fieldStr)
          : false
        : false,
      selectedFields: selectedFields
        ? AppUtils.getValueByKey(selectedFields, fieldStr)
          ? AppUtils.getValueByKey(selectedFields, fieldStr)
          : []
        : [],
    };
    joins.push(join);
  }
  return joins;
}
