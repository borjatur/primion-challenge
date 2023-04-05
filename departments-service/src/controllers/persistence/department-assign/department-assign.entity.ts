import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Department } from 'src/controllers/persistence/department/department.entity';

@Entity()
export class DepartmentAssign extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  /*
   * Relation IDs
   */

  @Column({ type: 'integer', unique: true })
  public userId!: number;

  /*
   * Many-To-One Relationships
   */

  @ManyToOne(() => Department, (department) => department.departmentAssign)
  public department: Department;
}
