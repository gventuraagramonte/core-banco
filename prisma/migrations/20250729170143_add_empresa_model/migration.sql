/*
  Warnings:

  - You are about to drop the column `empresa` on the `Transaccion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaccion" DROP COLUMN "empresa",
ADD COLUMN     "empresaId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_ruc_key" ON "Empresa"("ruc");

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
