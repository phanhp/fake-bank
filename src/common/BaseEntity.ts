import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import { CUSTOM_COLUMN_KEY } from './decorator/CustomColumn';
import { pick } from 'lodash';
/**
 * Base entity for all entities. It contains common fields and without the field 'custom'
 */
@Entity()
export class BaseEntity {
  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @BeforeInsert()
  onInsert() {
    let customData = {};

    // Parse normal custom data
    const metaInfo = Reflect.getMetadata(CUSTOM_COLUMN_KEY, this);
    if (metaInfo) {
      const keys = Object.values<string>(metaInfo);
      customData = { ...customData, ...pick(this, keys) };
      if (this.custom) {
        customData = { ...this.custom, ...customData };
      }
    }
    this.custom = customData;
  }

  @BeforeUpdate()
  onUpdate() {
    const metaInfo = Reflect.getMetadata(CUSTOM_COLUMN_KEY, this);
    if (metaInfo && Object.keys(metaInfo).length > 0) {
      const keys = Object.values<string>(metaInfo);
      const customData = pick(this, keys);
      this.custom = { ...this.custom, ...customData };
    }
  }

  @AfterLoad()
  loadEntity() {
    const metaInfo = Reflect.getMetadata(CUSTOM_COLUMN_KEY, this);
    if (metaInfo && Object.keys(metaInfo).length > 0) {
      const customKeys = Object.keys(metaInfo);
      for (const name of Object.values<string>(customKeys)) {
        this[name] = this.custom[name];
      }
    }
  }

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  custom: any;
}
