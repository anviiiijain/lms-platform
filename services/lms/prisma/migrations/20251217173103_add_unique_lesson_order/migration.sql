/*
  Warnings:

  - A unique constraint covering the columns `[courseId,order]` on the table `lessons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lessons_courseId_order_key" ON "lessons"("courseId", "order");
