import { User } from "apps/wallet/src/entities/user.entity";
import { Wallet } from "apps/wallet/src/entities/wallet.entity";

export const startSeed = async (status: boolean) => {
    const userCount = await User.count()
    if (userCount === 0) createData(userCount)
    if (status && userCount > 0) {
        createData(userCount)
    }
}

const createData = async (count: number) => {
    const user = new User()
    user.name = `User #${count + 1}`
    await user.save()

    const wallet = new Wallet()
    wallet.user = user
    await wallet.save()
}