import { Column, BaseEntity, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity'
import { Transaction } from './transaction.entity'

@Entity({ name: 'wallets' })
export class Wallet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @JoinColumn()
    @OneToOne(() => User)
    user: User

    @Column({ type: 'float', default: 0 })
    balance: number

    @OneToMany(() => Transaction, (transaction) => transaction.wallet)
    transactions: Transaction[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date
}