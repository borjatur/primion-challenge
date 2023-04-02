import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DepartmentAssign } from './department-assign.entity';

@Entity()
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', unique: true })
  public name!: string;

  /*
   * One-To-Many Relationships
   */

  @OneToMany(() => DepartmentAssign, (departmentAssign) => departmentAssign.department)
  public departmentAssign: DepartmentAssign[];
}