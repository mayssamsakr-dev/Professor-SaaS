import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('universities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UniversityController {

  constructor(
    private readonly universityService: UniversityService,
  ) {}

  @Post()
  @Roles(UserRole.OWNER)
  async create(
    @Body() createUniversityDto: CreateUniversityDto,
    @Req() req: any,
  ) {
    return this.universityService.create(
      createUniversityDto,
      req.user.tenantId,
    );
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.universityService.findAll(
      req.user.tenantId,
    );
  }
  @Delete(':id')
remove(
  @Param('id') id: string,
  @Req() req: any
) {

  return this.universityService.remove(
    Number(id),
    req.user.tenantId
  );

}

@Put(':id')
update(

  @Param('id') id: string,

  @Body() dto: any,

  @Req() req: any

) {

  return this.universityService.update(

    Number(id),

    dto,

    req.user.tenantId

  );

}

}