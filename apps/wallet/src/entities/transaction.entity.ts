import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Generated, BaseEntity } from 'typeorm'
import { Wallet } from './wallet.entity'
import { User } from './user.entity'

@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('float')
    amount: number

    @Column({ type: 'enum', enum: ['pending', 'increased', 'decreased', 'error'], default: 'pending' })
    status: string

    @Column({ type: 'uuid', unique: true })
    @Generated("uuid")
    referenceId: string

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    wallet: Wallet

    @ManyToOne(() => User, (user) => user.transactions)
    user: User

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date
}