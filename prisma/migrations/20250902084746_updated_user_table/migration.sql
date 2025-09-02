/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('VENDOR', 'CUSTOMER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "adminId" INTEGER,
ADD COLUMN     "customerId" INTEGER,
ADD COLUMN     "role" "public"."Role" NOT NULL,
ADD COLUMN     "vendorId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Vendor" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "category" TEXT,
    "subcategory" TEXT,
    "business_register" TEXT NOT NULL,
    "pan_card" BOOLEAN NOT NULL DEFAULT false,
    "GST_no" TEXT,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "long" DOUBLE PRECISION,
    "landmark" TEXT,
    "adhar_front" TEXT,
    "adhar_back" TEXT,
    "pan_card_image" TEXT,
    "gst_certificate" TEXT,
    "shop_license" TEXT,
    "business_logo" TEXT,
    "store_logo" TEXT,
    "opening_hours" TEXT,
    "weekly_off_day" TEXT,
    "bank_details" TEXT,
    "upi_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_uuid_key" ON "public"."Vendor"("uuid");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
