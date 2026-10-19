import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiPropertyOptional({ description: 'ID Token received from Google' })
  @IsOptional()
  @IsString()
  googleIdToken?: string;

  @ApiPropertyOptional({
    description: 'Authorization code received from Google OAuth',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Redirect URI used during OAuth authorization',
  })
  @IsOptional()
  @IsString()
  redirectUri?: string;
}

export class FacebookLoginDto {
  @ApiPropertyOptional({ description: 'Access Token received from Facebook' })
  @IsOptional()
  @IsString()
  facebookAccessToken?: string;

  @ApiPropertyOptional({
    description: 'Authorization code received from Facebook OAuth',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Redirect URI used during OAuth authorization',
  })
  @IsOptional()
  @IsString()
  redirectUri?: string;
}
