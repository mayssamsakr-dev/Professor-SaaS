import { Module } from "@nestjs/common";

import { ClassGroupController } from "./class-group.controller";
import { ClassGroupService } from "./class-group.service";

import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],

  controllers: [ClassGroupController],

  providers: [ClassGroupService]
})
export class ClassGroupModule {}