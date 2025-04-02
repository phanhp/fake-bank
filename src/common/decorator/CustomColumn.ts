import 'reflect-metadata';

export const CUSTOM_COLUMN_KEY = Symbol('CUSTOM_COLUMN_KEY');

export function CustomColumn(name?: string): PropertyDecorator {
  return (target, propertyKey) => {
    const metaInfo = Reflect.getMetadata(CUSTOM_COLUMN_KEY, target) || {};

    metaInfo[propertyKey] = name ?? propertyKey;

    Reflect.defineMetadata(CUSTOM_COLUMN_KEY, metaInfo, target);
  };
}
