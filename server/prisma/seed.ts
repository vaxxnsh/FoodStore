import  { PrismaClient } from "@prisma/client"
import faker from "@faker-js/faker"
const prisma  = new PrismaClient()


async function main () {
    console.log("seeding")
    await prisma.item.create({
        data : {
            name : "Example item",          
            price : 6000 ,         
            stockQuantity : 7, 
            ItemsOnCart : {
                create : [
                    {
                        cartID : "exmaple id",
                        quantity : 2
                    }
                ]
            },   
        }
    })
}

main().catch(e => {
    console.log(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})