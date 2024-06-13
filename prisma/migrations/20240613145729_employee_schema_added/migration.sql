-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "positionName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "parentId" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_username_key" ON "Employee"("username");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
