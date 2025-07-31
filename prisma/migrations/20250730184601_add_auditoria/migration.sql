/*
  Warnings:

  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Cuenta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Empresa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transaccion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fecha` on the `Transaccion` table. All the data in the column will be lost.
  - Changed the type of `moneda` on the `Cuenta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Transaccion` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `estado` on the `Transaccion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `moneda` on the `Transaccion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransaccionEstado" AS ENUM ('APROBADA', 'FALLIDO', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "TransaccionMoneda" AS ENUM ('PEN', 'USD');

-- DropForeignKey
ALTER TABLE "Cuenta" DROP CONSTRAINT "Cuenta_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Transaccion" DROP CONSTRAINT "Transaccion_cuentaId_fkey";

-- DropForeignKey
ALTER TABLE "Transaccion" DROP CONSTRAINT "Transaccion_empresaId_fkey";

-- AlterTable
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Cliente_id_seq";

-- AlterTable
ALTER TABLE "Cuenta" DROP CONSTRAINT "Cuenta_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clienteId" SET DATA TYPE TEXT,
DROP COLUMN "moneda",
ADD COLUMN     "moneda" "TransaccionMoneda" NOT NULL,
ADD CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Cuenta_id_seq";

-- AlterTable
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Empresa_id_seq";

-- AlterTable
ALTER TABLE "Transaccion" DROP CONSTRAINT "Transaccion_pkey",
DROP COLUMN "fecha",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "estado",
ADD COLUMN     "estado" "TransaccionEstado" NOT NULL,
ALTER COLUMN "cuentaId" SET DATA TYPE TEXT,
DROP COLUMN "moneda",
ADD COLUMN     "moneda" "TransaccionMoneda" NOT NULL,
ALTER COLUMN "empresaId" DROP DEFAULT,
ALTER COLUMN "empresaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Transaccion_id_seq";

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "detalle" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
