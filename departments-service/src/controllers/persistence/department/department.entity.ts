import { DepartmentData } from 'src/core/entities/department.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DepartmentAssign } from 'src/controllers/persistence/department-assign/department-assign.entity';

@Entity()
export class Department extends BaseEntity implements DepartmentData {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', unique: true })
  public name!: string;

  /*
   * One-To-Many Relationships
   */

  @OneToMany(
    () => DepartmentAssign,
    (departmentAssign) => departmentAssign.department,
  )
  public departmentAssign: DepartmentAssign[];
}
