import {
IsOptional,
IsString,
IsEmail,
IsBoolean,
IsNumber
} from "class-validator";

export class UpdateTenantDto {

@IsOptional()
@IsString()
legalName?: string;

@IsOptional()
@IsString()
displayName?: string;

@IsOptional()
@IsEmail()
email?: string;

@IsOptional()
@IsString()
phone?: string;

@IsOptional()
@IsString()
addressLine?: string;

@IsOptional()
@IsString()
city?: string;

@IsOptional()
@IsString()
country?: string;

@IsOptional()
@IsString()
taxNumber?: string;

@IsOptional()
@IsString()
licenseNumber?: string;

@IsOptional()
@IsString()
bankName?: string;

@IsOptional()
@IsString()
iban?: string;

@IsOptional()
@IsString()
swiftCode?: string;

@IsOptional()
@IsBoolean()
vatEnabled?: boolean;

@IsOptional()
@IsNumber()
vatRate?: number;

@IsOptional()
@IsString()
vatExemptionNote?: string;

}