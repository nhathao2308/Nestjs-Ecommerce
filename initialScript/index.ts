import envConfig from 'src/shared/config'
import { RoleName } from 'src/shared/constants/role.constant'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()
const hashPass = new HashingService()

const main = async () => {
  const roleCount = await prisma.role.count()
  if (roleCount > 0) {
    throw new Error('Roles already exist.')
  }
  const roles = await prisma.role.createMany({
    data: [
      { name: RoleName.Admin, description: 'Admin role' },
      { name: RoleName.Client, description: 'Client role' },
      { name: RoleName.Seller, description: 'Seller role' },
    ],
  })

  const adminRole = await prisma.role.findFirstOrThrow({
    where: { name: RoleName.Admin },
  })

  const passwordHash = await hashPass.hash(envConfig.ADMIN_PASSWORD)

  const adminUser = await prisma.user.create({
    data: {
      name: envConfig.ADMIN_NAME,
      password: passwordHash,
      email: envConfig.ADMIN_EMAIL,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      roleId: adminRole.id,
    },
  })

  return { roles, adminUser }
}

main()
  .then(({ roles }) => {
    console.log(`Roles created: ${roles} }`)
  })
  .catch((error) => {
    console.error('Error during seeding:', error)
  })
