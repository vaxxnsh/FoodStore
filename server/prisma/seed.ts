import  { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
const prisma  = new PrismaClient()


async function main () {
    const randomCartID = faker.string.uuid()
for(let i =0; i<100; i++) {
    await prisma.item.create({
        data : {
            name: faker.commerce.productName(), 
            price: parseFloat(faker.commerce.price()), 
            stockQuantity: faker.number.int({ min: 1, max: 100 }), 
            ItemsOnCart : {
                create : [
                    {
                        cartID : randomCartID,
                        quantity : faker.number.int({ min: 1, max: 10 })
                    }
                ]
            },   
        }
    })
}

}

main().catch(e => {
    console.log(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})