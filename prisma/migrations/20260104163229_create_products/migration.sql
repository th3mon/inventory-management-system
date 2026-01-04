/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "product_write" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "product_write_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_read" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "product_read_pkey" PRIMARY KEY ("id")
);
