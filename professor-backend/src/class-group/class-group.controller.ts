import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards
} from "@nestjs/common";

import { ClassGroupService } from "./class-group.service";
import { CreateClassGroupDto } from "./dto/create-class-group.dto";
import { UpdateClassGroupDto } from "./dto/update-class-group.dto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("class-groups")
@UseGuards(JwtAuthGuard)
export class ClassGroupController {

  constructor(private readonly service: ClassGroupService) {}

  @Get()
  findAll(@Req() req: any) {

    const tenantId = req.user.tenantId;

    return this.service.findAll(tenantId);
  }

  @Post()
  create(
    @Body() dto: CreateClassGroupDto,
    @Req() req: any
  ) {

    const tenantId = req.user.tenantId;

    return this.service.create(dto, tenantId);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateClassGroupDto,
    @Req() req: any
  ) {

    const tenantId = req.user.tenantId;

    return this.service.update(Number(id), dto, tenantId);
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @Req() req: any
  ) {

    const tenantId = req.user.tenantId;

    return this.service.remove(Number(id), tenantId);
  }

}