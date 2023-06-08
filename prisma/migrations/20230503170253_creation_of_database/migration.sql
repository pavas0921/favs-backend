-- CreateTable
CREATE TABLE `fav` (
    `favid` INTEGER NOT NULL AUTO_INCREMENT,
    `fav_name` VARCHAR(80) NOT NULL,
    `fav_description` VARCHAR(255) NOT NULL,
    `user_userid` INTEGER NOT NULL,

    INDEX `fk_fav_user_idx`(`user_userid`),
    PRIMARY KEY (`favid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `userid` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(70) NOT NULL,
    `last_name` VARCHAR(70) NOT NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fav` ADD CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_userid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;
