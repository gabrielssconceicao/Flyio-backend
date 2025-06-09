-- CreateTable
CREATE TABLE "LikePost" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LikePost_pkey" PRIMARY KEY ("postId","userId")
);

-- AddForeignKey
ALTER TABLE "LikePost" ADD CONSTRAINT "LikePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikePost" ADD CONSTRAINT "LikePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
